import express, { Request, Response, NextFunction } from 'express';
import { getProfile, updateProfile, instructorHome, getSession, createSession,
     updateSession, deleteSession, switchUserRole, sessions, bookedSessions,
      availableSessions, sessionHistory, searchSessions } from '../../controllers/instructorController';
import { verifyToken } from '../../middleware/verifyUserToken';
import { checkUserRole } from '../../middleware/checkUserRole';
import multer from 'multer';
import config from '../../config/config';
import {s3} from '../../utils/s3Service';
import { HttpStatus } from '../../utils/httpStatusCodes';



const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/* STUDENT HOME */
router.get('/home', verifyToken, checkUserRole('instructor'), asyncHandler(instructorHome));
router.get('/sessions', verifyToken, checkUserRole('instructor'), asyncHandler(sessions));




router.get('/profile', verifyToken, checkUserRole('instructor'), asyncHandler(getProfile));  
router.put('/update-profile', verifyToken, checkUserRole('instructor'), upload.single('profilePic'), asyncHandler(updateProfile));  // profilePic - should matches the field name in  frontend

router.get('/session/:sessionId', verifyToken, checkUserRole('instructor'), asyncHandler(getSession));  
router.post('/create-session', verifyToken, checkUserRole('instructor'),  upload.single('coverImage'), asyncHandler(createSession)); 
router.put('/update-session', verifyToken, checkUserRole('instructor'),  upload.single('coverImage'), asyncHandler(updateSession)); 
router.delete('/delete-session/:sessionId', verifyToken, checkUserRole('instructor'), asyncHandler(deleteSession));


router.post('/switch-role', verifyToken, checkUserRole('instructor'), asyncHandler(switchUserRole)); 
router.get('/booked-sessions', verifyToken, checkUserRole('instructor'), asyncHandler(bookedSessions));  

router.get('/available-sessions', verifyToken, checkUserRole('instructor'), asyncHandler(availableSessions)); 

router.get('/session-history', verifyToken, checkUserRole('instructor'), asyncHandler(sessionHistory));

router.get('/sessions/search', verifyToken, checkUserRole('instructor'), asyncHandler(searchSessions));  













// router.get('/home',  asyncHandler(instructorHome));



export default router;