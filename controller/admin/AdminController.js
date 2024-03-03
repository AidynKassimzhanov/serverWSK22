const { AdminUser } = require("../../models/db")

const AdminUsers = async (req, res) => {
    const admins = await AdminUser.findAll()
    res.render("adminUsers", {admins: admins})
}

module.exports = {AdminUsers}