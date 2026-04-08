import { Router } from 'express';
import { EventController } from './event.controller.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import validateRequest from '../../middleware/validateRequest.js';
import checkAuth from '../../middleware/checkAuth.js';
import { createEventSchema, updateEventSchema } from './event.validation.js';

const router = Router();

// ✅ public routes
router.get('/', EventController.getAllEvents);

// ✅ specific routes FIRST
router.get('/my/events', checkAuth(UserRole.USER, UserRole.ADMIN), EventController.getMyEvents);
router.get('/stats', EventController.getStats);

// ❗ dynamic route MUST be AFTER all specific routes
router.get('/:eventId', EventController.getEventById);

// user part
router.post('/', checkAuth(UserRole.USER, UserRole.ADMIN), validateRequest(createEventSchema), EventController.createEvent);
router.patch('/:eventId', checkAuth(UserRole.USER, UserRole.ADMIN), validateRequest(updateEventSchema), EventController.updateEvent);
router.delete('/:eventId', checkAuth(UserRole.USER, UserRole.ADMIN), EventController.deleteEvent);

// admin part
router.patch('/:eventId/featured', checkAuth(UserRole.ADMIN), EventController.toggleFeatured);

export const EventRoutes = router;