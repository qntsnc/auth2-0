const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { fileCache } = require('../middleware/cache');

const router = express.Router();

function generateRandomData() {
  const items = [];
  const now = new Date();
  
  for (let i = 0; i < 5; i++) {
    items.push({
      id: Math.floor(Math.random() * 10000),
      name: `Элемент ${i + 1}`,
      value: Math.floor(Math.random() * 100),
      timestamp: now.toISOString()
    });
  }
  
  return {
    items,
    total: items.length,
    generatedAt: now.toISOString()
  };
}

router.get('/', isAuthenticated, fileCache('user-data', 60000), (req, res) => {
  setTimeout(() => {
    const data = generateRandomData();
    res.cacheData(data);
  }, 500);
});

module.exports = router;