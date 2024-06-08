import { readFileSync } from 'node:fs';
import { Router } from '../../core/index.js';

const booksRouter = new Router();

booksRouter.get('/books', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBBooks = JSON.parse(readFileSync('./src/db/books.json', 'utf-8'));

    response.end(JSON.stringify(DBBooks));
});

export {
    booksRouter
};