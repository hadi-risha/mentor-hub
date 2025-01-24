import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { uploadImageToS3, deleteImageFromS3 } from '../utils/s3Service';
import { log } from 'winston';
import config from '../config/config';
import bcrypt from 'bcryptjs'; 
import { HttpStatus } from '../utils/httpStatusCodes';
import mongoose from 'mongoose';
import { IInstructor, ISession } from '../models/sessionModel';
import { ChatModel, IChat } from '../models/chatModel';
// import { getReceiverSocketId, io } from '../utils/socket';
import { IPost, PostModel } from '../models/postModel';
import { UserModel } from '../models/userModel';
import { MessageModel } from '../models/messageModel';
import { AiChatModel } from '../models/aiChat';
import { AiUserChatsModel } from '../models/aiUserChats';
import { BookingModel } from '../models/bookingModel';






const userService = new UserService();

/* INSTRUCTOR HOME */
export const instructorHome = async (req: Request, res: Response): Promise<Response> => {

    console.log("req.userData in instructor home page" , req.userData);

    let token = req.header("Authorization"); 
    console.log("token in instructor home", token);
    
    
    if (req.userData && typeof req.userData === 'object' && 'id' in req.userData) {
        const id = (req.userData as { id: string }).id; 
        console.log("id", id);
        
        try {
            const user = await userService.findUserById(id);
            console.log(user);
            return res.json({message: "user data", user });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user' });
        }
    }

    return res.status(HttpStatus.OK).json({ message: "Welcome to the instructor Home Page", userData: req.userData });
};


export const sessions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sessions = await userService.fetchSessions();
    return res.status(HttpStatus.OK).json({ message: "Sessions successfully fetched", sessions });
  } catch (error:any) {
    console.error("Failed to fetch sessions:- ", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch sessions",error: error.message});
  }
};


export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    
  let token = req.header("Authorization"); 
  console.log("token in get profile", token);

  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  
  console.log("req.userData " , req.userData);

    try {
      const user = await userService.findUserById(id);
      if (!user) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
      }else{
        console.log("details found in user", user);
      }

      const profile = await userService.findUserById(id );
      if (!profile) {
        console.log("no details found from user profile", profile);
        
      }else{
        console.log("details found in user profile", profile);
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
        occupation: user.occupation,
        education: user.education,
        about: user.about,
        currentInstitution: user.currentInstitution,
        teachingViews: user.teachingViews,
        achievements: user.achievements,
        experience: user.experience
      };

      console.log("userData:", userData);
      
      return res.status(HttpStatus.OK).json({ message: "User profile fetched successfully",  ...userData });

    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the profile" });
    }

};

interface IUserData {
    id: string;
    role: string;
  }
