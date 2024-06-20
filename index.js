import { Application } from './core/index.js';
import { 
    booksRouter, 
    gamesRouter, 
    usersRouter,
    catalogRouter
} from './src/routers/index.js';

const server = new Application();

server.addRouter(booksRouter);
server.addRouter(gamesRouter);
server.addRouter(usersRouter);
server.addRouter(catalogRouter);

server.listen(8080);