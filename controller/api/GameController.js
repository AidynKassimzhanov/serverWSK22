const { Game, PlatformUser, GameScore, GameVersion } = require("../../models/db")
const slugify = require('slugify');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

// ************* Game Show All *************************************************************************************************************
const Games = async (req, res) => {
    
    try {
        let {page, size, sortBy, sortDir} = req.body

        page = parseInt(page)
        size = parseInt(size)

        const games = await Game.findAll({
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

// ************* Game Create *************************************************************************************************************
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

// ************* Game Show One *************************************************************************************************************
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

// ************* Game Update *************************************************************************************************************
const GameUpdate = async (req, res) => {
    const slug = req.params.slug
    const { title, description } = req.body
    // console.log(title, description);
    // console.log(req.userId);
    try {
        const game = await Game.findOne({ 
            where: { slug: slug }, 
            include: [ PlatformUser ] 
        })

        if (game && game.PlatformUser.id !== req.userId) {
            return res.status(403).json({
                "status": "forbidden",
                "error": "You are not the game author"
            })
        }

        game.title = title
        game.description = description
        await game.save()

        return res.status(204).json({"Status": "Update success"})
    } catch (err) {
        return res.status(400).json({"error Game Update": err})
    }
}

// ************* Game Delete *************************************************************************************************************
const GameDelete = async (req, res) => {
    const { slug } = req.params
    try {
        const game = await Game.findOne({ 
            where: { slug: slug }, 
            include: [ PlatformUser ] 
        })

        if (game && game.PlatformUser.id !== req.userId) {
            return res.status(403).json({
                "status": "forbidden",
                "error": "You are not the game author"
            })
        }

        game.destroy()

        return res.status(204).json()
    } catch (err) {
        return res.status(400).json({"error Game Update": err})
    }
}

// ************* Game File Get for Play *************************************************************************************************************
const GameServe = async (req, res) => {
    const { slug, version } = req.params

    const rootDir = path.resolve(__dirname, '../..');
    console.log(rootDir);

    res.sendFile(path.join(rootDir, 'uploads', slug, version, 'index.html'));
}

// ************* Gmae file upload *************************************************************************************************************
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

        //Разархивирование файла
        try {
            await fs.createReadStream(req.file.path)
                .pipe(unzipper.Extract({ path: folderPath }))
                .promise();
        } catch (err) {
            console.error('ZIP file extraction fails:', err);
        }


        const filename = req.folderPath + '/' + req.file.originalname

        // Удаление zip файла
        fs.unlink(filename, (err) => {
            if (err) {
                console.error('Unspecified IO error:', err);
                return;
            }
            console.log('Файл успешно удален:', filename);
            });        

        return res.status(201).json({"status": "Upload successful"})
    } catch (err) {
        return res.status(400).json({"error Game Upload": err})
    }
}  

module.exports = {
    Games, 
    GameCreate, 
    GameGet, 
    GameUpload, 
    GameUpdate, 
    GameServe, 
    GameDelete
}