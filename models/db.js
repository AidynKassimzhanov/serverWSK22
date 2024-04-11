const Sequelize = require('sequelize');

const sequelize = new Sequelize('wsk_25', 'root', '', {
  dialect: 'mysql', // или другая используемая вами СУБД
  host: 'localhost',
  port: '3307'
});


const AdminUser = sequelize.define('AdminUser', 
  {
    username: {
      type: Sequelize.STRING,
      // allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      // allowNull: false
    },
  }, {
    timestamps: true,
  }
);



const GameVersion = sequelize.define('GameVersion', {
    pathToGameFiles: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    version: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },{
    timespamps: true,
  }
);


const GameScore = sequelize.define('GameScore', {
        score: {
            type: Sequelize.INTEGER,
            allowNull: false
        }, 
    },
    {
        timestamps: true,
    },
);


const Game = sequelize.define('Game', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    thumbnail: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: ''
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    deleted_reason: {
      type: Sequelize.STRING,
      allowNull: true,
    }, 
}, {
    timestamps: true,
});


const PlatformUser = sequelize.define('PlatformUser', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },  
    deleted_reason: {
      type: Sequelize.STRING,
      allowNull: true,
  },  
}, {
  paranoid: true, // Включаем мягкое удаление
  deletedAt: 'deletedAt', // Устанавливаем свое собственное имя для поля удаления
});


const Token = sequelize.define('AccessToken', {
  token: {
      type: Sequelize.STRING,
      allowNull: false,
  }, 
}, {
timestamps: true, // Устанавливаем свое собственное имя для поля удаления
});

GameScore.belongsTo(PlatformUser)
PlatformUser.hasMany(GameScore)

Game.belongsTo(PlatformUser)
PlatformUser.hasMany(Game)

Game.hasMany(GameVersion)
GameVersion.belongsTo(Game)

GameScore.belongsTo(GameVersion)
GameVersion.hasMany(GameScore)



// Синхронизация моделей с базой данных
const connectToDB = async () => {

  try {

      await sequelize.authenticate();
      console.log('Соединение установлено успешно.');

      await sequelize.sync({ alter: true });
      // await sequelize.sync();
      console.log('Синхронизировано!.');
      
      } catch (error) {
          console.error('Ошибка:', error);
      } 

}



module.exports = {sequelize, connectToDB, AdminUser, Game, GameScore, GameVersion, PlatformUser, Token} 