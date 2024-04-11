const cron = require('node-cron');

// Запускаем периодическую задачу для удаления просроченных токенов
cron.schedule('0 0 * * *', async () => {
    try {
        // Получаем все просроченные токены из базы данных
        const expiredTokens = await Token.findAll({ where: { expirationDate: { [Op.lt]: new Date() } } });
        
        // Удаляем просроченные токены из базы данных
        await Token.destroy({ where: { id: expiredTokens.map(token => token.id) } });

        console.log('Удалено', expiredTokens.length, 'просроченных токенов');
    } catch (error) {
        console.error('Ошибка при удалении просроченных токенов:', error);
    }
}, {
    timezone: 'Europe/Moscow' // Укажите ваш часовой пояс здесь
});