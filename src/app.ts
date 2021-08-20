import express, {Application} from 'express';
import './config';
import {applyMiddlewares} from './middlewares';
import {applyRoutes} from './routes';
import {connectDB} from './db';

export class App {
    public app: Application;

    constructor() {
        this.app = express();

        applyMiddlewares(this.app);
        applyRoutes(this.app);
        connectDB();
    }

    public listen() {
        const port = process.env.PORT;
        this.app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    }
}
