const Router = require('express');

const { Login, Index, Logout } = require('./controller/admin/LoginController');
const {AdminUsers} = require('./controller/admin/AdminController');
const {Users, Lock} = require('./controller/admin/UsersController');
const {Games, DeleteGame, ShowGame} = require('./controller/admin/GamesController');
const requireLogin = require('./controller/admin/SessionMiddlware');

const adminRouter = new Router()

adminRouter.route('/admin')
    .get(Index)
    .post(Login)



adminRouter.use('/', requireLogin)

adminRouter.get('/admin/logout', Logout)

adminRouter.get('/admin/users', AdminUsers)

adminRouter.get('/users', Users)
adminRouter.post('/users/:id/lock', Lock)

adminRouter.get('/game', Games)
adminRouter.post('/game/:id', DeleteGame)
adminRouter.get('/game/:slug', ShowGame)

// adminRouter.post('/admin/users', AdminUsers)

module.exports = adminRouter