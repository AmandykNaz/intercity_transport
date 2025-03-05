const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

// 🚀 Доступно только для администратора
router.get("/admin", authenticate, checkRole(["admin"]), (req, res) => {
    res.json({ message: "Добро пожаловать, администратор!" });
});

// 🚀 Доступно только для администратора станции
router.get("/station-admin", authenticate, checkRole(["station_admin"]), (req, res) => {
    res.json({ message: "Добро пожаловать, администратор станции!" });
});

// 🚀 Доступно для всех авторизованных пользователей
router.get("/user", authenticate, checkRole(["user", "admin", "station_admin"]), (req, res) => {
    res.json({ message: "Добро пожаловать, пользователь!" });
});

module.exports = router;
