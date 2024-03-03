
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
      // Если сессия пользователя существует, продолжаем выполнение запроса
      next();
    } else {
      // Если сессия пользователя отсутствует, перенаправляем на страницу входа или отправляем сообщение об ошибке
      res.redirect('/admin');
    }
};

module.exports = requireLogin