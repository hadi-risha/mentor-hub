import express, { Request, Response, NextFunction } from 'express';
import { adminAuthMiddleware } from '../../middleware/adminAuthMiddleware';
import { AdminController } from '../../controllers/adminController';

const router = express.Router();
const adminController = new AdminController();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);


/* ADMIN ROUTES */
router.post('/login', asyncHandler(adminController.adminLogin.bind(adminController)));

// router.get("/home", adminAuthMiddleware, (req, res) => {
//     res.json({ message: "Welcome Admin!" });
// });

router.get('/users', adminAuthMiddleware, asyncHandler(adminController.fetchUsers.bind(adminController)) );
router.patch('/user/block/:id', adminAuthMiddleware, asyncHandler(adminController.toggleUserBlock.bind(adminController)) );
router.post('/switch-role', adminAuthMiddleware, asyncHandler(adminController.switchUserRole.bind(adminController)) );


router.post('/notification/create', adminAuthMiddleware, asyncHandler(adminController.createNotification.bind(adminController)) );
router.put('/notification/update/:id', adminAuthMiddleware, asyncHandler(adminController.updateNotification.bind(adminController)) );

router.delete('/notification/delete/:id', adminAuthMiddleware, asyncHandler(adminController.deleteNotification.bind(adminController)) );
router.get('/notifications', adminAuthMiddleware, asyncHandler(adminController.getNotifications.bind(adminController)) ); //all notifications

router.get('/notification/:id', adminAuthMiddleware, asyncHandler(adminController.getNotification.bind(adminController)) ); //single notification












export default router;
