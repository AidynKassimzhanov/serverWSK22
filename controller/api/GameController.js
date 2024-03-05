const { Game } = require("../../models/db")

const Games = async (req, res) => {
    
    try {
        const {page, size, sortBy, sortDir} = req.body

        // console.log(page, size, sortBy, sortDir);
        

        const games = await Game.findAll()

        res.json({"content": games})
    }
    catch (err) {
        res.json({"error": err})
    }

}

module.exports = {Games}