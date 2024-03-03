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

module.exports = session(sessionConfig);