import { readFileSync, writeFileSync } from 'node:fs';
import { Router } from '../../core/index.js';

const usersRouter = new Router();

usersRouter.get('/users', (request, response) => {
    const { searchParams } = new URL('http://127.0.0.1:8080' + request.url);
    const id = searchParams.get('id');

    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBUsers = JSON.parse(readFileSync('./src/db/users.json', 'utf-8'));

    if (id) {
        const user = DBUsers.find(user => user.id === parseInt(id));

        if (user) {
            response.end(JSON.stringify(user));
        } else {
            response.end(JSON.stringify({
                message: 'Пользователь не найден'
            }));
        }
    } else {
        response.end(JSON.stringify(DBUsers));
    }
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
            const DBUsers = JSON.parse(readFileSync('./src/db/users.json', 'utf-8'));

            const hasUser = DBUsers.find(user => user.id === parseInt(newUser.id));

            if (!hasUser) {
                DBUsers.push(newUser);

                writeFileSync('./src/db/users.json', JSON.stringify(DBUsers));

                response.end(JSON.stringify(DBUsers));
            } else {
                response.end(JSON.stringify({
                    message: 'Такой пользователь уже есть'
                }));
            }
        });
});

usersRouter.get('/users/products', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const { searchParams } = new URL('http://127.0.0.1:8080' + request.url);
    const userId = searchParams.get('userId');

    const DBCatalog = JSON.parse(readFileSync('./src/db/catalog.json', 'utf-8'));
    const DBUsersProducts = JSON.parse(readFileSync('./src/db/users-products.json', 'utf-8'));

    const userProducts = DBUsersProducts.find(user => user.userId === parseInt(userId));

    if (userProducts) {
        const products = DBCatalog.filter(product => {
            const productId = product.id;

            return userProducts.products.includes(productId);
        });

        response.end(JSON.stringify({
            products
        }));
    } else {
        response.end(JSON.stringify({
            message: 'Товары пользователя не найдены'
        }));
    }
});

usersRouter.post('/users/products', (request, response) => {
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
            const DBUsersProducts = JSON.parse(readFileSync('./src/db/users-products.json', 'utf-8'));

            const hasUser = DBUsersProducts.find(user => user.userId === parseInt(newUser.userId));

            if (!hasUser) {
                DBUsersProducts.push(newUser);

                writeFileSync('./src/db/users-products.json', JSON.stringify(DBUsersProducts));

                response.end(JSON.stringify(DBUsersProducts));
            } else {
                response.end(JSON.stringify({
                    message: 'Такой пользователь уже есть'
                }));
            }
        });
});

usersRouter.delete('/users/products', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });
 
    let data = '';
    
    request
        .on('data', (chunck) => {
            data += chunck;
        })
        .on('end', () => {
            const userData = JSON.parse(data);
            const DBUsersProducts = JSON.parse(readFileSync('./src/db/users-products.json', 'utf-8'));

            const hasUser = DBUsersProducts.find(user => user.userId === parseInt(userData.userId));

            if (hasUser) {
                const newUsersProducts = DBUsersProducts.filter(userProducts => {
                    return userProducts.userId !== parseInt(userData.userId)
                });

                writeFileSync('./src/db/users-products.json', JSON.stringify(newUsersProducts));

                response.end(JSON.stringify(newUsersProducts));
            } else {
                response.end(JSON.stringify({
                    message: 'Такого пользователя нет'
                }));
            }
        });
});

export {
    usersRouter
};