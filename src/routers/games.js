import { readFileSync } from 'node:fs';
import { Router } from '../../core/index.js';

const gamesRouter = new Router();

gamesRouter.get('/games', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBGamesDaily = JSON.parse(readFileSync('./src/db/games-daily.json', 'utf-8'));
    const DBDaily = JSON.parse(readFileSync('./src/db/daily.json', 'utf-8'));
    const DBGames = JSON.parse(readFileSync('./src/db/games.json', 'utf-8'));
    const DBDailyTasks = JSON.parse(readFileSync('./src/db/daily-tasks.json', 'utf-8'));
    const DBTasks = JSON.parse(readFileSync('./src/db/tasks.json', 'utf-8'));

    const result = DBGamesDaily.map(gameDaily => {
        // id игры
        const gameId = gameDaily.gameId;

        // id записи, где дейлик связан с задачами
        const gameDailyTasksId = gameDaily.dailyTasksId;

        // Нашли игру в базе игр
        const game = DBGames.find(game => game.id === gameId);

        // Нашли запись дейлика с задачами
        const dailyTasks = DBDailyTasks.find(daily => daily.id === gameDailyTasksId);

        // Нашли дейлик в базе дейликов
        const daily = DBDaily.find(daily => daily.id === dailyTasks.dailyId);

        // Нашли задачи
        const tasks = DBTasks.filter(task => {
            return dailyTasks.tasks.includes(task.id);
        });

        return {
            gameName: game.name,
            daily: {
                name: daily.name,
                tasks
            }
        }
    });

    response.end(JSON.stringify(result));
});

export {
    gamesRouter
};