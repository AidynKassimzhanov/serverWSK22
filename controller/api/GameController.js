const sequelize = require("sequelize")
const { Game, PlatformUser } = require("../../models/db")
const slugify = require('slugify');
const jwt = require('jsonwebtoken');

const Games = async (req, res) => {
    
    try {
        let {page, size, sortBy, sortDir} = req.body

        page = parseInt(page)
        size = parseInt(size)

        const games = await Game.findAll({
            // attributes: {
            //     include: [
            //         // Подзапрос для вычисления общей суммы очков по каждой игре
            //         [sequelize.literal('(SELECT SUM(`totalPoints`) FROM `GameScores` WHERE `ScoreGames`.`GameId` = `Game`.`id`)'), 'totalScore']
            //     ]
            // },
            offset: (page - 1) * size, // Смещение для страницы
            limit: size, // Размер страницы
            order: [[sortBy, sortDir.toUpperCase()]] // Сортировка и направление сортировки
        })

        const count = games.length

        res.json({
            "page": page,
            "size": size,
            "totalElements": count,
            "content": games
        })
    } catch (err) {
        res.json({"error": err})
    }

}

const GameCreate = async (req, res) => {
    const {title, description} = req.body
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    !token && console.log('Токен отсутствует');
    !title && console.log('Title отсутствует');
    
    const slug = slugify(title, { lower: true });

    try {
        const decoded = jwt.verify(token, 'secret');
        const user = await PlatformUser.findOne({ where: { username: decoded.username } });

        const game = await Game.create({title, description, slug, PlatformUserId: user.id})
        
        return res.status(201).json({
            "status": "success",
            "slug": game.slug
        })
    } catch (err) {
        return res.status(400).json({"error": err})
    } 

}

module.exports = {Games, GameCreate}