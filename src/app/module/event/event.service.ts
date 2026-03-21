import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';
import { ICreateEventPayload, IEventFilterPayload, IUpdateEventPayload } from './event.interface';

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
  const { eventType, isPaid, status, search } = filters;

  const events = await prisma.event.findMany({
    where: {
      ...(eventType && { eventType }),
      ...(isPaid !== undefined && { isPaid }),
      ...(status && { status: status as any }),
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

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  // only organizer or admin can delete
  if (event.organizerId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You are not authorized to delete this event');
  }

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

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: { isFeatured: !event.isFeatured },
  });

  return updated;
};

export const EventService = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  toggleFeatured,
};