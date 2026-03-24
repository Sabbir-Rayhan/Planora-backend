import { Router } from 'express';
import { ReviewController } from './review.controller.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import checkAuth from '../../middleware/checkAuth.js';



const router = Router();

// public
router.get('/event/:eventId', ReviewController.getEventReviews);

// user routes
router.post('/', checkAuth(UserRole.USER, UserRole.ADMIN), ReviewController.createReview);
router.get('/my', checkAuth(UserRole.USER, UserRole.ADMIN), ReviewController.getMyReviews);
router.patch('/:reviewId', checkAuth(UserRole.USER, UserRole.ADMIN), ReviewController.updateReview);
router.delete('/:reviewId', checkAuth(UserRole.USER, UserRole.ADMIN), ReviewController.deleteReview);

export const ReviewRoutes = router;