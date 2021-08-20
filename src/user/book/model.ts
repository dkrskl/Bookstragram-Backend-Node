import {BaseModel} from '../model';

export interface BookModel extends BaseModel {
    name: string;
    categoryTagId: string;
    categoryTagLabel: string;
    colorTagId: string;
    colorTagLabel: string;
    text: string;
    imageURL: string;
    author: string;
}

export interface BookCreateModel {
    name: string;
    text: string;
    categoryTagId: string;
    colorTagId: string;
    imageURL: string;
    author: string;
}
