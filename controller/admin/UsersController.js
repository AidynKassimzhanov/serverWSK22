const { PlatformUser } = require('../../models/db')

const Users = async (req, res) => {
    const users = await PlatformUser.findAll()
    res.render("users", {users: users})
}

const Lock = async (req, res) => {
    const id = req.params.id
    const {reason} = req.body
    
    reason === 'Unlock' 
        ? await PlatformUser.update({deleted_reason: ''}, {where: {id: id}})
        : await PlatformUser.update({deleted_reason: reason}, {where: {id: id}})

    res.redirect("/users")
}

module.exports = {Users, Lock}

