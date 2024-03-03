const session = require('express-session');

const sessionConfig = {
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 60 * 60 * 1000 // Например, устанавливаем время жизни куки в 24 часа
  }
};


const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
      // Если сессия пользователя существует, продолжаем выполнение запроса
      next();
    } else {
      // Если сессия пользователя отсутствует, перенаправляем на страницу входа или отправляем сообщение об ошибке
      res.status(401).send('Unauthorized');
    }
};


module.exports = session(sessionConfig, requireLogin);