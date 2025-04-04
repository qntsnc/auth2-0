const fs = require('fs-extra');
const path = require('path');

/**
 * Middleware для файлового кэширования с TTL
 * @param {string} cacheKey - уникальный ключ для элемента кэша
 * @param {number} ttl - время жизни кэша в миллисекундах (по умолчанию 1 минута)
 */
function fileCache(cacheKey, ttl = 60000) {
  const cacheDir = path.join(__dirname, '..', 'cache');
  const cacheFile = path.join(cacheDir, `${cacheKey}.json`);

  return async (req, res, next) => {
    try {
      // Проверяем существование файла кэша
      if (await fs.pathExists(cacheFile)) {
        const cacheData = await fs.readJson(cacheFile);
        const cacheTime = cacheData.timestamp;
        const currentTime = Date.now();

        // Если кэш валиден (не истек срок)
        if (currentTime - cacheTime < ttl) {
          console.log(`Возвращаем данные из кэша: ${cacheKey}`);
          return res.json({ 
            data: cacheData.data,
            fromCache: true, 
            cachedAt: new Date(cacheTime).toISOString()
          });
        }
      }

      // Если кэш отсутствует или устарел
      // Создаем res.cacheData для сохранения данных в кэш
      res.cacheData = async (data) => {
        const cacheContent = {
          timestamp: Date.now(),
          data
        };
        
        await fs.ensureDir(cacheDir);
        await fs.writeJson(cacheFile, cacheContent);
        
        return res.json({ 
          data, 
          fromCache: false,
          cachedAt: new Date(cacheContent.timestamp).toISOString()
        });
      };
      
      next();
    } catch (error) {
      console.error('Ошибка кэширования:', error);
      next(error);
    }
  };
}

module.exports = {
  fileCache
};