import {NextFunction, Request, RequestHandler, Response} from 'express';

type Creator = { getDefinition(): FilterDefinition };

export type FilterDefinitionOrCreator = FilterDefinition | Creator;

export type FilterDefinition = {
    name: string;
    exact?: boolean;
    array?: boolean;
    isSort?: boolean;
    isDescending?: boolean;
    isDefault?: boolean;
    sanitizer?: (value: string) => any;
    type?: { compareAs: 'lte' | 'gte' | 'lt' | 'gt', isDate?: boolean; };
};

export type Filter = {
    search: any;
    sort?: string;
    isDescending?: boolean;
    page: number;
    perPage: number;
};

export function filterMiddleware(...filters: FilterDefinitionOrCreator[]): RequestHandler[] {
    return [
        function (request: Request, response: Response, next: NextFunction) {
            request.filter = {search: {}, page: 0, perPage: 0};

            let sortBy = request.query.sortBy;
            let isDescending = false;

            if (request.query.sortByDescending) {
                sortBy = request.query.sortByDescending;
                isDescending = true;
            }

            for (const filterOrCreator of filters) {
                let f: FilterDefinition;
                if (filterOrCreator.hasOwnProperty('getDefinition')) {
                    f = (filterOrCreator as Creator).getDefinition();
                } else {
                    f = filterOrCreator as FilterDefinition;
                }

                if (f.isSort && f.isDefault) {
                    if (!request.filter.sort) {
                        request.filter.sort = f.name;
                        request.filter.isDescending = f.isDescending;
                    }
                }

                if (sortBy) {
                    if (f.isSort && f.name === sortBy) {
                        request.filter.sort = f.name;
                        request.filter.isDescending = isDescending;
                    }
                }

                if (!f.isSort && request.query[f.name]) {
                    if (!f.type) {
                        const value = f.sanitizer ? f.sanitizer(request.query[f.name] as string) : request.query[f.name];
                        if (f.array) {
                            const queryToArray = value.replace(/'/g, '"');
                            request.filter.search[f.name] = JSON.parse(queryToArray);
                            continue;
                        }

                        if (f.exact) {
                            request.filter.search[f.name] = value;
                        } else {
                            request.filter.search[f.name] = new RegExp(value + '.*', 'i');
                        }
                    } else {
                        const queryWithFilter = (request.query[f.name] instanceof Array ? (request.query[f.name] as string[]).find((e: string) => e.split(':')[0] === f.type.compareAs) : ((request.query[f.name] as string).split(':')[0] === f.type.compareAs ? request.query[f.name] as string : null));

                        if (!queryWithFilter) {
                            continue;
                        }

                        if (!request.filter.search[f.name]) {
                            request.filter.search[f.name] = {};
                        }

                        request.filter.search[f.name]['$' + queryWithFilter.split(':')[0]] = (f.type.isDate ? new Date(parseInt(queryWithFilter.split(':')[1], 10)) : queryWithFilter.split(':')[1]);
                    }
                }
            }
            if (request.query.page) {
                request.filter.page = parseInt(request.query.page as string, 10);
            }

            if (request.query.per_page) {
                request.filter.perPage = parseInt(request.query.per_page as string, 10);
            }

            next();
        },
    ];
}

export function filter(name: string, type?: { compareAs: 'lte' | 'gte' | 'lt' | 'gt', isDate?: boolean; }) {
    const filterObject: FilterDefinition = {
        name,
        exact: false,
        type,
        array: false,
    };

    const output = {
        exact: () => {
            filterObject.exact = true;
            return output;
        },
        sanitizer: (sanitizer: (value: string) => any) => {
            filterObject.sanitizer = sanitizer;
        },
        getDefinition: () => {
            return filterObject;
        },
        array: () => {
            filterObject.array = true;
            return output;
        },
    };

    return output;
}

export function sort(name: string) {
    const sortObject: FilterDefinition = {
        name,
        isSort: true,
        isDescending: false,
        isDefault: false,
    };

    const output = {
        descending: () => {
            sortObject.isDescending = true;
            return output;
        },

        default: () => {
            sortObject.isDescending = true;
            return output;
        },

        getDefinition: () => {
            return sortObject;
        },
    };

    return output;
}
