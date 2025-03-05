require('dotenv').config(); // Загружаем переменные окружения
const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('./db'); // Подключаем базу данных

const app = express();

// Используем EJS как шаблонизатор
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend'));

// Статические файлы (CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware
app.use(cors());
app.use(express.json()); // Для работы с JSON

// Главная страница
app.get('/', (req, res) => {
  res.render('index'); // Отправляем шаблон index.ejs
});

// Пример данных рейсов
const flights = [
  { departure: 'Москва', destination: 'Санкт-Петербург', date: '2025-03-15' },
  { departure: 'Москва', destination: 'Казань', date: '2025-03-16' },
  { departure: 'Казань', destination: 'Саратов', date: '2025-03-17' },
];

// Маршрут поиска рейсов
app.get('/search', (req, res) => {
  const { departure, destination, date } = req.query;

  const filteredFlights = flights.filter(flight =>
    flight.departure.toLowerCase().includes(departure.toLowerCase()) &&
    flight.destination.toLowerCase().includes(destination.toLowerCase()) &&
    flight.date === date
  );

  res.json(filteredFlights); // Возвращаем найденные рейсы в формате JSON
});

// Подключаем маршруты
const userRoutes = require('./routes/users');
const protectedRoutes = require('./routes/protected'); // Добавляем защищённые маршруты

app.use('/api/users', userRoutes);
app.use('/api/protected', protectedRoutes); // Подключаем маршрут для защищённых API

// Запуск сервера
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Проверка подключения к базе данных
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения:', err);
  } else {
    console.log('Подключение успешно:', res.rows);
  }
});
