const jwt = require('jsonwebtoken');
const { Token } = require('../../models/db');

// Middleware для проверки JWT
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // Проверяем, есть ли токен
    if (!token) {
        return res.status(401).json({ message: 'Токен отсутствует' });
    }

    try {
        // Проверяем токен на валидность
        const decoded = jwt.verify(token, 'secret');

        // Проверяем, не аннулирован ли токен
        const isTokenValid = await Token.findOne({ where: { token: token } });
        if (!isTokenValid) {
            return res.status(403).json({ message: 'Токен недействителен' });
        }

        // Если токен валиден и не аннулирован, пропускаем запрос дальше
        next();
    } catch (error) {
        console.error('Ошибка верификации токена:', error);
        return res.status(403).json({ message: 'Ошибка верификации токена' });
    }
};

module.exports = verifyToken;