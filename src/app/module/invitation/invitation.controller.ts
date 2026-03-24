import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import { InvitationService } from './invitation.service.js';
import { sendResponse } from '../../shared/sendResponse.js';


const sendInvitation = catchAsync(async (req: Request, res: Response) => {
  const { eventId, userId } = req.body;

  const result = await InvitationService.sendInvitation(
    req.user.userId,
    eventId,
    userId
  );

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Invitation sent successfully',
    data: result,
  });
});

const acceptInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.acceptInvitation(
    req.user.userId,
    req.params.invitationId as string
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: result.message,
    data: result,
  });
});

const declineInvitation = catchAsync(async (req: Request, res: Response) => {
  await InvitationService.declineInvitation(
    req.user.userId,
    req.params.invitationId as string
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Invitation declined successfully',
    data: null,
  });
});

const getMyInvitations = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.getMyInvitations(req.user.userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Invitations retrieved successfully',
    data: result,
  });
});

const getEventInvitations = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.getEventInvitations(
    req.params.eventId as string,
    req.user.userId,
    req.user.role
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Event invitations retrieved successfully',
    data: result,
  });
});

export const InvitationController = {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  getMyInvitations,
  getEventInvitations,
};