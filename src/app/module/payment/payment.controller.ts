import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import { PaymentService } from './payment.service.js';
import { sendResponse } from '../../shared/sendResponse.js';
import { envVars } from '../../config/env.js';


const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.body;

  const result = await PaymentService.initiatePayment(req.user.userId, eventId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

// these are redirect routes from SSLCommerz
// so they redirect to frontend, not return JSON

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.query;

  await PaymentService.paymentSuccess(paymentId as string);

  // redirect to frontend success page
  res.redirect(
    `${envVars.FRONTEND_URL}/payment/success?paymentId=${paymentId}`
  );
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.query;

  await PaymentService.paymentFail(paymentId as string);

  // redirect to frontend fail page
  res.redirect(
    `${envVars.FRONTEND_URL}/payment/fail?paymentId=${paymentId}`
  );
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.query;

  // redirect to frontend cancel page
  res.redirect(
    `${envVars.FRONTEND_URL}/payment/cancel?paymentId=${paymentId}`
  );
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyPayments(req.user.userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'My payments retrieved successfully',
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayments();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'All payments retrieved successfully',
    data: result,
  });
});

export const PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getMyPayments,
  getAllPayments,
};