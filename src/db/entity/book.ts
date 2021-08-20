import {Types} from 'mongoose';

interface BookFields {
    name: string;
    text: string;
    author: string;
    categoryTagId: Types.ObjectId;
    colorTagId: Types.ObjectId;
    imageURL: string;
}

interface BookMethods {
}

interface BookVirtualFields {
}


interface BookQueries {
}

interface BookStatics {
}

export type BookEntity = Entity<BookFields, BookMethods, BookVirtualFields>;
export type BookModel = Model<BookEntity, BookStatics, BookQueries>;
