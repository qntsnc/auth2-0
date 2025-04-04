/**
 * Простое хранилище пользователей в памяти
 * В реальных приложениях следует использовать базу данных
 */
const users = new Map();

/**
 * Создает нового пользователя
 * @param {string} username - имя пользователя
 * @param {string} passwordHash - хэшированный пароль
 * @returns {Object} - информация о пользователе
 */
function createUser(username, passwordHash) {
  if (users.has(username)) {
    throw new Error('Пользователь уже существует');
  }
  
  const user = {
    id: Date.now().toString(),
    username,
    passwordHash,
    createdAt: new Date()
  };
  
  users.set(username, user);
  return user;
}

/**
 * Находит пользователя по имени
 * @param {string} username - имя пользователя
 * @returns {Object|null} - информация о пользователе или null
 */
function findUserByUsername(username) {
  return users.get(username) || null;
}

/**
 * Находит пользователя по ID
 * @param {string} userId - ID пользователя
 * @returns {Object|null} - информация о пользователе или null
 */
function findUserById(userId) {
  for (const [_, user] of users) {
    if (user.id === userId) {
      return user;
    }
  }
  return null;
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById
};