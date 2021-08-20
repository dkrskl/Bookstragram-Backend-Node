import {newSchema} from './schema';
import {model, Schema} from 'mongoose';
import {BookEntity, BookModel} from './entity/book';

const bookSchema = newSchema<BookEntity>({
    name: {type: String, required: true},
    text: {type: String, required: true},
    author: {type: String, required: true},
    categoryTagId: {type: Schema.Types.ObjectId, ref: 'Tag'},
    colorTagId: {type: Schema.Types.ObjectId, ref: 'Tag'},
    imageURL: {type: String},
});

export const Book = model<BookEntity, BookModel>('books', bookSchema);
