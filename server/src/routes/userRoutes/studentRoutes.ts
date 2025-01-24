import express, { Request, Response, NextFunction } from 'express';
import { updateProfile, sessions, session, getProfile, 
        fetchNotifications, createBookingAndPayment, 
        switchUserRole, bookedSessions, cancelBooking, 
        searchSessions, sessionHistory,pendingSessions, 
        rateInstructor, completeSessionAndRateInstructor, 
        accessChat, fetchChats, getFeedPosts, likePost,
        createGroupChat, renameGroup, removeFromGroup,
        addToGroup, allUsers, allMessages,
        sendMessage,
        createAiChat,
        fetchAiChatlist,
        fetchSingleChat,
        updateExistingChat,
        changePassword,
        toggleWishlist,
        isSessionInWishlist,
        wishlistSessions
} from '../../controllers/studentController';
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

/* STUDENT ROUTES */
router.get('/sessions', verifyToken, checkUserRole('student'), asyncHandler(sessions));

router.get('/session/:id', verifyToken, checkUserRole('student'), asyncHandler(session));

router.put('/update-profile', verifyToken, checkUserRole('student'), upload.single('profilePic'), asyncHandler(updateProfile));  // profilePic - should matches the field name in  frontend

router.get('/profile', verifyToken, checkUserRole('student'), asyncHandler(getProfile));  

router.post('/book-and-pay', verifyToken, checkUserRole('student'), asyncHandler(createBookingAndPayment));  

router.post('/switch-role', verifyToken, checkUserRole('student'), asyncHandler(switchUserRole));  

router.get('/booked-sessions', verifyToken, checkUserRole('student'), asyncHandler(bookedSessions)); 

router.put('/cancel-booking', verifyToken, checkUserRole('student'), asyncHandler(cancelBooking));  

router.get('/sessions/search', verifyToken, checkUserRole('student'), asyncHandler(searchSessions));  

router.get('/session-history', verifyToken, checkUserRole('student'), asyncHandler(sessionHistory)); 

router.get('/pending-sessions', verifyToken, checkUserRole('student'), asyncHandler(pendingSessions)); 

router.post('/rate', verifyToken, checkUserRole('student'), asyncHandler(rateInstructor)); 

router.post('/session-complete/rating', verifyToken, checkUserRole('student'), asyncHandler(completeSessionAndRateInstructor)); 

router.get('/notifications', verifyToken, checkUserRole('student'), asyncHandler(fetchNotifications)); 


router.get('/chat', verifyToken, checkUserRole('student'), asyncHandler(fetchChats));  //fetch a all chats and their details
router.get('/chat/all-users', verifyToken, checkUserRole('student'), asyncHandler(allUsers));  //search users to chat
router.post('/chat/access', verifyToken, checkUserRole('student'), asyncHandler(accessChat));  //header search, select a specific user to chat from the search, 

router.post('/message', verifyToken, checkUserRole('student'), asyncHandler(sendMessage)); //to send or create a message
router.get('/message/:chatId', verifyToken, checkUserRole('student'), asyncHandler(allMessages));   //fetch all messages of single chat


router.post('/chat/new-group', verifyToken, checkUserRole('student'), asyncHandler(createGroupChat)); 
router.put('/chat/rename', verifyToken, checkUserRole('student'), asyncHandler(renameGroup)); 
router.put('/chat/group-add', verifyToken, checkUserRole('student'), asyncHandler(addToGroup)); 
router.put('/chat/remove-user', verifyToken, checkUserRole('student'), asyncHandler(removeFromGroup)); 


router.get('/posts', verifyToken, checkUserRole('student'), asyncHandler(getFeedPosts)); 
router.patch('/post/:postId/like', verifyToken, checkUserRole('student'), asyncHandler(likePost)); 


router.post('/ai/chat', verifyToken, checkUserRole('student'), asyncHandler(createAiChat)); 
router.get('/ai/userchats', verifyToken, checkUserRole('student'), asyncHandler(fetchAiChatlist)); 
router.get('/ai/chat/:id', verifyToken, checkUserRole('student'), asyncHandler(fetchSingleChat));
router.put('/ai/chat/:id', verifyToken, checkUserRole('student'), asyncHandler(updateExistingChat)); 

router.put('/change-password', verifyToken, checkUserRole('student'), asyncHandler(changePassword)); 

router.patch('/wishlist', verifyToken, checkUserRole('student'), asyncHandler(toggleWishlist)); 
router.post('/wishlist/check', verifyToken, checkUserRole('student'), asyncHandler(isSessionInWishlist)); 


router.get('/wishlist/sessions', verifyToken, checkUserRole('student'), asyncHandler(wishlistSessions)); 






























export default router;