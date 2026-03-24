import { Router } from 'express';
import checkAuth from '../../middleware/checkAuth.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import { InvitationController } from './invitation.controller.js';



const router = Router();

// organizer sends invitation
router.post('/', checkAuth(UserRole.USER, UserRole.ADMIN), InvitationController.sendInvitation);

// get invitations for an event (organizer/admin)
router.get('/event/:eventId', checkAuth(UserRole.USER, UserRole.ADMIN), InvitationController.getEventInvitations);

// user actions on their own invitations
router.get('/my', checkAuth(UserRole.USER, UserRole.ADMIN), InvitationController.getMyInvitations);
router.patch('/accept/:invitationId', checkAuth(UserRole.USER, UserRole.ADMIN), InvitationController.acceptInvitation);
router.patch('/decline/:invitationId', checkAuth(UserRole.USER, UserRole.ADMIN), InvitationController.declineInvitation);

export const InvitationRoutes = router;