export const updateProfile = async (req: Request, res: Response): Promise<Response> => {



  const { firstName, lastName, about, country, occupation,currentInstitution,
    teachingViews,achievements,
    education,experience, imageStatus} = req.body;

  console.log("imageStatus..>>   ", imageStatus);

  try {
    let token = req.header("Authorization"); 
    console.log("token in instructor update profile", token);

    const {id, role} = req.userData as IUserData;
    console.log("id, role", id, role);

    const profilePicFile = req.file;
    console.log("profilePicFile", profilePicFile);

    const key = req.file;
    console.log("image,   req.file.key : ", key);

    const imageUnchanged = imageStatus === 'unchanged';
    const deleteProfilePic = imageStatus === 'deleted';
    const updateProfilePic = imageStatus === 'updated';

    console.log("imageUnchanged     ", imageUnchanged);
    console.log("updateProfilePic     ", updateProfilePic);
    console.log("deleteProfilePic     ", deleteProfilePic);



    const existingProfile = await userService.findUserById(id);
    if (!existingProfile) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "User doesn't exist" });
    }

    console.log("image from frontend - key : ", profilePicFile);
    console.log("already exist image..from backend db        " , existingProfile?.image);







    // upload the profile picture to S3 if provided
    let profilePicUrl = '';
    if (profilePicFile && updateProfilePic) {
      console.log("profile pic changed");
      
      const { url: profilePicUrl, key: profilePicKey } = await uploadImageToS3(profilePicFile);

      
      existingProfile.image = {
        url: profilePicUrl,
        key: profilePicKey,
      };
      console.log("student profile uploaded in s3-", profilePicUrl);
      console.log("profilePicFile && updateProfilePic", profilePicFile , updateProfilePic);
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
        console.log("No action needed, existing image values remain");
    }else{
      console.log("something went wrong in image upload", profilePicUrl);
      console.log("profilePicFile && updateProfilePic", profilePicFile , updateProfilePic);
    }

      existingProfile.firstName = firstName ?? existingProfile.firstName;
      existingProfile.lastName = lastName ?? existingProfile.lastName;
      if (about !== undefined) existingProfile.about = about;
      if (country !== undefined) existingProfile.country = country;
      if (occupation !== undefined) existingProfile.occupation = occupation;
      if (currentInstitution !== undefined) existingProfile.currentInstitution = currentInstitution;
      if (teachingViews !== undefined) existingProfile.teachingViews = teachingViews;
      if (achievements !== undefined) existingProfile.achievements = achievements;
      if (education !== undefined) existingProfile.education = education;
      if (experience !== undefined) existingProfile.experience = experience;
      
      const updatedProfile = await userService.updateUserDetails(existingProfile);
      return res.status(HttpStatus.OK).json({ message: "Profile successfully updated", profile: updatedProfile });

  } catch (error:any) {
    console.error("Error updating profile:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating the profile",error: error.message});
  }

};





export const getSession = async (req: Request, res: Response): Promise<Response> => {
  console.log("***GET SESSION****");

  const { sessionId } = req.params;
  console.log("sessionId:- ", sessionId);
  
  const {id, role} = req.userData as IUserData;
  console.log("id, role:- ", id, role);
  
    try {
      const user = await userService.findUserById(id);
      if (!user) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: "Instructor not found" });
      }

      const session = await userService.findSessionById(sessionId);
      if (!session) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: "Session not found" });
      }
      console.log("session info:- ", session);
      
      console.log(
        "session info instructorId:- ",
        (session.instructorId as IInstructor)?.firstName,
        (session.instructorId as IInstructor)?.lastName,
        (session.instructorId as IInstructor)?.image.url,
        (session.instructorId as IInstructor)?._id
      );
    
      const sessionData = {
        id: session._id,
        title: session.title,
        introduction: session.introduction,
        duration: session.duration,
        fee: session.fee,
        descriptionTitle: session.descriptionTitle,
        description: session.description,
        timeSlots: session.timeSlots,
        sessionimgUrl: session.coverImage?.url ? session.coverImage?.url : null,
        sessionimgKey: session.coverImage?.key ? session.coverImage?.key : null,

        instructorId: (session.instructorId as IInstructor)?._id,
        firstName: (session.instructorId as IInstructor)?.firstName,
        lastName: (session.instructorId as IInstructor)?.lastName,
        instructorImg: (session.instructorId as IInstructor)?.image.url,
      };
      console.log("sessionData:- ", sessionData);

      return res.status(HttpStatus.OK).json({ message: "Session details fetched successfully",  ...sessionData });
    } catch (error) {
      console.error("Error fetching session data:- ", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the session deta" });
    }
};


