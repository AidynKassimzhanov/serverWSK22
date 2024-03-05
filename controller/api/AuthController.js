const jwt = require('jsonwebtoken');
const { PlatformUser, Token } = require('../../models/db');


const SignIn = async (req, res) => {
    const {username, password} = req.body

    const user = await PlatformUser.findOne({where: { username: username}})

    if (user && user.username === username && user.password === password) {
        // Генерация токена
        const token = jwt.sign({ username: req.body.username }, 'secret', { expiresIn: '1h' });
        await Token.create({token: token})
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
        await Token.create({token: token})
        res.status(201).json({ status: 'success', token });
    }
    catch (error) {
        res.status(401).json({ status: 'error', message: 'User creation error' });
    }
}

const SignOut = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        // Удаляем токен из базы данных или помечаем его как недействительный
        await Token.destroy({ where: { token: token } });
        
        res.status(200).json({ status: 'success', message: 'Signed out successfully' });
    } catch (error) {
        console.error('Error during sign out:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

module.exports = { SignIn, SignUp, SignOut }