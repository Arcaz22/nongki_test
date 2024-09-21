import { SelectQueryBuilder } from 'typeorm';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from './constants';

export async function applyPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT
): Promise<{ data: T[], count: number }> {
    const skip = (page - 1) * limit;
    const count = await queryBuilder.getCount();
    const data = await queryBuilder.skip(skip).take(limit).getMany();
    return { data, count };
}
