import { Router } from 'express';
import { EventController } from './event.controller';
import checkAuth from '../../middleware/checkAuth';
import validateRequest from '../../middleware/validateRequest';
import { createEventSchema, updateEventSchema } from './event.validation';
import { UserRole } from '../../../generated/prisma/enums';


const router = Router();

// public routes
router.get('/', EventController.getAllEvents);
router.get('/:eventId', EventController.getEventById);

// user part
router.post('/', checkAuth(UserRole.USER, UserRole.ADMIN), validateRequest(createEventSchema), EventController.createEvent);
router.get('/my/events', checkAuth(UserRole.USER, UserRole.ADMIN), EventController.getMyEvents);
router.patch('/:eventId', checkAuth(UserRole.USER, UserRole.ADMIN), validateRequest(updateEventSchema), EventController.updateEvent);
router.delete('/:eventId', checkAuth(UserRole.USER, UserRole.ADMIN), EventController.deleteEvent);

// admin part
router.patch('/:eventId/featured', checkAuth(UserRole.ADMIN), EventController.toggleFeatured);

export const EventRoutes = router;