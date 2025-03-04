const express = require('express');
const app = express();
const path = require('path');

// Используем EJS как шаблонизатор
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend'));

// Статические файлы (CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend')));

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

  res.json(filteredFlights);  // Возвращаем найденные рейсы в формате JSON
});

// Запускаем сервер
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
