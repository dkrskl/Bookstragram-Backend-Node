interface TagFields {
    label: string;
    fieldName: string;
    order: number;
}

interface TagMethods {
}

interface TagVirtualFields {
}


interface TagQueries {
}

interface TagStatics {
}

export type TagEntity = Entity<TagFields, TagMethods, TagVirtualFields>;
export type TagModel = Model<TagEntity, TagStatics, TagQueries>;
