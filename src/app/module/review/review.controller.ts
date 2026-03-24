import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import { sendResponse } from '../../shared/sendResponse.js';
import { ReviewService } from './review.service.js';


const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.user.userId, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getEventReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getEventReviews(req.params.eventId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReview(
    req.params.reviewId as string,
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await ReviewService.deleteReview(
    req.params.reviewId as string,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Review deleted successfully',
    data: null,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getMyReviews(req.user.userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'My reviews retrieved successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getEventReviews,
  updateReview,
  deleteReview,
  getMyReviews,
};