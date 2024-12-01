import express, { Request, Response, NextFunction } from 'express';
import { updateProfile, sessions, session, getProfile, createBooking, stripePayment, switchUserRole, bookedSessions, cancelSession } from '../../controllers/studentController.js';
import { verifyToken } from '../../middleware/verifyUserToken.js';
import { checkUserRole } from '../../middleware/checkUserRole.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/* STUDENT HOME */
router.get('/sessions', verifyToken, checkUserRole('student'), asyncHandler(sessions));
router.get('/session/:id', verifyToken, checkUserRole('student'), asyncHandler(session));

router.put('/update-profile', verifyToken, checkUserRole('student'), upload.single('profilePic'), asyncHandler(updateProfile));  // profilePic - should matches the field name in  frontend
router.get('/profile', verifyToken, checkUserRole('student'), asyncHandler(getProfile));  

router.post('/create-booking', verifyToken, checkUserRole('student'), asyncHandler(createBooking));  

router.post('/payment', verifyToken, checkUserRole('student'), asyncHandler(stripePayment));  


router.post('/switch-role', verifyToken, checkUserRole('student'), asyncHandler(switchUserRole));  

router.get('/booked-sessions', verifyToken, checkUserRole('student'), asyncHandler(bookedSessions)); 

router.put('/cancel-session/:bookingId', verifyToken, checkUserRole('student'), asyncHandler(cancelSession));  











export default router;