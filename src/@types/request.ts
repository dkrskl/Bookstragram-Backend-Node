import {Filter} from '../middleware/filter';

declare module 'express' {
    export interface Request {
        filter?: Filter;
    }

    export interface Response {
        json_complete: boolean;
    }
}
