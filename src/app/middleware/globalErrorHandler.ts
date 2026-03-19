import { NextFunction, Request, Response } from 'express';
import AppError from '../errorHelpers/AppError';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // only show error stack in development
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  });
};

export default globalErrorHandler;