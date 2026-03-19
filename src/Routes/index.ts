import { Request,Response } from 'express';
import {Router} from 'express';
import { AuthRoutes } from '../app/module/auth/auth.route';
import checkAuth from '../app/middleware/checkAuth';
import { UserRole } from '../generated/prisma/enums';
import { UserRoutes } from '../app/module/user/user.route';
import { EventRoutes } from '../app/module/event/event.route';
import { ParticipationRoutes } from '../app/module/participation/participation.route';
import { InvitationRoutes } from '../app/module/invitation/invitation.route';

const router = Router();

router.use('/auth',AuthRoutes)
router.use('/users',UserRoutes)
router.use('/events',EventRoutes)
router.use('/participations',ParticipationRoutes)
router.use('/invitations',InvitationRoutes)







// This route is for testing my route

// router.get(
//   '/test-auth',
//   checkAuth(UserRole.USER),
//   (req: Request, res: Response) => {
//     res.json({ success: true, message: 'Protected route works!', user: req.user });
//   }
// );

export const IndexRoutes = router