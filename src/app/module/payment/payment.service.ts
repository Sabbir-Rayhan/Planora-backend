import AppError from '../../errorHelpers/AppError';
import { envVars } from '../../config/env';
import { prisma } from '../../lib/prisma';
import SSLCommerz from 'sslcommerz-lts';

// ── Initiate payment 
const initiatePayment = async (userId: string, eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  if (!event.isPaid) {
    throw new AppError(400, 'This event is free, no payment required');
  }

  // check participation exists
  const participation = await prisma.participation.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (!participation) {
    throw new AppError(404, 'Please join the event first');
  }

  if (participation.status === 'APPROVED') {
    throw new AppError(400, 'You have already paid for this event');
  }

  if (participation.status === 'BANNED') {
    throw new AppError(403, 'You have been banned from this event');
  }

  // check if payment already exists
  const existingPayment = await prisma.payment.findFirst({
    where: {
      userId,
      eventId,
      status: 'PENDING',
    },
  });

  // get user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const transactionId = `TXN-${Date.now()}-${userId.slice(0, 8)}`;

  // create or reuse payment record
  let payment;
  if (existingPayment) {
    payment = existingPayment;
  } else {
    payment = await prisma.payment.create({
      data: {
        userId,
        eventId,
        participationId: participation.id,
        amount: event.fee,
        status: 'PENDING',
        transactionId,
      },
    });
  }

  // SSLCommerz payment data
  const sslData = {
    total_amount: event.fee,
    currency: 'BDT',
    tran_id: payment.transactionId || transactionId,
    success_url: `${envVars.BACKEND_URL}/api/v1/payments/success?paymentId=${payment.id}`,
    fail_url: `${envVars.BACKEND_URL}/api/v1/payments/fail?paymentId=${payment.id}`,
    cancel_url: `${envVars.BACKEND_URL}/api/v1/payments/cancel?paymentId=${payment.id}`,
    ipn_url: `${envVars.BACKEND_URL}/api/v1/payments/ipn`,
    shipping_method: 'NO',
    product_name: event.title,
    product_category: 'Event',
    product_profile: 'general',
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
    ship_name: user.name,
    ship_add1: 'Dhaka',
    ship_city: 'Dhaka',
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerz(
    envVars.SSL_STORE_ID,
    envVars.SSL_STORE_PASSWORD,
    envVars.SSL_IS_LIVE
  );

  const response = await sslcz.init(sslData);

  if (!response?.GatewayPageURL) {
    throw new AppError(500, 'Failed to initiate payment');
  }

  return { paymentUrl: response.GatewayPageURL };
};

// ── Payment success 
const paymentSuccess = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { event: true },
  });

  if (!payment) {
    throw new AppError(404, 'Payment not found');
  }

  // update payment status
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'PAID' },
  });

  // update participation status
  // if private event → still pending (host must approve)
  // if public event → approved
  const newStatus =
    payment.event.eventType === 'PRIVATE' ? 'PENDING' : 'APPROVED';

  await prisma.participation.update({
    where: { id: payment.participationId },
    data: { status: newStatus },
  });

  return payment;
};

// ── Payment fail 
const paymentFail = async (paymentId: string) => {
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'FAILED' },
  });
};

// ── Get my payments 
const getMyPayments = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: { userId },
    include: {
      event: { select: { id: true, title: true, fee: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return payments;
};

// ── Get all payments (admin) 
const getAllPayments = async () => {
  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      event: { select: { id: true, title: true, fee: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return payments;
};

export const PaymentService = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  getMyPayments,
  getAllPayments,
};