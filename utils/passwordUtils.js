const bcrypt = require('bcrypt');

/**
 * Хэширует пароль с использованием bcrypt
 * @param {string} password - пароль в открытом виде
 * @returns {Promise<string>} - хэшированный пароль
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Проверяет соответствие пароля его хэшу
 * @param {string} password - пароль в открытом виде
 * @param {string} hash - хэшированный пароль
 * @returns {Promise<boolean>} - результат проверки
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};