import { Router } from 'express';
import checkAuth from '../../middleware/checkAuth.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import { PaymentController } from './payment.controller.js';


const router = Router();

// initiate payment (logged in user)
router.post('/initiate', checkAuth(UserRole.USER, UserRole.ADMIN), PaymentController.initiatePayment);

// SSLCommerz redirect routes (no auth — SSLCommerz calls these)
router.post('/success', PaymentController.paymentSuccess);
router.post('/fail', PaymentController.paymentFail);
router.post('/cancel', PaymentController.paymentCancel);

// user payments history
router.get('/my', checkAuth(UserRole.USER, UserRole.ADMIN), PaymentController.getMyPayments);

// admin
router.get('/all', checkAuth(UserRole.ADMIN), PaymentController.getAllPayments);

export const PaymentRoutes = router;