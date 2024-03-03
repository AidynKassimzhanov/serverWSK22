// const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = require("./db");
// const PlatformUser = require("./PlatformUser");
// const GameVersion = require("./GameVersion");

// const Game = sequelize.define('Game', {
//     title: {
//         type: DataTypes.STRING,
//         // allowNull: false
//     },
//     description: {
//         type: DataTypes.STRING,
//         // allowNull: false
//     },
//     thumbnail: {
//         type: DataTypes.STRING,
//         // allowNull: false
//     },
//     slug: {
//         type: DataTypes.STRING,
//         // allowNull: false
//     }
// }, {
//     timestamps: true,
// });

// Game.belongsTo(PlatformUser)
// Game.hasMany(GameVersion);

// module.exports = Game