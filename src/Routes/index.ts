import { Request,Response } from 'express';
import {Router} from 'express';
import { AuthRoutes } from '../app/module/auth/auth.route.js';
import { UserRoutes } from '../app/module/user/user.route.js';
import { EventRoutes } from '../app/module/event/event.route.js';
import { ParticipationRoutes } from '../app/module/participation/participation.route.js';
import { InvitationRoutes } from '../app/module/invitation/invitation.route.js';
import { ReviewRoutes } from '../app/module/review/review.route.js';
import { PaymentRoutes } from '../app/module/payment/payment.route.js';


const router = Router();

router.use('/auth',AuthRoutes)
router.use('/users',UserRoutes)
router.use('/events',EventRoutes)
router.use('/participations',ParticipationRoutes)
router.use('/invitations',InvitationRoutes)
router.use('/reviews',ReviewRoutes)
router.use('/payments', PaymentRoutes)







// This route is for testing my route

// router.get(
//   '/test-auth',
//   checkAuth(UserRole.USER),
//   (req: Request, res: Response) => {
//     res.json({ success: true, message: 'Protected route works!', user: req.user });
//   }
// );

export const IndexRoutes = router