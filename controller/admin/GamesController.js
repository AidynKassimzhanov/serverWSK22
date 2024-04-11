const { Game, PlatformUser, GameVersion } = require('../../models/db')

const Games = async (req, res) => {
    const games = await Game.findAll()

    Promise.all(games.map(async (game) => {
        const user = await PlatformUser.findOne({where: {id: game.PlatformUserId}})
        return ({
            game: game,
            user: user
        })
    })).then((results) => {
        res.render("games", {games: results})
        console.log('Все промисы завершились успешно:');
    })
    .catch((error) => {
        console.error('Один из промисов завершился с ошибкой:', error);
    });
}


const DeleteGame = async (req, res) => {
    const id = req.params.id
    const {reason} = req.body

    // const game = await Game.findOne({where: {id: id}})

    reason === 'Block' 
        ? await Game.update({deleted_reason: 'deleted'}, {where: {id: id}})
        : await Game.update({deleted_reason: '' }, {where: {id: id}})

    res.redirect("/game")
}

const ShowGame = async (req, res) => {
    const slug = req.params.slug

    const game = await Game.findOne({where: {slug: slug}})
 
    const user = await PlatformUser.findOne({where: {id: game.PlatformUserId}})

    const versions = await GameVersion.findAll({where: {GameId: game.id}})

    res.render("game", {game: game, user: user, versions: versions})
    // res.json(game)
}

module.exports = {Games, DeleteGame, ShowGame}