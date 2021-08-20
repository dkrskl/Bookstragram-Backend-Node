export class HttpError<T> extends Error {
    constructor(public readonly statusCode: number, public readonly detail?: T) {
        super();
    }
}
