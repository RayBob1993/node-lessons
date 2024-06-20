import { Router, DBJson } from '../../core/index.js';

const catalogRouter = new Router();

catalogRouter.get('/catalog', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBCatalog = new DBJson('./src/db/catalog.json'); 

    response.end(JSON.stringify(DBCatalog.getAll()));
});

export {
    catalogRouter
};