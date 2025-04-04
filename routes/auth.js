const express = require('express');
const path = require('path');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { createUser, findUserByUsername, findUserById } = require('../utils/sessionStore');
const { isAuthenticated, isAuthenticatedWithRedirect, isNotAuthenticated } = require('../middleware/auth');

const router = express.Router();


router.get('/', isNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


router.get('/profile', isAuthenticatedWithRedirect, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/profile.html'));
});


router.get('/api/profile', isAuthenticated, (req, res) => {
  const user = findUserById(req.session.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  const { passwordHash, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }
    
    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь с таким именем уже существует' });
    }
    
    const passwordHash = await hashPassword(password);
    const newUser = createUser(username, passwordHash);
    
    req.session.userId = newUser.id;
    
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
    }
    
    const user = findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }
    
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }
    
    req.session.userId = user.id;
    
    res.json({ message: 'Вход выполнен успешно' });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ error: 'Ошибка при входе в систему' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Ошибка при выходе:', err);
      return res.status(500).json({ error: 'Не удалось выйти из системы' });
    }
    
    res.clearCookie('connect.sid');
    res.json({ message: 'Выход выполнен успешно' });
  });
});

module.exports = router;