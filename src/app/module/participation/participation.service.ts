import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../lib/prisma.js";



const joinEvent = async (userId: string, eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  if (event.status === 'CANCELLED') {
    throw new AppError(400, 'This event has been cancelled');
  }

  if (event.status === 'COMPLETED') {
    throw new AppError(400, 'This event has already been completed');
  }

  
  if (event.organizerId === userId) {
    throw new AppError(400, 'You cannot join your own event');
  }

  
  const alreadyJoined = await prisma.participation.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (alreadyJoined) {
    throw new AppError(409, 'You have already joined this event');
  }

  
  if (event.eventType === 'PUBLIC' && !event.isPaid) {
    const participation = await prisma.participation.create({
      data: {
        userId,
        eventId,
        status: 'APPROVED',
      },
    });
    return { participation, requiresPayment: false };
  }

  
  if (event.eventType === 'PUBLIC' && event.isPaid) {
    const participation = await prisma.participation.create({
      data: {
        userId,
        eventId,
        status: 'PENDING',
      },
    });
    return { participation, requiresPayment: true, fee: event.fee };
  }

  
  if (event.eventType === 'PRIVATE' && !event.isPaid) {
    const participation = await prisma.participation.create({
      data: {
        userId,
        eventId,
        status: 'PENDING',
      },
    });
    return { participation, requiresPayment: false, requiresApproval: true };
  }

  
  if (event.eventType === 'PRIVATE' && event.isPaid) {
    const participation = await prisma.participation.create({
      data: {
        userId,
        eventId,
        status: 'PENDING',
      },
    });
    return {
      participation,
      requiresPayment: true,
      requiresApproval: true,
      fee: event.fee,
    };
  }
};


// Get participants of an event (organizer/admin) 
const getEventParticipants = async (
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

  if (event.organizerId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You are not authorized to view participants');
  }

  const participants = await prisma.participation.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return participants;
};



// Approve participant (admin)
const approveParticipant = async (
  participationId: string,
  userId: string,
  role: string
) => {
  const participation = await prisma.participation.findUnique({
    where: { id: participationId },
    include: { event: true },
  });

  if (!participation) {
    throw new AppError(404, 'Participation not found');
  }

  if (participation.event.organizerId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You are not authorized');
  }

  if (participation.status === 'APPROVED') {
    throw new AppError(400, 'Participant is already approved');
  }

  const updated = await prisma.participation.update({
    where: { id: participationId },
    data: { status: 'APPROVED' },
  });

  return updated;
};



//Reject participant (organizer/admin) 
const rejectParticipant = async (
  participationId: string,
  userId: string,
  role: string
) => {
  const participation = await prisma.participation.findUnique({
    where: { id: participationId },
    include: { event: true },
  });

  if (!participation) {
    throw new AppError(404, 'Participation not found');
  }

  if (participation.event.organizerId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You are not authorized');
  }

  const updated = await prisma.participation.update({
    where: { id: participationId },
    data: { status: 'REJECTED' },
  });

  return updated;
};


// Admin (Me)
// Ban participant (organizer/admin)
const banParticipant = async (
  participationId: string,
  userId: string,
  role: string
) => {
  const participation = await prisma.participation.findUnique({
    where: { id: participationId },
    include: { event: true },
  });

  if (!participation) {
    throw new AppError(404, 'Participation not found');
  }

  if (participation.event.organizerId !== userId && role !== 'ADMIN') {
    throw new AppError(403, 'You are not authorized');
  }

  const updated = await prisma.participation.update({
    where: { id: participationId },
    data: { status: 'BANNED' },
  });

  return updated;
};

// Leave event (user) 
const leaveEvent = async (userId: string, eventId: string) => {
  const participation = await prisma.participation.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (!participation) {
    throw new AppError(404, 'You are not a participant of this event');
  }

  if (participation.status === 'BANNED') {
    throw new AppError(400, 'You have been banned from this event');
  }

  await prisma.participation.delete({
    where: { userId_eventId: { userId, eventId } },
  });

  return null;
};

// ── Get my participations (user) 
const getMyParticipations = async (userId: string) => {
  const participations = await prisma.participation.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          organizer: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return participations;
};

export const ParticipationService = {
  joinEvent,
  getEventParticipants,
  approveParticipant,
  rejectParticipant,
  banParticipant,
  leaveEvent,
  getMyParticipations,
};