export const createSession = async (req: Request, res: Response): Promise<Response> => {
  console.log("***CREATE SESSION****");

  const { title, introduction, duration, fee, descriptionTitle, description,  rawTimeSlots } = req.body;
  const timeSlots = rawTimeSlots.split(',');
  console.log("req.body:- ",  title, introduction, duration, fee, descriptionTitle, description, rawTimeSlots);
  console.log("session time rawTimeSlots:- ", rawTimeSlots);

  const coverImageFile = req.file;
  console.log("session cover image:- ", coverImageFile);

  if (!title) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Title required" });
  }
  if (!introduction) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Introduction required" });
  }
  if (!duration) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Duration required" });
  }
  if (!fee) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Fees required" });
  }
  if (!descriptionTitle) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Description title required" });
  }
  if (!description) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Description required" });
  }
  if (!rawTimeSlots) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Time slots are required" });
  }
  if (!coverImageFile) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Cover image is required' });
  }
  
  if (
    !title.trim() ||
    !introduction.trim() ||
    !descriptionTitle.trim() ||
    !description.trim() 
   ) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Field cannot be empty" });
  }
  
  try {
    const {id, role} = req.userData as IUserData;
    console.log("id, role:- ", id, role);

    const { url: coverImageUrl, key: coverImageKey } = await uploadImageToS3(coverImageFile);
    console.log(" image url from  s3:- ", coverImageUrl); 
    console.log(" image key from  s3:- ", coverImageKey);

    const existingInstructor = await userService.findUserById(id);
    if (!existingInstructor) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Instructor doesn't exist, cannot create session" });
    }

    const session = await userService.createSession({
      title, 
      introduction,
      duration, 
      fee, 
      descriptionTitle,
      description, 
      timeSlots,
      coverImage: {
        url: coverImageUrl,  
        key: coverImageKey  
      },
      instructorId: new mongoose.Types.ObjectId(id),
    } as Partial<ISession>);

      return res.status(HttpStatus.OK).json({ message: 'Session successfully created', data: session,  file: coverImageFile });
  } catch (error:any) {
      console.error("Error creating session profile:- ", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the session",error: error.message});
  }
};






export const updateSession = async (req: Request, res: Response): Promise<Response> => {
  console.log("***UPDATE SESSION****");

  const { title, introduction, duration, fee, descriptionTitle, description,  rawTimeSlots, imageStatus, sessionId } = req.body;
  console.log("req.body:- ",  title, introduction, duration, fee, descriptionTitle, description,  rawTimeSlots, imageStatus, sessionId);
  console.log("02:48,02:48,23:51 rawTimeSlots:- ", rawTimeSlots);

  const timeSlots = rawTimeSlots.split(',');
  console.log("session time slots:- ", timeSlots);
  console.log("imageStatus..>>   ", imageStatus);
  
  const coverImageFile = req.file;
  console.log("cover image", coverImageFile);

  if (!title) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Title required" });
  }
  if (!introduction) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Introduction required" });
  }
  if (!duration) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Duration required" });
  }
  if (!fee) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Fees required" });
  }
  if (!descriptionTitle) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Description title required" });
  }
  if (!description) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Description required" });
  }
  if (!rawTimeSlots) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Time slots are required" });
  }
  if (!coverImageFile) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Cover image is required' });
  }

  if (
    !title.trim() ||
    !introduction.trim() ||
    !descriptionTitle.trim() ||
    !description.trim() 
   ) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Field cannot be empty" });
  }
  try {
    const {id, role} = req.userData as IUserData;
    console.log("id, role:- ", id, role);

    const imageUnchanged = imageStatus === 'unchanged';
    const deleteCoverImage = imageStatus === 'deleted';
    const updateCoverImage = imageStatus === 'updated';
    console.log("imageUnchanged:- ", imageUnchanged);
    console.log("updateProfilePic:- ", updateCoverImage);
    console.log("deleteProfilePic:- ", deleteCoverImage);

    const existingInstructor = await userService.findUserById(id);
    if (!existingInstructor) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Instructor doesn't exist, cannot create session" });
    }

    const existingSession = await userService.findSessionById(sessionId);
    if (!existingSession) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Session doesn't exist" });
    }
    console.log("already exist image from db:- " , existingSession?.coverImage?.key);

    
    // upload the profile picture to S3 if new image provided
    let coverImageUrl = '';
    if (coverImageFile && updateCoverImage) {
      console.log("profile pic changed");
      const { url: coverImageUrl, key: coverImageKey } = await uploadImageToS3(coverImageFile);

      existingSession.coverImage = {
        url: coverImageUrl,
        key: coverImageKey,
      };
      console.log("cover image uploaded in s3:- ", coverImageKey);
    } else if (imageUnchanged) {
        console.log("cover image not changed");
        existingSession.coverImage = {
          url: existingSession.coverImage?.url,
          key: existingSession.coverImage?.key,
        };
    }else{
      console.log("something went wrong in image upload", coverImageUrl);
    }    

    existingSession.title = title ?? existingSession.title; 
    existingSession.introduction = introduction ?? existingSession.introduction;
    existingSession.duration = duration ?? existingSession.duration;
    existingSession.fee = fee ?? existingSession.fee;
    existingSession.descriptionTitle = descriptionTitle ?? existingSession.descriptionTitle;
    existingSession.description = description ?? existingSession.description;
    existingSession.timeSlots = timeSlots ?? existingSession.timeSlots;
      
    const updatedSession = await userService.updateSessionDetails(existingSession);
    return res.status(HttpStatus.OK).json({ message: "Session Details successfully updated", session: updatedSession });
  } catch (error:any) {
    console.error("Error creating session:- ", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating the session",error: error.message});
  }
};


