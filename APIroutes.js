const Router = require('express');
const { Users } = require('./controller/api/UserController');
const { SignIn, SignUp, SignOut } = require('./controller/api/AuthController');
const verifyToken = require('./controller/api/jwtVerifyMiddleware');
const { Games, GameCreate } = require('./controller/api/GameController');
const apiRouter = new Router()



apiRouter.post('/signin', SignIn)
apiRouter.post('/signup', SignUp)

apiRouter.use('/', verifyToken)

apiRouter.post('/signout', SignOut)
// apiRouter.get('/users', Users)

apiRouter.get('/games', Games)
apiRouter.post('/games', GameCreate)

module.exports = apiRouter