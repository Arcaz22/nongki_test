import { SelectQueryBuilder } from 'typeorm';

export function applySearchFilter<T>(
    queryBuilder: SelectQueryBuilder<T>,
    search?: string,
    searchFields: string[] = []
): void {
    if (search) {
        const alias = queryBuilder.alias;
        const searchConditions = searchFields
            .map(field => `${alias}.${field} ILIKE :search`)
            .join(' OR ');

        queryBuilder.andWhere(searchConditions, { search: `%${search}%` });
    }
}
