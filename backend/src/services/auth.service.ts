import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { userRepository, UserWithRelations } from '../repositories/UserRepository';
import { ApiError } from '../errors/ApiError';
import { auditService } from './audit.service';
import prisma from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  pinfl: string;
  passportSeries: string;
  fullName: string;
  birthDate: string;
}

export interface AuthResult {
  user: Omit<UserWithRelations, 'passwordHash'>;
  token: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    await auditService.logLogin(user.id, 'email_password');

    const token = this.generateToken(user);
    const userWithRelations = await userRepository.findByIdWithRelations(user.id);

    if (!userWithRelations) {
      throw ApiError.notFound('User not found');
    }

    const { passwordHash, ...userWithoutPassword } = userWithRelations;

    return { user: userWithoutPassword, token };
  }

  async register(data: RegisterData): Promise<User> {
    const { email, pinfl } = data;

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw ApiError.conflict('Ushbu email bilan ro\'yxatdan o\'tilgan. Iltimos, boshqa email kiriting yoki tizimga kiring.');
    }

    const existingPinfl = await userRepository.findByPinfl(pinfl);
    if (existingPinfl) {
      throw ApiError.conflict('Ushbu PINFL bilan ro\'yxatdan o\'tilgan. Iltimos, boshqa PINFL kiriting.');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        pinfl: data.pinfl,
        passportSeries: data.passportSeries,
        role: 'CANDIDATE',
        isVerified: true,
        profile: {
          create: {
            fullName: data.fullName,
            birthDate: new Date(data.birthDate),
            gender: 'MALE',
            address: '',
            educationHistory: [],
            workHistory: [],
          },
        },
      },
      include: { profile: true },
    });

    await auditService.log({
      userId: user.id,
      action: 'REGISTER',
      entityType: 'USER',
      entityId: user.id,
      details: { role: user.role },
    });

    return user;
  }

  async getCurrentUser(userId: string): Promise<UserWithRelations> {
    const user = await userRepository.findByIdWithRelations(userId);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  async logout(userId: string | undefined): Promise<void> {
    if (userId) {
      await auditService.logLogout(userId);
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }
}

export const authService = new AuthService();
