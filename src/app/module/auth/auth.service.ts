import bcrypt from 'bcrypt';
import { ILoginPayload, IRegisterPayload } from './auth.interface.js';
import { prisma } from '../../lib/prisma.js';
import AppError from '../../errorHelpers/AppError.js';
import { envVars } from '../../config/env.js';
import { generateToken } from '../../utils/jwt.js';


// ── Register ──────────────────────────────────────────
const register = async (payload: IRegisterPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(409, 'User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    envVars.BCRYPT_SALT_ROUNDS
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

// ── Login ─────────────────────────────────────────────
const login = async (payload: ILoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(404, 'No user found with this email');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(403, 'Your account has been blocked');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  const jwtPayload = { id: user.id, email: user.email, role: user.role };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES_IN
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const AuthService = { register, login };