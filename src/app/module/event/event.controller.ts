import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import { EventService } from './event.service.js';
import { sendResponse } from '../../shared/sendResponse.js';


const createEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.createEvent(req.user.userId, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Event created successfully',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const { eventType, isPaid, status, search, isFeatured } = req.query;

  const result = await EventService.getAllEvents({
    eventType: eventType as any,
    isPaid: isPaid === 'true' ? true : isPaid === 'false' ? false : undefined,
    status: status as string,
    search: search as string,
    isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
  });

  sendResponse(res, {
    httpStatusCode : 200,
    success: true,
    message: 'Events retrieved successfully',
    data: result,
  });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getEventById(req.params.eventId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Event retrieved successfully',
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.updateEvent(
    req.params.eventId as string,
    req.user.userId,
    req.user.role,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Event updated successfully',
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  await EventService.deleteEvent(
    req.params.eventId as string,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Event deleted successfully',
    data: null,
  });
});

const getMyEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getMyEvents(req.user.userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'My events retrieved successfully',
    data: result,
  });
});

const toggleFeatured = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.toggleFeatured(req.params.eventId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Event featured status updated',
    data: result,
  });
});



const getStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await EventService.getStats();
  
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Stats retrieved successfully',
    data: stats,
  });
});

export const EventController = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  toggleFeatured,
  getStats
};