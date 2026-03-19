import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';

// Send invitation (organizer) 
const sendInvitation = async (
  organizerId: string,
  eventId: string,
  targetUserId: string
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  if (event.organizerId !== organizerId) {
    throw new AppError(403, 'Only the organizer can send invitations');
  }

  if (targetUserId === organizerId) {
    throw new AppError(400, 'You cannot invite yourself');
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new AppError(404, 'User not found');
  }

  
  const alreadyInvited = await prisma.invitation.findUnique({
    where: { userId_eventId: { userId: targetUserId, eventId } },
  });

  if (alreadyInvited) {
    throw new AppError(409, 'User already invited to this event');
  }


  const alreadyParticipating = await prisma.participation.findUnique({
    where: { userId_eventId: { userId: targetUserId, eventId } },
  });

  if (alreadyParticipating) {
    throw new AppError(409, 'User is already a participant of this event');
  }

  const invitation = await prisma.invitation.create({
    data: {
      userId: targetUserId,
      eventId,
      status: 'PENDING',
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      event: { select: { id: true, title: true } },
    },
  });

  return invitation;
};

// Accept invitation (invited user) 
const acceptInvitation = async (userId: string, invitationId: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { event: true },
  });

  if (!invitation) {
    throw new AppError(404, 'Invitation not found');
  }

  if (invitation.userId !== userId) {
    throw new AppError(403, 'This invitation is not for you');
  }

  if (invitation.status !== 'PENDING') {
    throw new AppError(400, 'Invitation is no longer pending');
  }

  // update invitation status
  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: 'APPROVED' },
  });

  // if paid event → return requiresPayment
  if (invitation.event.isPaid) {
    return {
      message: 'Invitation accepted, payment required',
      requiresPayment: true,
      fee: invitation.event.fee,
      eventId: invitation.event.id,
    };
  }

  // if free event → create participation directly
  const participation = await prisma.participation.create({
    data: {
      userId,
      eventId: invitation.eventId,
      status: invitation.event.eventType === 'PRIVATE' ? 'PENDING' : 'APPROVED',
    },
  });

  return {
    message: 'Invitation accepted successfully',
    requiresPayment: false,
    participation,
  };
};

// ── Decline invitation (invited user) ─────────────────
const declineInvitation = async (userId: string, invitationId: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    throw new AppError(404, 'Invitation not found');
  }

  if (invitation.userId !== userId) {
    throw new AppError(403, 'This invitation is not for you');
  }

  if (invitation.status !== 'PENDING') {
    throw new AppError(400, 'Invitation is no longer pending');
  }

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: 'REJECTED' },
  });

  return null;
};

// ── Get my invitations (user) ─────────────────────────
const getMyInvitations = async (userId: string) => {
  const invitations = await prisma.invitation.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          organizer: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return invitations;
};

// ── Get event invitations (organizer) ─────────────────
const getEventInvitations = async (
  eventId: string,
  organizerId: string,
  role: string
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  if (event.organizerId !== organizerId && role !== 'ADMIN') {
    throw new AppError(403, 'You are not authorized');
  }

  const invitations = await prisma.invitation.findMany({
    where: { eventId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return invitations;
};

export const InvitationService = {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  getMyInvitations,
  getEventInvitations,
};