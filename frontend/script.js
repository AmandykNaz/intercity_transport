document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
  
    // Отправка данных на сервер
    fetch(`/search?departure=${departure}&destination=${destination}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        const flightsList = document.getElementById('flightsList');
        flightsList.innerHTML = '';
  
        if (data.length === 0) {
          flightsList.innerHTML = '<li>Рейсы не найдены</li>';
        } else {
          data.forEach(flight => {
            const li = document.createElement('li');
            li.textContent = `Рейс: ${flight.departure} - ${flight.destination} | Дата: ${flight.date}`;
            flightsList.appendChild(li);
          });
        }
      })
      .catch(err => console.error('Error:', err));
  });
  
  document.getElementById('authForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Логика для аутентификации (например, отправка на сервер)
    console.log(`Username: ${username}, Password: ${password}`);
  });
  
