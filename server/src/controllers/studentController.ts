import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { uploadImageToS3 } from '../utils/s3Service';
import config from '../config/config'
import { HttpStatus } from '../utils/httpStatusCodes';
import { log } from 'winston';
import { BookingModel, IBooking } from '../models/bookingModel';
import mongoose from "mongoose"; 
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'; 
import { ObjectId } from 'mongodb';
import { ChatModel, IChat } from '../models/chatModel';
import { UserModel } from '../models/userModel';
import { MessageModel } from '../models/messageModel';
import { AiChatModel } from '../models/aiChat';
import { AiUserChatsModel } from '../models/aiUserChats';
import { PostModel } from '../models/postModel';
import { SessionModel } from '../models/sessionModel';
// import { getReceiverSocketId, io } from '../utils/socket';





const userService = new UserService();
const stripe = new Stripe(config.stripeSecretKey as string, {});

export const sessions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sessions = await userService.fetchSessions();
    return res.status(HttpStatus.OK).json({ message: "Sessions successfully fetched", sessions });
  } catch (error:any) {
    console.error("Failed to fetch sessions:- ", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch sessions",error: error.message});
  }
};

export const session = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const session = await userService.findSessionById(id);
    return res.status(HttpStatus.OK).json({ message: "Session successfully fetched", session });
  } catch (error:any) {
    console.error("Failed to fetch session:- ", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch session",error: error.message});
  }
};


