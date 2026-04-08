import AppError from '../../errorHelpers/AppError.js';
import { prisma } from '../../lib/prisma.js';
import { ICreateEventPayload, IEventFilterPayload, IUpdateEventPayload } from './event.interface.js';


// ── Create event
const createEvent = async (userId: string, payload: ICreateEventPayload) => {
  if (payload.fee && payload.fee > 0) {
    payload.isPaid = true;
  }

  const event = await prisma.event.create({
    data: {
      ...payload,
      date: new Date(payload.date),
      organizerId: userId,
    },
  });

  return event;
};

// ── Get all events 
const getAllEvents = async (filters: IEventFilterPayload) => {
  const { eventType, isPaid, status, search, isFeatured } = filters;

  const events = await prisma.event.findMany({
    where: {
      ...(eventType && { eventType }),
      ...(isPaid !== undefined && { isPaid }),
      ...(status && { status: status as any }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { venue: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      organizer: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { participations: true, reviews: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return events;
};

// ── Get single event 
const getEventById = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: {
        select: { id: true, name: true, email: true },
      },
      reviews: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
      _count: {
        select: { participations: true },
      },
    },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  return event;
};

// ── Update event 
const updateEvent = async (
  eventId: string,
  userId: string,
  role: string,
  payload: IUpdateEventPayload
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  // only organizer or admin can update
  if (event.organizerId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You are not authorized to update this event');
  }

  if (payload.fee && payload.fee > 0) {
    payload.isPaid = true;
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: {
      ...payload,
      ...(payload.date && { date: new Date(payload.date) }),
    },
  });

  return updated;
};

// ── Delete event 
const deleteEvent = async (
  eventId: string,
  userId: string,
  role: string
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) throw new AppError(404, 'Event not found');

  if (event.organizerId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You are not authorized to delete this event');
  }

  // check if any paid participants exist
  const paidParticipants = await prisma.payment.findMany({
    where: { eventId, status: 'PAID' },
  });

  // organizer cannot delete if paid participants exist — only admin can
  if (paidParticipants.length > 0 && role !== 'ADMIN') {
    throw new AppError(
      403,
      'Cannot delete event with paid participants. Please contact admin.'
    );
  }

  // delete in order
  await prisma.payment.deleteMany({ where: { eventId } });
  await prisma.participation.deleteMany({ where: { eventId } });
  await prisma.invitation.deleteMany({ where: { eventId } });
  await prisma.review.deleteMany({ where: { eventId } });
  await prisma.event.delete({ where: { id: eventId } });

  return null;
};

// ── Get my events 
const getMyEvents = async (userId: string) => {
  const events = await prisma.event.findMany({
    where: { organizerId: userId },
    include: {
      _count: {
        select: { participations: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return events;
};

// ── Toggle featured (admin only) 
const toggleFeatured = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  // if featuring this event, unfeature all others first
  if (!event.isFeatured) {
    await prisma.event.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: { isFeatured: !event.isFeatured },
  });

  return updated;
};


// In event.service.ts
const getStats = async () => {
  const [totalEvents, totalUsers, totalParticipants, avgRatingResult] = await Promise.all([
    prisma.event.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.participation.count({ where: { status: 'APPROVED' } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
  ]);

  return {
    totalEvents,
    totalUsers,
    totalParticipants,
    avgRating: avgRatingResult._avg.rating?.toFixed(1) || '0.0',
  };
};

export const EventService = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  toggleFeatured,
  getStats
};