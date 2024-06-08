import { Application } from './core/index.js';
import { usersRouter, catalogRouter } from './src/routers/index.js';

const server = new Application();

server.addRouter(usersRouter);
server.addRouter(catalogRouter);

server.listen(8080);