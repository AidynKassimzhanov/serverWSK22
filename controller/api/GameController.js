const sequelize = require("sequelize")
const { Game, PlatformUser, GameScore, GameVersion } = require("../../models/db")
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

const GameGet = async (req, res) => {
    const slug = req.params.slug

    try {
        const game = await Game.findOne({ 
            where: { slug: slug }, 
            include: [
                { model: PlatformUser }, 
                { 
                    model: GameVersion, 
                    include: [GameScore] 
                }
            ] 
        })
    
        let totalScore = 0;
        let lastVersion = {pathToGameFiles: "/dfsdfs"}

        if (game && game.GameVersions) {
            lastVersion = game.GameVersions[0]
            for (const version of game.GameVersions) {
                if (parseInt(version.version.slice(1)) > parseInt(lastVersion.version.slice(1))) {
                    lastVersion = version
                }
                if (version.GameScores) {
                    for (const score of version.GameScores) {
                        totalScore += score.score;
                    }
                }
            }
        }
        // console.log(lastVersion);
    
        return res.status(201).json({
            "slug": game.slug,
            "title": game.title,
            "description": game.description,
            "thumbnail": game.thumbnail,
            "uploadTimestamp": game.cretedAt,
            "author": game.PlatformUser.username,
            "scoreCount": totalScore || null,
            "gamePath": lastVersion.pathToGameFiles || null
        })
    } catch (err) {
        return res.status(400).json({"error": err})
    } 
}

const fs = require('fs');
const unzipper = require('unzipper');

const GameUpload = async (req, res) => {
    const slug = req.params.slug
    // console.log(req.userId);
    try {
        const game = await Game.findOne({ 
            where: { slug: slug }, 
            include: [ PlatformUser ] 
        })

        if (game && game.PlatformUser.id !== req.userId) {
            return res.status(400).json({"error": "User is not author of the game"})
        }

        if (!req.file) {
            return res.status(400).send('Unspecified IO error.');
        }

        const folderPath = req.folderPath + '/' 

        try {
            await fs.createReadStream(req.file.path)
                .pipe(unzipper.Extract({ path: folderPath }))
                .promise();
        } catch (err) {
            console.error('ZIP file extraction fails:', err);
        }

        
        
        // console.log(req.file.path);
        const filename = req.folderPath + '/' + req.file.originalname

        fs.unlink(filename, (err) => {
            if (err) {
                console.error('Unspecified IO error:', err);
                return;
            }
            console.log('Файл успешно удален:', filename);
            });        

        return res.status(201).json({"game": game})
    } catch (err) {
        return res.status(400).json({"error Game Upload": err})
    }
}        

module.exports = {Games, GameCreate, GameGet, GameUpload}