import { readFileSync, writeFileSync } from 'node:fs';
import { Router } from '../../core/index.js';

const catalogRouter = new Router();

catalogRouter.get('/catalog', (request, response) => {
    const { searchParams } = new URL('http://127.0.0.1:8080' + request.url);
    const id = searchParams.get('id');

    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBCatalog = JSON.parse(readFileSync('./src/db/catalog.json', 'utf-8'));

    if (id) {
        const product = DBCatalog.find(product => product.id === parseInt(id));

        if (product) {
            response.end(JSON.stringify(product));
        } else {
            response.end(JSON.stringify({
                message: 'Товар не не найден'
            }));
        }
    } else {
        response.end(JSON.stringify(DBCatalog));
    }
});

export {
    catalogRouter
};