export const deleteSession = async (req: Request, res: Response): Promise<Response> => {
  const { sessionId } = req.params;
  try {
    const existingSession = await userService.findSessionById(sessionId);
    if (!existingSession) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Session doesn't exist" });
    }
    
    // Delete the cover image from S3 if it exists
    if (existingSession.coverImage?.key) {

      console.log("existingSession.coverImage.key:- ",existingSession.coverImage.key);
      
      // try {
      //   await deleteImageFromS3(existingSession.coverImage.key);
      //   console.log("Cover image deleted from S3");
      // } catch (s3Error) {
      //   console.error("Error deleting image from S3:", s3Error);
      //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error deleting session image from S3" });
      // }
    }

    // Delete the session from the database
    const wasDeleted = await userService.deleteSessionById(sessionId);
    if (!wasDeleted) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Session not found or already deleted" });
    }
    return res.status(HttpStatus.OK).json({ message: "Session successfully deleted" });
  } catch (error: any) {
    console.error("Error deleting session:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while deleting the session", error: error.message });
  }
};



export const switchUserRole = async (req: Request, res: Response): Promise<Response> => {
  // const { userId } = req.body;

  let token = req.header("Authorization"); 
  console.log("token in instructor role switch", token);

  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);


  const newRole = 'student'

  try {
    const updatedUser = await userService.switchUserRole(id, newRole)
    console.log("updatedUser-", updatedUser);
    
    return res.status(HttpStatus.CREATED).json({ message: "User role updated successfully", ...updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error updating user role:" });
  }

}


export const bookedSessions = async (req: Request, res: Response): Promise<Response> => {
  
  let token = req.header("Authorization"); 
  console.log("token in student payment", token);

  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);



  try {
    const bookedSessions = await userService.instructorBookedSessions(id)
    console.log("Booked sessions-----------", bookedSessions);
    
    return res.status(HttpStatus.OK).json({ message: "Booked sessions fetched successfully", ...bookedSessions });
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching booked sessions:" });
  }

}


export const availableSessions = async (req: Request, res: Response): Promise<Response> => {
  
  let token = req.header("Authorization"); 
  console.log("token in student payment", token);

  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  try {
    const availableSessions = await userService.instructorAvailableSessions(id)
    console.log("Booked sessions-----------", availableSessions);
    
    return res.status(HttpStatus.OK).json({ message: "Instructor sessions fetched successfully", ...availableSessions });
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching instructor sessions:" });
  }

}



export const sessionHistory = async (req: Request, res: Response): Promise<Response> => {
  let token = req.header("Authorization"); 
  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  console.log("token ", token);
  try {
    const bookedSessions = await userService.instructorSessionHistory(id)
    console.log("Booked sessions : ", bookedSessions);
    
    return res.status(HttpStatus.OK).json({ message: "Session history fetched successfully", historyData: bookedSessions });
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching history:" });
  }
}


