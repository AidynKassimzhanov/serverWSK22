
const { AdminUser, Game } = require('../../models/db')

const Index = (req, res) => {
    res.render("login")
}

const Login = async (req, res) => {

    if (!req.body) return res.json("error")
    // console.log(req.body);
    const userS = req.session.user;
    const { username, password } = req.body
    
    const user = await AdminUser.findOne({where: { username: username}})
    // console.log(user);
    if (!user) return res.json("User not found!")
    if (user.password !== password) return res.json("Your password is wrong!")
    console.log(req.session);
    req.session.user = { username: username, password: password };

    res.redirect("/admin/users")

    // res.render("adminUsers")
}

module.exports = { Index, Login }