const jwt = require('jsonwebtoken');
const { PlatformUser } = require('../../models/db');


const SignIn = async (req, res) => {
    const {username, password} = req.body

    const user = await PlatformUser.findOne({where: { username: username}})

    if (user && user.username === username && user.password === password) {
        // Генерация токена
        const token = jwt.sign({ username: req.body.username }, 'secret', { expiresIn: '1h' });
        // Отправка токена в ответе
        res.status(200).json({ status: 'success', token });
    } else {
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
}

const SignUp = async (req, res) => {
    const {username, password} = req.body

    const user = await PlatformUser.findOne({where: { username: username}})

    if (user) return res.status(401).json({ status: 'error', message: 'This user already exists' });

    try {
        const user = await PlatformUser.create({ username: username, password: password})
        const token = jwt.sign({ username: username }, 'secret', { expiresIn: '1h' });
        res.status(201).json({ status: 'success', token });
    }
    catch (error) {
        res.status(401).json({ status: 'error', message: 'User creation error' });
    }
}

const SignOut = async (req, res) => {
    const users = await PlatformUser.findAll()
    res.json({users: users})
}

module.exports = { SignIn, SignUp, SignOut }