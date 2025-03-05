const bcrypt = require('bcryptjs');

// Проверяем пароль (должно вывести true или false)
bcrypt.compare('123456', '$2b$10$0Gg6H7hUqzCXYOlONQO2i.L0ZBKuFekcMHBjQVoYJZQOHoIH6U1uC')
  .then(result => console.log("Сравнение пароля:", result))
  .catch(error => console.error("Ошибка:", error));

// Генерируем новый хеш для пароля
bcrypt.hash('123456', 10)
  .then(hash => console.log("Новый хеш:", hash))
  .catch(error => console.error("Ошибка хеширования:", error));
