import {ControllerBase} from '../../controller';
import {Tag} from '../../db/tag';
import {TagCreateModel, TagModel} from './model';
import {TagEntity} from '../../db/entity/tag';
import {validationMiddleware} from '../../middleware/validate-model';
import {body, param} from 'express-validator';
import {Request, Response} from 'express';
import {filter, filterMiddleware} from '../../middleware/filter';

export class TagController extends ControllerBase {
    protected initialize(): void {
        this.get('/', this.getList, filterMiddleware(
            filter('fieldName'),
        ));
        this.post('/', this.create, validationMiddleware(
            body('label').isString().isLength({min: 2}),
            body('fieldName').isString().isLength({min: 2}),
            body('order').isNumeric(),
        ));
        this.delete('/:id', this.deleteById, validationMiddleware(
            param('id').isMongoId(),
        ));
        // todo PUT
    }

    private create = async (request: Request<any, any, TagCreateModel>): Promise<TagModel> => {
        const {label, fieldName, order} = request.body;

        const tag = new Tag({
            label,
            fieldName,
            order,
        });

        return tag.save().then(this.toModel);
    };

    private getList = async (request: Request, response: Response): Promise<TagModel[]> => {
        const tagList = await Tag.findByFilter(request.filter);
        const totalTagCount = await Tag.countDocuments(request.filter.search);

        response.set('x-total-count', totalTagCount.toString());
        return tagList.map(this.toModel);
    };

    private deleteById = async (request: Request<{ id: string }, any, any>) => {
        await Tag.findByIdAndDelete(request.params.id);

        return {};
    };

    private toModel = (e: TagEntity): TagModel => {
        return {
            id: e.id,
            label: e.label,
            fieldName: e.fieldName,
            order: e.order,
        };
    };
}
