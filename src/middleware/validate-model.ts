import {Request, Response, NextFunction, RequestHandler} from 'express';
import {validationResult} from 'express-validator';

export function validationMiddleware(...validations: RequestHandler[]): RequestHandler[] {
    return [
        ...validations,
        function (request: Request, response: Response, next: NextFunction) {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(422).send({
                    details: errors.formatWith(function (e) {
                        return {
                            error_message: e.msg,
                            location: e.location + '.' + e.param,
                            value: e.value,
                        };
                    }).array(),
                });
            }

            next();
        },
    ];
}
