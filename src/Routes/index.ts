import { Request,Response } from 'express';
import {Router} from 'express';
import { AuthRoutes } from '../app/module/auth/auth.route';
import checkAuth from '../app/middleware/checkAuth';
import { UserRole } from '../generated/prisma/enums';

const router = Router();

router.use('/auth',AuthRoutes)







// This route is for testing my route

// router.get(
//   '/test-auth',
//   checkAuth(UserRole.USER),
//   (req: Request, res: Response) => {
//     res.json({ success: true, message: 'Protected route works!', user: req.user });
//   }
// );

export const IndexRoutes = router