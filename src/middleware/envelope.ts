import {Request, Response, NextFunction} from 'express';

export function envelopeMiddleware(request: Request, response: Response, next: NextFunction) {
    const json = response.json;
    response.json = function () {
        response.json_complete = true;
        if (this.statusCode > 399) {
            arguments[0] = {status: 'failure', error: arguments[0]};
        } else if (this.statusCode > 199 && this.statusCode < 299) {
            arguments[0] = {status: 'success', data: arguments[0]};
        }

        return json.apply(response, arguments);
    };


    const send = response.send;
    response.send = function () {
        if (typeof arguments[0] === 'string') {
            if (!response.json_complete) {
                return response.json.apply(response, arguments);
            }
        }

        return send.apply(response, arguments);
    };

    next();
}
