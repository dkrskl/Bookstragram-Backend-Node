import {newSchema} from './schema';
import {TagEntity, TagModel} from './entity/tag';
import {model} from 'mongoose';

const tagSchema = newSchema<TagEntity>({
    label: {type: String, required: true},
    fieldName: {type: String, required: true},
    order: {type: Number, default: 0},
});

export const Tag = model<TagEntity, TagModel>('tags', tagSchema);
