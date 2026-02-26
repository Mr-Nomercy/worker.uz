export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findFirst(where: Record<string, unknown>): Promise<T | null>;
  findMany(where?: Record<string, unknown>): Promise<T[]>;
  create(data: Record<string, unknown>): Promise<T>;
  update(id: string, data: Record<string, unknown>): Promise<T>;
  delete(id: string): Promise<T>;
  count(where?: Record<string, unknown>): Promise<number>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected abstract modelName: string;

  protected get prisma() {
    const { PrismaClient } = require('@prisma/client');
    const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };
    return globalForPrisma.prisma || new PrismaClient();
  }

  abstract findById(id: string): Promise<T | null>;
  abstract findFirst(where: Record<string, unknown>): Promise<T | null>;
  abstract findMany(where?: Record<string, unknown>): Promise<T[]>;
  abstract create(data: Record<string, unknown>): Promise<T>;
  abstract update(id: string, data: Record<string, unknown>): Promise<T>;
  abstract delete(id: string): Promise<T>;
  abstract count(where?: Record<string, unknown>): Promise<number>;
}
