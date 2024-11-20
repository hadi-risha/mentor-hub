import express, { Request, Response, NextFunction } from 'express';
// import { adminLogin } from '../../controllers/admin_controller/auth.js'
import { adminAuthMiddleware } from '../../middleware/adminAuthMiddleware.js';
import { AdminController } from '../../controllers/adminController.js';


const router = express.Router();
const adminController = new AdminController();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);


/* ADMIN ROUTES */
router.post('/login', asyncHandler(adminController.adminLogin.bind(adminController)));

router.get("/home", adminAuthMiddleware, (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

router.get('/users', adminAuthMiddleware, asyncHandler(adminController.fetchUsers.bind(adminController))   );


router.patch('/user/block/:id', adminAuthMiddleware, asyncHandler(adminController.toggleUserBlock.bind(adminController))   );

// router.post('/switch-role', adminAuthMiddleware,  asyncHandler(switchUserRole));  
router.post('/switch-role', adminAuthMiddleware, asyncHandler(adminController.switchUserRole.bind(adminController))   );







export default router;
