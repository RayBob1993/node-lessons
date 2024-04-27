import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';

const dbPath = './db.json';

const baseURL = 'http://localhost:8080';

const server = createServer((request, response) => {
    const url = request.url;
    const method = request.method;

    response.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
    });

    if (method === 'GET') {
        const parsedURL = new URL(baseURL + url);
        const file = JSON.parse(readFileSync(dbPath, 'utf-8'));

        const queryID = parsedURL.searchParams.get('id');

        if (queryID) {
            const item = file.find((item) => item.id === parseInt(queryID));

            response.write(JSON.stringify({
                data: item
            }));

            response.end();
        } else {
            response.write(JSON.stringify({
                data: file
            }));

            response.end();
        }
    }

    if (method === 'POST') {
        request
            .on('data', (chunk) => {
                const data = JSON.parse(chunk.toString());

                const file = JSON.parse(readFileSync(dbPath, 'utf-8'));

                const id = data.id;

                const hasDBId = file.find((item) => item.id === parseInt(id));

                if (hasDBId) {
                    response.write(JSON.stringify({
                        error: `Пользователь с id ${id} уже зарегистрирован`
                    }));
                } else {
                    file.push(data);

                    writeFileSync(dbPath, JSON.stringify(file));

                    response.write(JSON.stringify({
                        message: `Пользователь с id ${id} успешно зарегистрирован`
                    }));
                }
            })
            .on('end', () => {
                response.end();
            })
    }
});

server.listen(8080, () => {
    console.log('Server started on port 8080');
});