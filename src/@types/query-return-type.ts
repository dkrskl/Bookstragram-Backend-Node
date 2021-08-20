import {DocumentQuery, Document, Model as MongooseModel, SchemaTypeOpts, Schema, SchemaType} from 'mongoose';
import {Filter} from '../middleware/filter';

declare global {
    type Constructor<T> = T extends Date ? DateConstructor : () => T;

    type QueryReturnType<T extends Document, K> = DocumentQuery<T[], T, K> & K;
    type Definition<T> = {
        [P in keyof T]-?: SchemaTypeOpts<Constructor<T[P]>> | Schema | SchemaType;
    };

    type InferFields<T> = T extends Entity<infer R, unknown, unknown> ? R : never;

    type Entity<FieldsT, MethodsT, VirtualFieldsT> = Document & {
        id: string;
        created_at_time: Date;
        updated_at_time: Date;
    } & FieldsT & MethodsT & VirtualFieldsT;

    type Model<EntityT extends Document, StaticsT, QueriesT> = MongooseModel<EntityT, QueriesT> & StaticsT & {
        findByFilter(filter: Filter): QueryReturnType<EntityT, QueriesT>;
    };
}
