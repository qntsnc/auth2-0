document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const messageEl = document.getElementById('message');
  
    // Переключение вкладок
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Удаляем класс active со всех вкладок и контентов
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Добавляем класс active нужной вкладке и контенту
        const tabId = tab.getAttribute('data-tab');
        tab.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Очищаем сообщение при переключении вкладок
        clearMessage();
      });
    });
  
    // Форма входа
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage();
      
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      
      if (!username || !password) {
        showMessage('Заполните все поля', 'error');
        return;
      }
      
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          showMessage(data.error || 'Ошибка входа', 'error');
          return;
        }
        
        // Успешный вход, перенаправляем
        window.location.href = '/profile';
      } catch (error) {
        showMessage('Ошибка соединения с сервером', 'error');
        console.error('Ошибка входа:', error);
      }
    });
  
    // Форма регистрации
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage();
      
      const username = document.getElementById('register-username').value.trim();
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (!username || !password) {
        showMessage('Заполните все поля', 'error');
        return;
      }
      
      if (password.length < 6) {
        showMessage('Пароль должен содержать минимум 6 символов', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showMessage('Пароли не совпадают', 'error');
        return;
      }
      
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          showMessage(data.error || 'Ошибка регистрации', 'error');
          return;
        }
        
        // Успешная регистрация, перенаправляем
        window.location.href = '/profile';
      } catch (error) {
        showMessage('Ошибка соединения с сервером', 'error');
        console.error('Ошибка регистрации:', error);
      }
    });
  
    // Функции для работы с сообщениями
    function showMessage(message, type) {
      messageEl.textContent = message;
      messageEl.classList.add(type);
      messageEl.style.display = 'block';
    }
    
    function clearMessage() {
      messageEl.textContent = '';
      messageEl.classList.remove('error', 'success');
      messageEl.style.display = 'none';
    }
  });