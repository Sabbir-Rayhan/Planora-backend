import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { envVars } from '../config/env';
import AppError from '../errorHelpers/AppError';
import catchAsync from '../shared/catchAsync';
import { UserRole } from '../../generated/prisma/enums';
import { prisma } from '../lib/prisma';


const checkAuth = (...roles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'You are not authorized!');
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET);

    // 3. Check user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(404, 'User not found!');
    }

    if (user.status === 'BLOCKED') {
      throw new AppError(403, 'Your account has been blocked!');
    }

    // 4. Check role permission
    if (roles.length && !roles.includes(user.role)) {
      throw new AppError(403, 'You do not have permission to access this!');
    }

    // 5. Attach user to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  });
};

export default checkAuth;