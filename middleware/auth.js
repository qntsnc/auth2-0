/**
 * Middleware для проверки аутентификации пользователя
 * Если пользователь не авторизован, отправляет ответ 401
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.status(401).json({ error: 'Не авторизован' });
  }
  
  /**
   * Middleware для проверки аутентификации с редиректом
   * Используется для защиты HTML-страниц
   */
  function isAuthenticatedWithRedirect(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.redirect('/');
  }
  
  /**
   * Middleware для проверки, что пользователь не авторизован
   * Используется для страниц авторизации/регистрации
   */
  function isNotAuthenticated(req, res, next) {
    if (!req.session || !req.session.userId) {
      return next();
    }
    return res.redirect('/profile');
  }
  
  module.exports = {
    isAuthenticated,
    isAuthenticatedWithRedirect,
    isNotAuthenticated
  };