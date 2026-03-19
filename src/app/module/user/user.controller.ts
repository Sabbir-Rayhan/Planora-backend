import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';

import { UserService } from './user.service';
import { sendResponse } from '../../shared/sendResponse';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMyProfile(req.user.userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateMyProfile(req.user.userId, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { status } = req.body;

  const result = await UserService.changeUserStatus(
    userId,
    status,
    req.user.userId
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  changeUserStatus,
};