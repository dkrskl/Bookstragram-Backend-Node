import {Application} from 'express';
import {UserModule} from './user/module';

export function applyRoutes(app: Application) {
    app.use('/', UserModule.create());
}
