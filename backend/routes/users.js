require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET не задан в .env файле");
}

// 📌 Функция валидации
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  };
};

// 📌 Получить всех пользователей (без паролей)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// 📌 Регистрация нового пользователя с валидацией
router.post('/register', validate([
  body('username').trim().notEmpty().withMessage("Имя пользователя обязательно").isLength({ min: 3 }).withMessage("Имя должно быть не менее 3 символов"),
  body('password').isLength({ min: 6 }).withMessage("Пароль должен содержать минимум 6 символов"),
  body('role').optional().isIn(['user', 'admin', 'station_admin']).withMessage("Недопустимая роль")
]), async (req, res) => {
  try {
    let { username, password, role } = req.body;
    username = username.trim();

    const existingUser = await pool.query('SELECT id FROM users WHERE username ILIKE $1', [username]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role || 'user']
    );

    // 📌 Сразу создаем токен после регистрации
    const token = jwt.sign(
      { userId: newUser.rows[0].id, username: newUser.rows[0].username, role: newUser.rows[0].role },
      jwtSecret,
      { expiresIn: '1h', algorithm: "HS256" }
    );

    res.json({ message: "Пользователь создан!", user: newUser.rows[0], token });

  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

// 📌 Логин пользователя (авторизация)
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    console.log("🔹 Получены данные из запроса:", { username, password });

    if (!username || !password) {
      return res.status(400).json({ message: "Все поля обязательны!" });
    }

    const result = await pool.query('SELECT id, username, password_hash, role FROM users WHERE LOWER(username) = LOWER($1)', [username]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const user = result.rows[0];

    console.log("🔹 Введённый пароль:", password);
    console.log("🔹 Хеш из базы:", user.password_hash);

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '1h', algorithm: "HS256" }
    );

    console.log("🔹 Авторизация успешна, токен сгенерирован");
    res.json({ message: "Авторизация успешна", token });
  } catch (err) {
    console.error("Ошибка сервера:", err.message);
    res.status(500).send('Ошибка сервера');
  }
});


module.exports = router;
