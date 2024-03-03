// const AdminUser = require("./models/db");
// const Game = require("./models/Game");
// const GameVersion = require("./models/GameVersion");
// const PlatformUser = require("./models/PlatformUser");

const { AdminUser, PlatformUser, Game, GameVersion, GameScore } = require("./models/db");

const addInitialData = async () => {
    try {
      // Создаем начальные данные
      await AdminUser.bulkCreate([
        { username: 'admin1', password: 'hellouniverse1!' },
        { username: 'admin2', password: 'hellouniverse2!' },
      ]);

      await PlatformUser.bulkCreate([
        { username: 'player1', password: 'helloworld1!' },
        { username: 'player2', password: 'helloworld2!' },
        { username: 'dev1', password: 'hellobyte1!' },
        { username: 'dev2', password: 'hellobyte2!' },
      ]);
       
      const dev1 = await PlatformUser.findOne({ where: { username: 'dev1' } });
      const dev2 = await PlatformUser.findOne({ where: { username: 'dev2' } });

      await Game.bulkCreate([
        { title: 'Demo Game 1', slug: 'demo-game-1', description: 'This is demo game 1', PlatformUserId: dev1.id },
        { title: 'Demo Game 2', slug: 'demo-game-2', description: 'This is demo game 2', PlatformUserId: dev2.id },
      ]); 

      const game1 = await Game.findOne({ where: { title: 'Demo Game 1' } });
      const game2 = await Game.findOne({ where: { title: 'Demo Game 2' } });

      await GameVersion.bulkCreate([
        { GameId: game1.id, pathToGameFiles: 'demo-game-1-v1'},
        { GameId: game1.id, pathToGameFiles: 'demo-game-1-v2'},
        { GameId: game2.id, pathToGameFiles: 'demo-game-2-v1'},
      ]); 

      const player1 = await PlatformUser.findOne({ where: { username: 'player1' } });
      const player2 = await PlatformUser.findOne({ where: { username: 'player2' } });

      const game1Version1 = await GameVersion.findOne({ where: { GameId: game1.id }, order: [['createdAt', 'ASC']]  });
      const game1Version2 = await GameVersion.findOne({ where: { GameId: game1.id }, order: [['createdAt', 'DESC']]  });
      const game2Version1 = await GameVersion.findOne({ where: { GameId: game2.id }, order: [['createdAt', 'ASC']]  });
      
      await GameScore.bulkCreate([
        { PlatformUserId: player1.id, GameVersionId: game1Version1.id, score: 10},
        { PlatformUserId: player1.id, GameVersionId: game1Version1.id, score: 15},
        { PlatformUserId: player1.id, GameVersionId: game1Version2.id, score: 12},
        { PlatformUserId: player2.id, GameVersionId: game1Version2.id, score: 30},
        { PlatformUserId: player2.id, GameVersionId: game2Version1.id, score: 20},   

        { PlatformUserId: dev1.id, GameVersionId: game1Version2.id, score: 1000},      
        { PlatformUserId: dev1.id, GameVersionId: game1Version2.id, score: -300},  
        { PlatformUserId: dev2.id, GameVersionId: game1Version1.id, score: 5},  
        { PlatformUserId: dev2.id, GameVersionId: game1Version2.id, score: 200},     
      ]); 

      console.log('Начальные данные успешно добавлены.');
    } catch (error) {
      console.error('Ошибка при добавлении начальных данных:', error);
    }
};
  
module.exports = addInitialData