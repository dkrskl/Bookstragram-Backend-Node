import {ModuleBase} from '../module';
import {BookController} from './book/controller';
import {TagController} from './tag/controller';

export class UserModule extends ModuleBase {
    protected initialize(): void {
        this.use('/book', BookController.create());
        this.use('/tag', TagController.create());
    }
}
