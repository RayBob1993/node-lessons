import { readFileSync } from 'node:fs';
import { Router } from '../../core/index.js';

const usersRouter = new Router();

usersRouter.get('/users', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBUsers = JSON.parse(readFileSync('./src/db/users.json', 'utf-8'));

    response.end(JSON.stringify(DBUsers));
});

usersRouter.get('/users-books-favorites', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBUsersBooksFavorites = JSON.parse(readFileSync('./src/db/users-favorites.json', 'utf-8'));
    const DBUsers = JSON.parse(readFileSync('./src/db/users.json', 'utf-8'));
    const DBBooks = JSON.parse(readFileSync('./src/db/books.json', 'utf-8'));

    const result = DBUsersBooksFavorites.map(userBooks => {
        const userId = userBooks.userId;
        const booksIds = userBooks.books;

        const user = DBUsers.find(user => user.id === userId);

        const books = DBBooks.filter(task => {
            return booksIds.includes(task.id);
        });

        return {
            userName: user.name,
            books
        }
    });

    response.end(JSON.stringify(result));
});

export {
    usersRouter
};