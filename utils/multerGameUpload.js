const multer = require('multer');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');


// Настройка хранилища для Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const slug = req.params.slug

    const gameFolderPath = path.join('uploads/', slug);

    //Создает главную папку с игрой и версиями
    fs.mkdir(gameFolderPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Ошибка при создании папки:', err);
          return;
        }
        console.log('Папка успешно создана:', gameFolderPath);
    });

    // Ищет в папке с игрой последнюю версию и создает папку последней версии
    fs.readdir(gameFolderPath, (err, files) => {
        if (err) {
          console.error('Ошибка чтения содержимого папки с игрой:', err);
          return;
        } 
        console.log('Содержимое папки с игрой:', files);
        
        
        let folderPath = ''
        if (files.length === 0) {
            const firstVersionFolder = 'v1';
            folderPath = path.join(gameFolderPath, firstVersionFolder);
        } else {
            const versionFolders = files.filter(file => fs.statSync(path.join(gameFolderPath, file)).isDirectory() && file.startsWith('v'));
            versionFolders.sort();
            const latestVersion = versionFolders.pop();
            const newVersionFolder = 'v' + (parseInt(latestVersion.slice(1)) + 1); // Форматируем новое имя версии
            folderPath = path.join(gameFolderPath, newVersionFolder);
        }

        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
              console.error('Ошибка при создании новой версии:', err);
              return;
            }

            cb(null, folderPath)
            req.folderPath = folderPath
        });
    })

},
    // сохранение файла
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})

module.exports = storage;