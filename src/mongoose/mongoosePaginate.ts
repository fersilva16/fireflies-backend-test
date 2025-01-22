import type { Model, RootFilterQuery } from 'mongoose';

interface MongoosePaginateArgs<T> {
  model: Model<T>;
  page: number;
  limit: number;
  filters?: RootFilterQuery<T>;
}

export const mongoosePaginate = async <T>({
  model,
  page,
  limit,
  filters = {},
}: MongoosePaginateArgs<T>) => {
  const total = await model.countDocuments();

  const skip = (page - 1) * limit;

  const data = await model.find(filters).limit(limit).skip(skip).lean().exec();

  return {
    total,
    limit,
    page,
    count: data.length,
    hasNextPage: page * limit < total,
    data,
  };
};
