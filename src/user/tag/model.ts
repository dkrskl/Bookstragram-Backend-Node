import {BaseModel} from '../model';

export interface TagModel extends BaseModel {
    label: string;
    fieldName: string;
    order: number;
}

export interface TagCreateModel {
    label: string;
    fieldName: string;
    order: number;
}
