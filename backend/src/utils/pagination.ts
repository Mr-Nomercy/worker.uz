export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getPagination = (page?: number, limit?: number): PaginationParams => {
  const defaultPage = 1;
  const defaultLimit = 20;
  const maxLimit = 100;

  const validPage = Math.max(1, page || defaultPage);
  const validLimit = Math.min(maxLimit, Math.max(1, limit || defaultLimit));

  return {
    page: validPage,
    limit: validLimit,
  };
};

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginatedResult<unknown>['pagination'] => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export const getSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};