interface IUserData {
  id: string;
  role: string;
}
export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  console.log("update profile section");

  let token = req.header("Authorization"); 
  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  console.log("token in student update profile", token);

  const { firstName, lastName, about, country, education, imageStatus } = req.body;
  console.log("imageStatus..>> ", imageStatus);
  
  try {
    const profilePicFile = req.file;
    console.log("profilePicFile", profilePicFile);

    const imageUnchanged = imageStatus === 'unchanged';
    const deleteProfilePic = imageStatus === 'deleted';
    const updateProfilePic = imageStatus === 'updated';

    console.log("imageUnchanged : ", imageUnchanged);
    console.log("updateProfilePic : ", updateProfilePic);
    console.log("deleteProfilePic : ", deleteProfilePic);

    const existingProfile = await userService.findUserById(id);
    if (!existingProfile) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "User doesn't exist" });
    }

    console.log("image from frontend  : ", profilePicFile);
    console.log("already exist image from backend db        " , existingProfile?.image);

    // upload the profile picture to S3 if provided
    let profilePicUrl = '';
    if (profilePicFile && updateProfilePic) {
      console.log("profile pic changed");
      const { url: profilePicUrl, key: profilePicKey } = await uploadImageToS3(profilePicFile);
      existingProfile.image = {
        url: profilePicUrl,
        key: profilePicKey,
      };
      console.log("student profile uploaded in s3 : ", profilePicUrl);
      console.log("profilePicFile", profilePicFile );
    } else if (deleteProfilePic) {
      console.log("profile pic deleted");
        existingProfile.image = {
          url: undefined,
          key: undefined,
        };
    } else if (imageUnchanged) {
      console.log("profile pic not changed");
        existingProfile.image = {
          url: existingProfile.image?.url,
          key: existingProfile.image?.key,
        };
    }else{
      console.log("something went wrong in image upload", profilePicUrl);
      console.log("profilePicFile && updateProfilePic", profilePicFile , updateProfilePic);
    }
      
    existingProfile.firstName = firstName ?? existingProfile.firstName;
    existingProfile.lastName = lastName ?? existingProfile.lastName;
    if (about !== undefined) existingProfile.about = about;
    if (country !== undefined) existingProfile.country = country;
    if (education !== undefined) existingProfile.education = education;

    const updatedProfile = await userService.updateUserDetails(existingProfile);
    return res.status(HttpStatus.OK).json({ message: "Profile successfully updated", profile: updatedProfile });
  } catch (error:any) {
    console.error("Error updating profile:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating the profile",error: error.message});
  }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  let token = req.header("Authorization"); 
  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  console.log("token in get profile", token);
  
  console.log("req.userData " , req.userData);

  try {
    const user = await userService.findUserById(id);
    if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    }else{
      console.log("details found in user", user);
    }

    const userData = {
      id:user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profilePicUrl: user.image?.url ? user.image?.url : null,
      profilePicKey: user.image?.key ? user.image?.key : null,
      country: user.country,
      education: user.education,
      about: user.about,
    };
    console.log("userData : ", userData);
  
    return res.status(HttpStatus.OK).json({ message: "User profile fetched successfully", ...userData });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the profile" });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<Response> => {
  const {id, role} = req.userData as IUserData;  //student id
  console.log("id, role", id, role);

  const { sessionId, selectedDate, selectedTimeSlot, concerns} =req.body;
  console.log("sessionId, selectedDate, selectedTimeSlot, concerns", sessionId, selectedDate, selectedTimeSlot, concerns);
  try {
    const session = await userService.findSessionById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const booking = await userService.createBooking({
      studentId:new mongoose.Types.ObjectId(id),
      sessionId,
      instructorId : session.instructorId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      concerns: concerns,
      status: "booked",
    } as Partial<IBooking>);

    return res.status(HttpStatus.CREATED).json({ message: "Booking created successfully", ...booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error creating booking:" });
  }
}


export const createBookingAndPayment = async (req: Request, res: Response): Promise<Response> => {
  const { sessionId, selectedDate, selectedTimeSlot, concerns, amount } = req.body;
  const { id, role } = req.userData as IUserData;
  
  try {
    const session = await userService.findSessionById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const paymentSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Session Booking', // Static product name
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${config.frontendUrl}/student/payment-success`,
      cancel_url: `${config.frontendUrl}/student/payment-cancel`,
    });

    console.log("00000000    paymentSession---------------0000000", paymentSession.url);
    console.log("00000000    paymentSession.id---------------0000000", paymentSession.id);

    const meetingRoomId = uuidv4();
    
    const booking = await userService.createBooking({
      studentId: new mongoose.Types.ObjectId(id),
      sessionId,
      instructorId: session.instructorId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      concerns,
      status: "booked",
      stripePaymentCheckoutSessionId: paymentSession.id, // Save Stripe session ID
      meetingRoomId,
    } as Partial<IBooking>);

    console.log("booking", booking);


    return res.status(HttpStatus.OK).json({ message: "Booking created successfully", url: paymentSession.url });
  } catch (error) {
    console.error("Error during payment creation:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error creating booking or payment." });
  }
}


export const switchUserRole = async (req: Request, res: Response): Promise<Response> => {
  let token = req.header("Authorization"); 
  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  console.log("token in switch role", token);

  const newRole = 'instructor'
  try {
    const updatedUser = await userService.switchUserRole(id, newRole)
    console.log("updatedUser : ", updatedUser);
    
    return res.status(HttpStatus.CREATED).json({ message: "User role updated successfully", ...updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error updating user role:" });
  }
}

export const bookedSessions = async (req: Request, res: Response): Promise<Response> => {
  let token = req.header("Authorization"); 
  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  console.log("token in student payment", token);
  try {
    const bookedSessions = await userService.bookedSessions(id)
    console.log("Booked sessions : ", bookedSessions);
    
    return res.status(HttpStatus.OK).json({ message: "Booked sessions fetched successfully", ...bookedSessions });
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching booked sessions:" });
  }
}


export const cancelBooking = async (req: Request, res: Response): Promise<Response> => {
  const { bookingId } = req.body;
  const { id } = req.userData as IUserData;

  try {
    const booking = await userService.findBookingById(bookingId);
    if (!booking) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Booking not found" });
    }

    console.log("booking...", booking);
    
    booking.status = "cancelled";
    await booking.save();

    const checkoutSession = await stripe.checkout.sessions.retrieve( booking.stripePaymentCheckoutSessionId );
    console.log("checkoutSession", checkoutSession);
    
    if ( checkoutSession ) {
      try {

        await stripe.refunds.create({

          payment_intent: checkoutSession.payment_intent as string,
        });
        return res.status(HttpStatus.OK).json({ message: "Booking cancelled and payment refunded" });
      } catch (refundError) {
        console.error("Error processing refund:", refundError);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error processing refund" });
      }
    }

    return res.status(HttpStatus.OK).json({ message: "Booking cancelled" });

  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error canceling booking" });
  }
}


export const searchSessions = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req.query as { query?: string }; 
  const { id } = req.userData as IUserData;

  if (!query) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Query parameter is required" });
  }

  try {
    const searchResults = await userService.searchSessions(query, id);
    return res.status(HttpStatus.OK).json({ message: "Search results fetched successfully",  searchResults });

  } catch (error) {
    console.error("Error performing search:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error performing search" });
  }
}


export const sessionHistory = async (req: Request, res: Response): Promise<Response> => {
  let token = req.header("Authorization"); 
  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  console.log("token in student payment", token);
  try {
    const bookedSessions = await userService.sessionHistory(id)
    console.log("Booked sessions : ", bookedSessions);
    
    return res.status(HttpStatus.OK).json({ message: "Session history fetched successfully", ...bookedSessions });
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching history:" });
  }
}



export const pendingSessions = async (req: Request, res: Response): Promise<Response> => {
  let token = req.header("Authorization"); 
  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  console.log("token in student payment", token);
  try {
    const bookedSessions = await userService.pendingSessions(id)
    
    console.log("Booked sessions : ", bookedSessions);
    
    return res.status(HttpStatus.OK).json({ message: "pending sessions fetched successfully", ...bookedSessions });
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching pending sessions:" });
  }
}


export const rateInstructor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {id, role} = req.userData as IUserData;
    console.log("id, role", id, role);

    const { ratedUser, rating, feedback, sessionId } = req.body;

    // Validate rating options
    if (!["poor", "good", "excellent"].includes(rating)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid rating value." });
    }

    const ratingData = { id, ratedUser, rating, feedback, sessionId }

    const newRating = await userService.rateInstructor(ratingData)
    console.log("newRating : ", newRating);
    
    return res.status(HttpStatus.CREATED).json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    console.error("Error submitting rate:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error submitting rate:" });
  }
}





export const completeSessionAndRateInstructor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {id, role} = req.userData as IUserData;
    console.log("id, role", id, role);


    const { sessionId, bookingId, rating, feedback } = req.body;
    console.log("bookingId......hh.........", bookingId);
    
    if (!["poor", "good", "excellent"].includes(rating)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid rating value." });
    }

    const booking = await userService.findBookingByIdS(id, sessionId);
    if (!booking) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Booking not found" });
    }
    
    const statusUpdated = await userService.findBookingAndChangeStatus(String(booking?._id), 'completed');
    if (!statusUpdated) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Error updating session status" });
    }

    // If the student has provided a rating, submit the rating data
    if (rating) {
      const ratingData = {
        ratedBy: new ObjectId(id), 
        ratedUser: booking?.instructorId, 
        rating,
        feedback,
        sessionId: booking.sessionId
      };
      const newRating = await userService.rateInstructor(ratingData);

      console.log("New Rating Submitted:", newRating);

      return res.status(HttpStatus.CREATED).json({ message: "Rating submitted successfully", rating: newRating });
    }


    return res.status(HttpStatus.OK).json({ message: "Session marked as completed. No rating provided." });
  } catch (error) {
    console.error("Error submitting rate:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error submitting rate:" });
  }
}

export const fetchNotifications = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {id, role} = req.userData as IUserData;
    console.log("id, role", id, role);
    const notifications = await userService.fetchNotifications();
    return res.status(HttpStatus.OK).json({ message: "Notifications fetched successfully", notifications,});
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching notifications:" });
  }
}





export const allMessages = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "_id firstName lastName email image.url")
      .populate("chat", "_id users latestMessage isGroupChat chatName groupAdmin");
    
    console.log("messages ---- all messages", messages);
    
    return res.status(HttpStatus.OK).json({ message: "All messages successfully fetched", messages: messages });
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching all messages." });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.status(400).json({ message: "Invalid data passed into request" });
    }

    const newMessage = {
      sender: id,
      content,
      chat: chatId,
    };

    // Create the message
    let message: any = await MessageModel.create(newMessage);

    console.log("message in createMessage 1 :- ", message);
    

    if (!message) {
      console.log("Message not found after creation");
      return res.status(404).json({ message: "Message not found" });
    }

    message = await message.
              populate("sender", "_id firstName lastName email image.url role")  // new message also has a sender so fetch all details

    console.log("message (sender) in createMessage 2 :- ", message);


    // Populate the chat details and nested users within chat
    message = await message.populate({
      path: "chat",
      select: "_id users latestMessage isGroupChat chatName groupAdmin",
      populate: {
        path: "users",
        select: "_id firstName lastName email image.url role",
      },
    });

    console.log("message (chat), (chat.users) in createMessage 3 :- ", message);
              
    
    await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });

    return res
      .status(HttpStatus.OK)
      .json({ message: "Message successfully sent", messageData: message });
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while sending the message." });
  }
};



//select a specific user to chat from the search
export const accessChat = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const  chatPartnerId  = req.body.userId;
    console.log("Chat Partner ID:", chatPartnerId);

    if (!chatPartnerId) {
      console.log("Partner ID is missing");
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Partner ID is required to access chat." });
    }

    // Check if a chat already exists
    const existingChats = await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: id } } },
        { users: { $elemMatch: { $eq: chatPartnerId } } },
      ],
    })
      .populate("users", "_id firstName lastName email image.url")
      // .populate("latestMessage");

      console.log("existingChats-------1", existingChats);

    // Populate last message sender details
    const populatedChats = await UserModel.populate(existingChats, {
      path: "latestMessage.sender",
      select: "_id firstName lastName email image.url",
    });

    console.log("populatedChats---------==2", populatedChats);
    

    // Return existing chat if found
    if (populatedChats.length > 0) {

      console.log("populatedChats---3", populatedChats);
      console.log("populatedChats[0]  4", populatedChats[0]);  //actually this is not only a single user detaiols , its the wole chat and user details of both users
      
       return res.status(HttpStatus.OK).json({ message: "Chat found", chat: populatedChats[0] });
    }

    // Create a new chat if no existing chat
    const newChatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [id, chatPartnerId],
    };

    const createdChat = await ChatModel.create(newChatData);

    console.log("createdChat in search", createdChat)
    const fullChat = await ChatModel.findOne({ _id: createdChat._id })
    .populate(
      "users", 
      "_id firstName lastName email image.url"
    )

    console.log("fullchat in accessacht 5", fullChat)

    return res.status(HttpStatus.CREATED).json({ message: "New chat created successfully", chat: fullChat });
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while accessing or creating the chat." });
  }
};


export const createGroupChat = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("in group chat create");
    
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    if (!req.body.name) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: "Please Fill the name" });
    }

    if (!req.body.users) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: "Please Fill all the feilds" });
    }
    console.log("req.body.name, req.body.users", req.body.name, req.body.users);

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      console.log("need more than 2 users");
      
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }else{
      console.log("yey more than 2 users there");
      
    }

    users.push(id);

    const groupChat = await ChatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: id,
    });
    console.log("groupChat created", groupChat);
    

    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
      .populate("users", "_id firstName lastName email image.url")
      .populate("groupAdmin", "_id firstName lastName email image.url");

      console.log("fullGroupChat--", fullGroupChat);

    
    return res.status(HttpStatus.OK).json({ message: "Group chat created successfully", fullGroupChat });
      
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating group chat." });
  }
};


export const renameGroup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const { chatId, chatName } = req.body;
    if (!chatName) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: "Please Fill the name" });
    }

    const updatedChat = await ChatModel.findByIdAndUpdate(
        chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
    .populate("users", "_id firstName lastName email image.url")
    .populate("groupAdmin", "_id firstName lastName email image.url");

    console.log("updatedChat", updatedChat);

    if (!updatedChat) {
      res.status(HttpStatus.NOT_FOUND);
      throw new Error("Chat Not Found");
    } 

    return res.status(HttpStatus.OK).json({ message: "Group name updated successfully", updatedChat });
      
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating community name." });
  }
};

export const addToGroup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const { chatId, userId } = req.body;

    const added = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
    .populate("users", "_id firstName lastName email image.url")
    .populate("groupAdmin", "_id firstName lastName email image.url");

    if (!added) {
      res.status(HttpStatus.NOT_FOUND);
      throw new Error("Chat Not Found");
    }

    return res.status(HttpStatus.OK).json({ message: "Successfully added user", added: added });
      
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while adding user." });
  }
};

export const removeFromGroup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const { chatId, userId } = req.body;

    const removed = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
    .populate("users", "_id firstName lastName email image.url")
    .populate("groupAdmin", "_id firstName lastName email image.url");

    if (!removed) {
      res.status(HttpStatus.NOT_FOUND);
      throw new Error("Chat Not Found");
    }

    return res.status(HttpStatus.OK).json({ message: "Successfully removed user from group", removed: removed });
      
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while removing user from community." });
  }
};

export const fetchChats = async (req: Request, res: Response): Promise<Response> => {
  console.log("in fetchChats----------");

  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    return ChatModel.find({ users: { $elemMatch: { $eq: id } } })
      .populate("users", "_id firstName lastName email role image.url")
      .populate("groupAdmin", "_id firstName lastName email role image.url")
      .populate("latestMessage", "_id content createdAt")
      .sort({ updatedAt: -1 })
      .then(async (results: any) => {
        results = await UserModel.populate(results, {
          path: "latestMessage.sender",
          select: "_id firstName lastName email role image.url",
        });

        console.log("populatedResults in fetchchats :- ", results);

        return res.status(HttpStatus.OK).json({ message: "Chat list successfully fetched", chatList: results, });
      })
      .catch((error) => {
        console.error("Error fetching chats:", error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: "An error occurred while accessing the chat list.",
        });
      });
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while accessing the chat list.",
    });
  }
};



export const allUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('searcch query for chat header', req.query.search)
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const keyword = req.query.search ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
    
    const users = await UserModel.find(keyword).find({ _id: { $ne: id } });
    console.log("users in allUsers------",users)
    return res.status(HttpStatus.OK).json({ message: "All users successfully fetched", users: users });
  } catch (error: any) {
    console.error("Error accessing or creating chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching all users." });
  }
};



export const getFeedPosts = async (req: Request, res: Response): Promise<Response> => {
  let token = req.header("Authorization"); 
  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  console.log("token ", token);
  try {
    const allPosts = await userService.fetchPosts()
    console.log("allPosts : ", allPosts);
    
    return res.status(HttpStatus.OK).json({ message: "Posts fetched successfully", posts: allPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching posts:" });
  }
}


export const likePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {id, role} = req.userData as IUserData;
    console.log("id, role", id, role);

    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post?.likes) {
      throw new Error("Post likes are undefined");
    }

    const isLiked = post?.likes?.get(id);  //get - in Map, this method checks if the userId exists as a key
    if (isLiked) {
        post?.likes?.delete(id); //delete - in Map, removing like(or userid) from already liked post,
    }else{
        post?.likes?.set(id, true);  //userId is the key, true is the value 
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {likes: post.likes}, 
        { new: true }  //if do not specify this option or set it to false, Mongoose will return the og document before the update.
    ); 

    const updatedPostData = await PostModel.findById(updatedPost?._id).populate({
      path: 'instructorId',
      select: '_id firstName lastName role country image.url',
    });

    return res.status(HttpStatus.OK).json({ message: "Post updated successfully", updatedPost: updatedPostData });
  } catch (error) {
    console.error("Error updating likes:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error updating likes:" });
  }
}

export const createAiChat = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const { text } = req.body;

    const newChat = new AiChatModel({
      userId: id,
      history: [{ role: "user", parts: [{ text }] }],
    });

    console.log("newChat", newChat);

    const savedChat = await newChat.save();

     // CHECK IF THE USERCHATS EXISTS
    const userChats = await AiUserChatsModel.find({ userId: id });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      console.log("chats doenst exist so create a new chats");
      
      const newUserChats = new AiUserChatsModel({
        userId: id,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      console.log("newUserChats", newUserChats);
      

      await newUserChats.save();
      return res.status(HttpStatus.CREATED).json({ message: "New Ai chat created successfully", newChatId: savedChat._id });

    }else {
      console.log("chats already exist so push id to chats");
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await AiUserChatsModel.updateOne(
        { userId: id },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      return res.status(HttpStatus.CREATED).json({ message: "New Ai chat created successfully",  newChatId: newChat._id});
    }
  } catch (error: any) {
    console.error("Error creating Ai chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the AI chat." });
  }
};

export const fetchAiChatlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;

    const userChats = await AiUserChatsModel.find({ userId: id });
    return res.status(HttpStatus.OK).json({ message: "User Ai chat list fetched successfully",  userChats: userChats[0].chats});
  } catch (error: any) {
    console.error("Error fetching Ai chatlist:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the AI chat list." });
  }
};

export const fetchSingleChat = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    const chatId = req.params.id;

    console.log("chatId----==", chatId);
    
    const chat = await AiChatModel.findOne({ _id: chatId, userId: id });
    console.log("chat--------chat :-", chat);
    
    return res.status(HttpStatus.OK).json({ message: "User Ai chat fetched successfully",  chat: chat});

  } catch (error: any) {
    console.error("Error fetching Ai chat:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the AI chat." });
  }
};



export const updateExistingChat = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    const chatId = req.params.id;
    
    console.log("chatId----==", chatId);

    const { question, answer, img } = req.body;

    console.log("question, answer, img", question, answer, img);
    

    const newItems = [
      ...(question
        ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
        : []),
      { role: "model", parts: [{ text: answer }] },
    ];

    const updatedChat = await AiChatModel.updateOne(
      { _id: chatId, userId: id },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      },
      { new: true } 
    );

    console.log("updatedChat-------- :-", updatedChat);
    
    return res.status(HttpStatus.OK).json({ message: "User Ai conversation added successfully",  updatedChat: updatedChat});

  } catch (error: any) {
    console.error("Error adding conversation:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while adding conversation." });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Password and Confirm Password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error("Error fetching Ai chatlist:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while reset password." });
  }
};


export const toggleWishlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    const { sessionId } = req.body;

    const user = await UserModel.findById(id); 

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    }

    user.wishlistSessionIds = user.wishlistSessionIds || [];

    if (user.wishlistSessionIds.includes(sessionId)) {
      // Remove the sessionId from the wishlist
      user.wishlistSessionIds = user.wishlistSessionIds.filter(id => id !== sessionId);
      await user.save();
      return res.status(200).json({ message: 'Session removed from wishlist', isInWishlist: false });
    } else {
      // Add the sessionId to the wishlist
      user.wishlistSessionIds.push(sessionId);
      await user.save();
      return res.status(200).json({ message: 'Session added to wishlist', isInWishlist: true });
    }
  } catch (error: any) {
    console.error("Error updating wishlist:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating the wishlist." });
  }
};

export const isSessionInWishlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.userData as IUserData;
    const { sessionId } = req.body;

    const user = await UserModel.findById(id); 

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    }

    user.wishlistSessionIds = user.wishlistSessionIds || [];

    // Check if the sessionId is in the wishlist
    const isInWishlist = user.wishlistSessionIds.includes(sessionId);

    if (isInWishlist) {
      let wishlist = {sessionId: sessionId, isInWislist: true}
      return res.status(200).json({ message: 'Session is in the wishlist', wishlist: wishlist });
    } else {
      let wishlist = {sessionId: sessionId, isInWislist: false}
      return res.status(404).json({ message: 'Session is not in the wishlist', wishlist: wishlist });
    }

  } catch (error: any) {
    console.error("Error checking wishlist:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while checking the wishlist." });
  }
};

export const wishlistSessions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.userData as IUserData; 
    const { sessionId } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    }

    const wishlistSessionIds = user?.wishlistSessionIds;

    const sessions = await SessionModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'instructorId',
        select: 'firstName lastName',
      });

    const filteredSessions = await Promise.all(
      sessions.map(async (session: any) => {
        // Check if the session is in the user's wishlist
        if (!wishlistSessionIds?.includes(session?._id.toString())) {
          return null; // Skip this session if it's not in the wishlist
        }

        // Check if the session has a booking for this user
        const booking = await BookingModel.findOne({
          sessionId: session._id, 
          studentId: id,
        });

        // Only return sessions where the status is not "booked" or is "completed" or "cancelled"
        if (booking && booking.status === 'booked') {
          return null; // Skip this session if it's still booked
        }

        // Return session if it's not booked or has a valid status
        return session;
      })
    );

    //  Filter out any null values from the result
    const validSessions = filteredSessions.filter((session) => session !== null);

    console.log("validSessions--", validSessions);
    

    //  Return the filtered sessions in the response
    return res.status(HttpStatus.OK).json({
      message: 'Sessions successfully fetched',
      sessions: validSessions,
    });

  } catch (error: any) {
    console.error('Error fetching wishlist:', error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'An error occurred while fetching the wishlist.',
    });
  }
};
