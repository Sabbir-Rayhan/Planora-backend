import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface.js";


//  Create review 
const createReview = async (userId: string, payload: ICreateReviewPayload) => {
  const event = await prisma.event.findUnique({
    where: { id: payload.eventId },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  // must be a participant to review
  const participation = await prisma.participation.findUnique({
    where: {
      userId_eventId: { userId, eventId: payload.eventId },
    },
  });

  if (!participation || participation.status !== 'APPROVED') {
    throw new AppError(403, 'You must be an approved participant to review');
  }

  // one review per user per event
  const alreadyReviewed = await prisma.review.findUnique({
    where: {
      userId_eventId: { userId, eventId: payload.eventId },
    },
  });

  if (alreadyReviewed) {
    throw new AppError(409, 'You have already reviewed this event');
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new AppError(400, 'Rating must be between 1 and 5');
  }

  const review = await prisma.review.create({
    data: {
      userId,
      eventId: payload.eventId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      user: { select: { id: true, name: true } },
      event: { select: { id: true, title: true } },
    },
  });

  return review;
};

// Get event reviews 
const getEventReviews = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  const reviews = await prisma.review.findMany({
    where: { eventId },
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum: any, r: { rating: any; }) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    totalReviews: reviews.length,
    averageRating: Math.round(averageRating * 10) / 10,
  };
};

// Update review (owner only)
const updateReview = async (
  reviewId: string,
  userId: string,
  payload: IUpdateReviewPayload
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  if (review.userId !== userId) {
    throw new AppError(403, 'You can only update your own review');
  }

  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new AppError(400, 'Rating must be between 1 and 5');
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  return updated;
};

// Delete review (owner or admin)
const deleteReview = async (
  reviewId: string,
  userId: string,
  role: string
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  if (review.userId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You can only delete your own review');
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return null;
};

// Get my reviews
const getMyReviews = async (userId: string) => {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      event: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return reviews;
};

export const ReviewService = {
  createReview,
  getEventReviews,
  updateReview,
  deleteReview,
  getMyReviews,
};