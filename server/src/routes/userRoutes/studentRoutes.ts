import express, { Request, Response, NextFunction } from 'express';
import { updateProfile, sessions, session, getProfile, createBooking, createBookingAndPayment, switchUserRole, bookedSessions, cancelBooking, searchSessions, sessionHistory,pendingSessions } from '../../controllers/studentController';
import { verifyToken } from '../../middleware/verifyUserToken';
import { checkUserRole } from '../../middleware/checkUserRole';
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

// router.post('/create-booking', verifyToken, checkUserRole('student'), asyncHandler(createBooking));  

// router.post('/payment', verifyToken, checkUserRole('student'), asyncHandler(stripePayment));  
router.post('/book-and-pay', verifyToken, checkUserRole('student'), asyncHandler(createBookingAndPayment));  





router.post('/switch-role', verifyToken, checkUserRole('student'), asyncHandler(switchUserRole));  

router.get('/booked-sessions', verifyToken, checkUserRole('student'), asyncHandler(bookedSessions)); 

router.put('/cancel-booking', verifyToken, checkUserRole('student'), asyncHandler(cancelBooking));  

router.get('/sessions/search', verifyToken, checkUserRole('student'), asyncHandler(searchSessions));  

router.get('/session-history', verifyToken, checkUserRole('student'), asyncHandler(sessionHistory)); 

router.get('/pending-sessions', verifyToken, checkUserRole('student'), asyncHandler(pendingSessions)); 
















export default router;