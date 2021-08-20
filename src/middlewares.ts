import express, {Application} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {envelopeMiddleware} from './middleware/envelope';

export function applyMiddlewares(application: Application) {
    if (process.env.MORGAN_FORMATTER !== 'off') {
        application.use(morgan(process.env.MORGAN_FORMATTER));
    }

    application.use(helmet());
    application.use(cors({
        exposedHeaders: ['X-Total-Count'],
    }));
    application.use(express.json());
    application.use(envelopeMiddleware);
}
