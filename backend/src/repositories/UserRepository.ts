import { User, Profile, Company, Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { ApiError } from '../errors/ApiError';

export type UserWithRelations = User & {
  profile: Profile | null;
  company: Company | null;
};

export type CreateUserData = Prisma.UserCreateInput;
export type UpdateUserData = Prisma.UserUpdateInput;
export type UserWhereInput = Prisma.UserWhereInput;

export type UserBasic = Pick<User, 'id' | 'email' | 'role' | 'isVerified' | 'createdAt'>;
export type UserWithProfile = User & { profile: Profile | null };
export type UserWithCompany = User & { company: Company | null };

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByIdWithRelations(id: string): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        company: {
          include: {
            jobs: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByPinfl(pinfl: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { pinfl } });
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  async count(where?: UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  }

  async findManyPaginated(
    where?: UserWhereInput,
    options?: {
      page?: number;
      limit?: number;
      orderBy?: Prisma.UserOrderByWithRelationInput;
      include?: Prisma.UserInclude;
    }
  ) {
    const { page = 1, limit = 20, orderBy = { createdAt: 'desc' }, include } = options || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findVerifiedCandidates(options?: {
    page?: number;
    limit?: number;
    location?: string;
  }) {
    const { page = 1, limit = 20, location } = options || {};
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: 'CANDIDATE',
      isVerified: true,
      profile: {
        isNot: null,
      },
    };

    if (location) {
      where.profile = {
        address: { contains: location, mode: 'insensitive' },
      };
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: {
            select: {
              id: true,
              fullName: true,
              phoneNumber: true,
              address: true,
              softSkills: true,
              educationHistory: true,
              workHistory: true,
              cvUrl: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findWithProfile(userId: string): Promise<UserWithProfile | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }

  async findWithCompany(userId: string): Promise<UserWithCompany | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}

export const userRepository = new UserRepository();
