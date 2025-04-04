document.addEventListener('DOMContentLoaded', function() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeCss = document.getElementById('theme-css');
  
  // Проверяем сохраненную тему в localStorage
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Устанавливаем начальную тему
  setTheme(currentTheme);
  
  // Функция для установки темы
  function setTheme(theme) {
    themeCss.href = `/css/${theme}.css`;
    localStorage.setItem('theme', theme);
    
    // Обновляем текст кнопки
    themeToggleBtn.textContent = theme === 'light' ? 'Тёмная тема' : 'Светлая тема';
  }
  
  // Обработчик нажатия на кнопку
  themeToggleBtn.addEventListener('click', function() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
  });
});