import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { IUpdateProfilePayload } from "./user.interface.js";


// ── Get my profile ────────────────────────────────────
const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

// ── Update my profile ─────────────────────────────────
const updateMyProfile = async (
  userId: string,
  payload: IUpdateProfilePayload
) => {
  // check if email already taken by someone else
  if (payload.email) {
    const emailTaken = await prisma.user.findFirst({
      where: {
        email: payload.email,
        NOT: { id: userId },
      },
    });

    if (emailTaken) {
      throw new AppError(409, 'Email is already in use');
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return updated;
};

// ── Get all users (admin) ─────────────────────────────
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
};

// ── Change user status (admin) ────────────────────────
const changeUserStatus = async (
  targetUserId: string,
  status: 'ACTIVE' | 'BLOCKED',
  requesterId: string
) => {
  if (targetUserId === requesterId) {
    throw new AppError(400, 'You cannot change your own status');
  }

  const requester = await prisma.user.findUnique({
    where: { id: requesterId },
  });

  if (!requester || requester.role !== 'ADMIN') {
    throw new AppError(403, 'Only admin can change user status');
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });

  return updated;
};

export const UserService = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  changeUserStatus,
};