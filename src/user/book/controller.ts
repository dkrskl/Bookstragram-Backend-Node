import {ControllerBase} from '../../controller';
import {filter, filterMiddleware, sort} from '../../middleware/filter';
import {Request, Response} from 'express';
import {Book} from '../../db/book';
import {BookCreateModel, BookModel} from './model';
import {Tag} from '../../db/tag';
import {validationMiddleware} from '../../middleware/validate-model';
import {body} from 'express-validator';

export class BookController extends ControllerBase {
    protected initialize(): void {
        this.get('/', this.getList, filterMiddleware(
            filter('categoryTagId').exact(),
            filter('colorTagId').exact(),
            sort('created_at_time'),
            sort('name'),
        ));
        this.get('/:id', this.getById);
        this.post('/', this.create, validationMiddleware(
            body('name').isString().isLength({min: 2}),
            body('text').isString().isLength({min: 2}),
            body('categoryTagId').isMongoId().optional(),
            body('colorTagId').isMongoId().optional(),
            body('imageURL').isURL({
                require_protocol: true,
                protocols: [
                    'http',
                    'https',
                ],
            }),
            body('author').isString().isLength({min: 2}),
        ));
        this.delete('/:id', this.deleteById);
    }

    private create = async (request: Request<any, any, BookCreateModel>): Promise<BookModel> => {
        const {name, categoryTagId, colorTagId, imageURL, text, author} = request.body;
        const book = new Book({
                name,
                categoryTagId,
                colorTagId,
                imageURL,
                text,
                author,
            },
        );
        const categoryTag = await Tag.findById(book.categoryTagId);
        const colorTag = await Tag.findById(book.colorTagId);

        return book.save().then((b) => ({
            id: b.id,
            name: b.name,
            text: b.text,
            categoryTagId: categoryTag?.id,
            categoryTagLabel: categoryTag?.label,
            colorTagId: colorTag?.id,
            colorTagLabel: colorTag?.label,
            imageURL: b.imageURL,
            author: b.author,
        }));
    };

    private getList = async (request: Request<any, any, any>, response: Response): Promise<Omit<BookModel, 'text'>[]> => {
        const bookList = await Book.findByFilter(request.filter);
        const totalBookCount = await Book.countDocuments(request.filter.search);
        const tagList = await Tag.find();

        response.set('x-total-count', totalBookCount.toString());
        return bookList.map((b) => {
            const categoryTag = tagList.find((t) => t._id.equals(b.categoryTagId));
            const colorTag = tagList.find((t) => t._id.equals(b.colorTagId));

            return {
                id: b.id,
                name: b.name,
                categoryTagId: categoryTag?.id,
                categoryTagLabel: categoryTag?.label,
                colorTagId: colorTag?.id,
                colorTagLabel: colorTag?.label,
                imageURL: b.imageURL,
                author: b.author,
            };
        });
    };

    private getById = async (request: Request<{ id: string }, any, any>): Promise<BookModel> => {
        const book = await Book.findById(request.params.id);
        const categoryTag = await Tag.findById(book.categoryTagId);
        const colorTag = await Tag.findById(book.colorTagId);

        return {
            id: book.id,
            name: book.name,
            text: book.text,
            categoryTagId: categoryTag?.id,
            categoryTagLabel: categoryTag?.label,
            colorTagId: colorTag?.id,
            colorTagLabel: colorTag?.label,
            imageURL: book.imageURL,
            author: book.author,
        };
    };

    private deleteById = async (request: Request<{ id: string }, any, any>) => {
        await Book.findByIdAndDelete(request.params.id);

        return {};
    };
}
