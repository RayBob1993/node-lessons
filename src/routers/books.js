import { Router, DBJson } from '../../core/index.js';

const booksRouter = new Router();

booksRouter.get('/books', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBBooks = new DBJson('./src/db/books.json'); 

    response.end(JSON.stringify(DBBooks.getAll()));
});

booksRouter.post('/books', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    let data = '';

    request
        .on('data', (chunck) => {
            data += chunck;
        })
        .on('end', () => {
            const newBook = JSON.parse(data);

            const DBBooks = new DBJson('./src/db/books.json');

            const success = DBBooks.add(newBook);

            if (success) {
                response.end(JSON.stringify(DBBooks.getAll()));
            } else {
                response.end('Не удалось добавить книгу');
            }
        });
});

booksRouter.put('/books', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    let data = '';

    request
        .on('data', (chunck) => {
            data += chunck;
        })
        .on('end', () => {
            const url = new URL('http://127.0.0.1:8080' + request.url);
            const queryId = parseInt(url.searchParams.get('id'));

            const payload = JSON.parse(data);

            const DBBooks = new DBJson('./src/db/books.json');

            const success = DBBooks.updateById(queryId, payload);

            if (success) {
                response.end(JSON.stringify(DBBooks.getAll()));
            } else {
                response.end('Не удалось обновить данные книги');
            }
        });
});

export {
    booksRouter
};