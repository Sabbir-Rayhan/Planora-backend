import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { AuthService } from './auth.service';
import { setTokenCookie ,clearTokenCookie} from '../../utils/cookie';
import { sendResponse } from '../../shared/sendResponse';


const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  setTokenCookie(res, 'refreshToken', result.refreshToken);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Login successful',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  clearTokenCookie(res, 'refreshToken');

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const AuthController = { register, login, logout };
