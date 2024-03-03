const { PlatformUser } = require('../../models/db')

const Users = async (req, res) => {
    const users = await PlatformUser.findAll()
    res.json({users: users})
}

module.exports = {Users}