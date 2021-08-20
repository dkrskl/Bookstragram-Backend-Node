import {HttpError} from './http-error';

export class InternalServerError<T> extends HttpError<T> {
    constructor(detail?: T) {
        console.log({errorDetail: detail});
        super(500, detail);
    }
}
