document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const logoutBtn = document.getElementById('logout-btn');
    const refreshDataBtn = document.getElementById('refresh-data');
    const userInfoEl = document.getElementById('user-info');
    const dataContainerEl = document.getElementById('data-container');
    const cacheStatusEl = document.getElementById('cache-status');
    
    // Загрузка данных профиля при загрузке страницы
    loadUserProfile();
    
    // Обработчик выхода
    logoutBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          window.location.href = '/';
        } else {
          alert('Ошибка при выходе из системы');
        }
      } catch (error) {
        console.error('Ошибка при выходе:', error);
        alert('Ошибка соединения с сервером');
      }
    });
    
    // Обработчик обновления данных
    refreshDataBtn.addEventListener('click', loadCachedData);
    
    // Функция загрузки профиля пользователя
    async function loadUserProfile() {
      try {
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          // Если ошибка 401, перенаправляем на страницу входа
          if (response.status === 401) {
            window.location.href = '/';
            return;
          }
          
          throw new Error('Ошибка загрузки профиля');
        }
        
        const userData = await response.json();
        
        // Отображение данных пользователя
        userInfoEl.innerHTML = `
          <div class="user-profile">
            <p><strong>Имя пользователя:</strong> ${userData.username}</p>
            <p><strong>ID пользователя:</strong> ${userData.id}</p>
            <p><strong>Дата регистрации:</strong> ${new Date(userData.createdAt).toLocaleString()}</p>
          </div>
        `;
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        userInfoEl.innerHTML = '<p class="error">Ошибка загрузки данных профиля</p>';
      }
    }
    
    // Функция загрузки данных с кэшированием
    async function loadCachedData() {
      try {
        // Изменяем текст кнопки и добавляем класс "loading"
        refreshDataBtn.textContent = 'Загрузка...';
        refreshDataBtn.disabled = true;
        cacheStatusEl.textContent = 'Загрузка данных...';
        
        const response = await fetch('/data');
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        
        const result = await response.json();
        const { data, fromCache, cachedAt } = result;
        
        // Обновляем статус кэша
        if (fromCache) {
          cacheStatusEl.textContent = `Данные загружены из кэша. Время кэширования: ${new Date(cachedAt).toLocaleString()}`;
        } else {
          cacheStatusEl.textContent = `Данные обновлены. Время обновления: ${new Date(cachedAt).toLocaleString()}`;
        }
        
        // Отображаем таблицу с данными
        renderDataTable(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        dataContainerEl.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
        cacheStatusEl.textContent = 'Ошибка при загрузке данных';
      } finally {
        // Возвращаем кнопку в исходное состояние
        refreshDataBtn.textContent = 'Обновить данные';
        refreshDataBtn.disabled = false;
      }
    }
    
    // Функция отрисовки таблицы данных
    function renderDataTable(data) {
      const { items, total, generatedAt } = data;
      
      if (!items || items.length === 0) {
        dataContainerEl.innerHTML = '<p>Нет данных для отображения</p>';
        return;
      }
      
      let tableHtml = `
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Значение</th>
              <th>Временная метка</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      items.forEach(item => {
        tableHtml += `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.value}</td>
            <td>${new Date(item.timestamp).toLocaleString()}</td>
          </tr>
        `;
      });
      
      tableHtml += `
          </tbody>
        </table>
        <div class="data-summary">
          <p>Всего элементов: ${total}</p>
          <p>Сгенерировано: ${new Date(generatedAt).toLocaleString()}</p>
        </div>
      `;
      
      dataContainerEl.innerHTML = tableHtml;
    }
  });