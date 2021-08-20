import {Router} from 'express';
import {RequestHandlerParams} from 'express-serve-static-core';

export abstract class ModuleBase {
    private readonly router = Router();
    private initialized = false;

    protected use(path: string, ...handler: RequestHandlerParams[]) {
        this.router.use(path, ...handler);
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
