import {Router} from 'express';
import {
    NextFunction,
    Params,
    ParamsDictionary,
    Request,
    RequestHandlerParams,
    Response,
} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {HttpError} from './errors/http-error';
import {InternalServerError} from './errors/internal-server.error';

export interface InternalRequestHandler<P extends Params = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs> {
    // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
    (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction): Promise<any>;
}

function toHandler(requestHandler: InternalRequestHandler): RequestHandlerParams {
    return function (req: Request, resp: Response, next: NextFunction) {
        requestHandler(req, resp, next)
            .catch(error => {
                if (!(error instanceof HttpError)) {
                    error = new InternalServerError(error);
                }

                resp.status(error.statusCode);
                return error.detail;
            })
            .then(output => {
                resp.send(output);
            });
    };
}

export abstract class ControllerBase {
    private readonly router = Router();
    private initialized = false;

    protected get(path: string, requestHandler: InternalRequestHandler, ...handlers: RequestHandlerParams[]) {
        const newHandlers = [...handlers, toHandler(requestHandler)];
        this.router.get(path, ...newHandlers);
    }

    protected post(path: string, requestHandler: InternalRequestHandler, ...handlers: RequestHandlerParams[]) {
        const newHandlers = [...handlers, toHandler(requestHandler)];
        this.router.post(path, ...newHandlers);
    }

    protected put(path: string, requestHandler: InternalRequestHandler, ...handlers: RequestHandlerParams[]) {
        const newHandlers = [...handlers, toHandler(requestHandler)];
        this.router.put(path, ...newHandlers);
    }

    protected delete(path: string, requestHandler: InternalRequestHandler, ...handlers: RequestHandlerParams[]) {
        const newHandlers = [...handlers, toHandler(requestHandler)];
        this.router.delete(path, ...newHandlers);
    }

    protected use(path: string, requestHandler: InternalRequestHandler, ...handlers: RequestHandlerParams[]) {
        const newHandlers = [...handlers, toHandler(requestHandler)];
        this.router.use(path, ...newHandlers);
    };

    protected abstract initialize(): void;

    public static create() {
        // @ts-ignore
        const instance = new this();
        if (!instance.initialized) {
            instance.initialized = true;
            instance.initialize();
        }

        return instance.router;
    }
}
