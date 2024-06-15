import { Router, DBJson } from '../../core/index.js';

const usersRouter = new Router();

usersRouter.get('/users', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBUsers = new DBJson('./src/db/users.json');

    response.end(JSON.stringify(DBUsers.getAll()));
});

usersRouter.post('/users', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    let data = '';

    request
        .on('data', (chunck) => {
            data += chunck;
        })
        .on('end', () => {
            const newUser = JSON.parse(data);

            const DBUsers = new DBJson('./src/db/users.json');

            const success = DBUsers.add(newUser);

            if (success) {
                response.end(JSON.stringify(DBUsers.getAll()));
            } else {
                response.end('Не удалось добавить пользователя');
            }
        });
});

usersRouter.delete('/users', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    let data = '';

    request
        .on('data', (chunck) => {
            data += chunck;
        })
        .on('end', () => {
            const payload = JSON.parse(data);

            const DBUsers = new DBJson('./src/db/users.json');

            const success = DBUsers.deleteById(payload.id);

            if (success) {
                response.end(JSON.stringify(DBUsers.getAll()));
            } else {
                response.end('Не удалось удалить пользователя');
            }
        });
});

usersRouter.get('/users-books-favorites', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBUsersBooksFavorites = new DBJson('./src/db/users-favorites.json');
    const DBUsers = new DBJson('./src/db/users.json');
    const DBBooks = new DBJson('./src/db/books.json');

    const result = DBUsersBooksFavorites.getAll().map(userBooks => {
        const userId = userBooks.userId;
        const booksIds = userBooks.books;

        const user = DBUsers.findById(userId);

        const books = DBBooks.getAll().filter(task => {
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