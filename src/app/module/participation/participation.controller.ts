import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { ParticipationService } from './participation.service';
import { sendResponse } from '../../shared/sendResponse';

const joinEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.joinEvent(
    req.user.userId,
    req.params.eventId as string
  );

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: result?.requiresPayment
      ? 'Payment required to complete joining'
      : result?.requiresApproval
      ? 'Join request sent, waiting for approval'
      : 'Successfully joined the event',
    data: result,
  });
});

const getEventParticipants = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.getEventParticipants(
    req.params.eventId as string,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Participants retrieved successfully',
    data: result,
  });
});

const approveParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.approveParticipant(
    req.params.participationId as string,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Participant approved successfully',
    data: result,
  });
});

const rejectParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.rejectParticipant(
    req.params.participationId as string,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Participant rejected successfully',
    data: result,
  });
});

const banParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.banParticipant(
    req.params.participationId as string,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Participant banned successfully',
    data: result,
  });
});

const leaveEvent = catchAsync(async (req: Request, res: Response) => {
  await ParticipationService.leaveEvent(req.user.userId, req.params.eventId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Successfully left the event',
    data: null,
  });
});

const getMyParticipations = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.getMyParticipations(req.user.userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'My participations retrieved successfully',
    data: result,
  });
});

export const ParticipationController = {
  joinEvent,
  getEventParticipants,
  approveParticipant,
  rejectParticipant,
  banParticipant,
  leaveEvent,
  getMyParticipations,
};