const Router = require('express');
const { Users } = require('./controller/api/UserController');
const { SignIn, SignUp, SignOut } = require('./controller/api/AuthController');
const verifyToken = require('./controller/api/jwtVerifyMiddleware');
const { Games, GameCreate, GameGet, GameUpload, GameUpdate, GameServe } = require('./controller/api/GameController');
const apiRouter = new Router()

const multer = require('multer');
const storage = require('./utils/multerGameUpload');



const upload = multer({ storage: storage });

apiRouter.post('/signin', SignIn)
apiRouter.post('/signup', SignUp)

apiRouter.use('/', verifyToken)

apiRouter.post('/signout', SignOut)
// apiRouter.get('/users', Users)

apiRouter.get('/games', Games)
apiRouter.post('/games', GameCreate)
apiRouter.get('/games/:slug', GameGet)
apiRouter.post('/games/:slug/upload', upload.single('zipfile'), GameUpload)
apiRouter.get('/games/:slug/:version', GameServe)
apiRouter.put('/games/:slug', GameUpdate)

module.exports = apiRouter