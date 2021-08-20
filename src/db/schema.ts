import {Schema, SchemaDefinition, SchemaOptions} from 'mongoose';
import {Filter} from '../middleware/filter';

export function newSchema<T>(definition?: SchemaDefinition<T>, options: SchemaOptions = {
    id: true,
    timestamps: {
        createdAt: 'created_at_time',
        updatedAt: 'updated_at_time',
    },
}) {
    const schema = new Schema(definition, options);
    schema.static('findByFilter', function (filter: Filter) {
        let output = this.find(filter.search);
        if (filter.sort) {
            output = output.sort({[filter.sort]: filter.isDescending ? -1 : 1});
        }

        output = output.limit(filter.perPage).skip(filter.perPage * filter.page);
        return output;
    });
    return schema;
}
