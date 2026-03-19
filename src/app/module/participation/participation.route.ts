import { Router } from 'express';
import { ParticipationController } from './participation.controller';
import checkAuth from '../../middleware/checkAuth';
import { UserRole } from '../../../generated/prisma/enums';


const router = Router();

// user routes
router.post('/join/:eventId', checkAuth(UserRole.USER, UserRole.ADMIN), ParticipationController.joinEvent);
router.delete('/leave/:eventId', checkAuth(UserRole.USER, UserRole.ADMIN), ParticipationController.leaveEvent);
router.get('/my', checkAuth(UserRole.USER, UserRole.ADMIN), ParticipationController.getMyParticipations);

// organizer/admin routes
router.get('/event/:eventId', checkAuth(UserRole.USER, UserRole.ADMIN), ParticipationController.getEventParticipants);
router.patch('/approve/:participationId', checkAuth(UserRole.USER, UserRole.ADMIN), ParticipationController.approveParticipant);
router.patch('/reject/:participationId', checkAuth(UserRole.USER, UserRole.ADMIN), ParticipationController.rejectParticipant);
router.patch('/ban/:participationId', checkAuth(UserRole.USER, UserRole.ADMIN), ParticipationController.banParticipant);

export const ParticipationRoutes = router;