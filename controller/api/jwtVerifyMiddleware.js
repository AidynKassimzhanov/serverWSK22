const jwt = require('jsonwebtoken');

// Middleware для проверки JWT
const verifyToken = (req, res, next) => {
    // Получаем токен из заголовка Authorization
    let token = req.headers.authorization;

    token = token.split(' ')[1];
console.log(token);    
    // Проверяем, есть ли токен
    if (!token) {
        return res.status(401).json({ message: 'Токен отсутствует' });
    }

    // Верификация токена
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Ошибка верификации токена' });
        }

        // Если токен успешно верифицирован, добавляем расшифрованные данные в объект запроса
        // req.user = decoded;

        // Продолжаем выполнение следующих middleware или обработчика маршрута
        next();
    });
};

module.exports = verifyToken;