export const searchSessions = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req.query as { query?: string }; 
  const { id } = req.userData as IUserData;

  if (!query) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Query parameter is required" });
  }

  try {
    const searchResults = await userService.instructorSearchSessions(query, id);
    return res.status(HttpStatus.OK).json({ message: "Search results fetched successfully",  searchResults });

  } catch (error) {
    console.error("Error performing search:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error performing search" });
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
      

  //   let allInfo: IChatInfo[] = existingChats?.map(chat => ({
  // _id: chat._id.toString(),
  // users: chat.users.map(user => ({
  //   _id: user._id,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     email: user.email,
//     image: { url: user.image.url },
//   })),
//   latestMessage: {
//     _id: chat.latestMessage._id,
//     // sender: chat.latestMessage?.sender
//     //   ? {
//     //       _id: chat.latestMessage?.sender?._id,
//     //       firstName: chat.latestMessage?.sender?.firstName,
//     //       lastName: chat.latestMessage?.sender.lastName,
//     //       email: chat.latestMessage.sender.email,
//     //       image: { url: chat.latestMessage.sender.image.url },
//     //     }
//     //   : undefined,
//   },
//   isGroupChat: chat.isGroupChat,
//   chatName: chat.chatName,
// }));

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
      
      // return res.status(HttpStatus.OK).json({ message: "Chat found",existingChats: existingChats, chat: populatedChats[0] });
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

    // with or without students create a group(in instructor side)
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

    // check if the requester is admin

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









export const createPost = async (req: Request, res: Response): Promise<Response> => {
  console.log("***CREATE POST****");
  const { description } = req.body;

  const image = req.file;
  console.log("post image:- ", image);

  if (!description) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Description required' });
  }
  if ( !description.trim() ) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "Field cannot be empty" });
  }
  if (!image) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Cover image is required' });
  }
  
  try {
    const {id, role} = req.userData as IUserData;
    console.log("id, role:- ", id, role);

    const { url: imageUrl, key: imageKey } = await uploadImageToS3(image);
    console.log(" image url from  s3:- ", imageUrl); 
    console.log(" image key from  s3:- ", imageKey);

    const existingInstructor = await userService.findUserById(id);
    if (!existingInstructor) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Instructor doesn't exist, cannot create post" });
    }

    const post = await userService.createPost({
      instructorId: new mongoose.Types.ObjectId(id),
      description,
      image: {
        url: imageUrl,  
        key: imageKey  
      },
    } as Partial<IPost>);

      return res.status(HttpStatus.OK).json({ message: 'Post successfully created', post: post });
  } catch (error:any) {
      console.error("Error creating session profile:- ", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the session",error: error.message});
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

    // const post = await Post.findById(id);
    // const post = await userService.findPostById(postId);
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

    // const newLikes: Record<string, boolean> = Object.fromEntries(post.likes.entries());
    // const updatedPost = await userService.updatePostById(postId, newLikes);

    const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {likes: post.likes}, 
        { new: true }  //if do not specify this option or set it to false, Mongoose will return the og document before the update.
    ); 

    return res.status(HttpStatus.OK).json({ message: "Chat List fetched successfully", updatedPost:updatedPost });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching chat:" });
  }
}





export const createAiChat = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;
    console.log("User ID and Role:", id, role);

    const { text } = req.body;

    console.log("textooooooooo", text);
    

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


export const fetchWallet = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;

    const walletData = await BookingModel.find({ instructorId: id })
    .populate("studentId", "_id firstName lastName image.url")
    .populate("sessionId", "fee")

    console.log("bookings", walletData);
    

    return res.status(HttpStatus.OK).json({ message: "Wallet data fetched successfully",  walletData: walletData});
  } catch (error: any) {
    console.error("Error fetching Ai chatlist:", error.message);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the wallet data." });
  }
};


export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, role } = req.userData as IUserData;

    // Destructure password and confirmPassword from the request body
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