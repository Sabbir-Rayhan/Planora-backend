import { Router } from 'express';
import { UserController } from './user.controller';
import checkAuth from '../../middleware/checkAuth';
import validateRequest from '../../middleware/validateRequest';
import { updateProfileSchema } from './user.validation';
import { UserRole } from '../../../generated/prisma/enums';


const router = Router();

// user routes
router.get('/me', checkAuth(UserRole.USER, UserRole.ADMIN), UserController.getMyProfile);
router.patch('/me', checkAuth(UserRole.USER, UserRole.ADMIN), validateRequest(updateProfileSchema), UserController.updateMyProfile);

// admin only routes
router.get('/', checkAuth(UserRole.ADMIN), UserController.getAllUsers);
router.patch('/:userId/status', checkAuth(UserRole.ADMIN), UserController.changeUserStatus);

export const UserRoutes = router;