import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { uploadImageToS3 } from '../utils/s3Service';
import config from '../config/config'
import { HttpStatus } from '../utils/httpStatusCodes';
import { log } from 'winston';
import { IBooking } from '../models/bookingModel';
import mongoose from "mongoose"; // Ensure mongoose is imported


import Stripe from 'stripe';
const stripe = new Stripe(config.stripeSecretKey as string, {});



const userService = new UserService();

/* STUDENT HOME */
// export const studentHome = async (req: Request, res: Response): Promise<Response> => {
//     console.log("req.headers in student home page" , req.headers);
//     console.log("req.userData", req.userData);
    
//     if (req.userData && typeof req.userData === 'object' && 'id' in req.userData) {
//         const id = (req.userData as { id: string }).id; 
//         console.log("id", id);
        
//         try {
//             const user = await userService.findUserById(id);
//             console.log(user);
//             return res.json({message: "user data", user });
//         } catch (error) {
//             return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user' });
//         }
//     }

//     return res.status(HttpStatus.OK).json({ message: "Welcome to the Student Home Page", userData: req.userData });
// };


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
  console.log("in update profile page*******************************************************************************************");

  const { firstName, lastName, about, country, education, imageStatus } = req.body;

  console.log("imageStatus.....................>>   ", imageStatus);
  
  
  try {
    let token = req.header("Authorization"); 
    console.log("token in student update profile", token);

    const {id, role} = req.userData as IUserData;
    console.log("id, role", id, role);
    
    // console.log("req.userData " , req.userData);
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

    console.log("image from frontend -------------- key : ", profilePicFile);
    console.log("already exist image............from backend db        " , existingProfile?.image);



    // upload the profile picture to S3 if provided
    let profilePicUrl = '';
    if (profilePicFile && updateProfilePic) {
      console.log("profile pic changed");
      
      // profilePicUrl = await uploadImageToS3(profilePicFile);
      const { url: profilePicUrl, key: profilePicKey } = await uploadImageToS3(profilePicFile);

      
      existingProfile.image = {
        url: profilePicUrl,
        key: profilePicKey,
      };
      console.log("student profile uploaded in s3-----------------------==", profilePicUrl);
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
        // No action needed; existing image values remain
        console.log("No action needed, existing image values remain");
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

      
      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        // profilePicUrl: user.profilePic ? `https://${config.awsBucketName}.s3.${config.awsRegion}.amazonaws.com/profile-pics/${user.profilePic}` : null,
        profilePicUrl: user.image?.url ? user.image?.url : null,
        profilePicKey: user.image?.key ? user.image?.key : null,


        country: user.country,
        education: user.education,
        about: user.about,
      };

      console.log("userData:", userData);
      

      return res.status(HttpStatus.OK).json({ message: "User profile fetched successfully",
        //  data: userData 
        //  data: {
        //   ...userData
        // }

        ...userData
      
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the profile" });
    }

};




export const createBooking = async (req: Request, res: Response): Promise<Response> => {
  // const { sessionId, date, timeSlot } = req.body;


  const { sessionId, selectedDate, selectedTimeSlot, concerns} =req.body;
  console.log("sessionId, selectedDate, selectedTimeSlot, concerns", sessionId, selectedDate, selectedTimeSlot, concerns);
  

  try {
    const {id, role} = req.userData as IUserData;  //student id
    console.log("id, role", id, role);

    // Fetch the session to get the instructorId
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

export const stripePayment = async (req: Request, res: Response): Promise<Response> => {

  const { sessionId, selectedDate, selectedTimeSlot, concerns} =req.body;
  const { amount } = req.body; // Dynamic amount from the frontend


  console.log("sessionId, selectedDate, selectedTimeSlot, concerns!!!!!!!!!!!!!!!", sessionId, selectedDate, selectedTimeSlot, concerns);

  console.log(amount);

  let token = req.header("Authorization"); 
  console.log("token in student payment", token);

  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);
  
  
  try {
    const session = await stripe.checkout.sessions.create({
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
      success_url: `${config.frontendUrl}/student/payment-succes`, // Success page URL
      // success_url: `${config.frontendUrl}/student/payment-success?sessionId=${sessionId}&selectedDate=${selectedDate}&selectedTimeSlot=${selectedTimeSlot}&concerns=${concerns}`,
      cancel_url: `${config.frontendUrl}/student/payment-cancel`,   // Cancel page URL


  });

    // return res.json({ url: session.url });

    return res.status(HttpStatus.OK).json({ message: "Paymnet successfull", url: session.url });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error creating booking:" });
  }

}



export const switchUserRole = async (req: Request, res: Response): Promise<Response> => {
  // const { userId } = req.body;


  let token = req.header("Authorization"); 
  console.log("token in student payment", token);

  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);


  const newRole = 'instructor'

  try {
    const updatedUser = await userService.switchUserRole(id, newRole)
    console.log("updatedUser-----------", updatedUser);
    
    return res.status(HttpStatus.CREATED).json({ message: "User role updated successfully", ...updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error updating user role:" });
  }

}

export const bookedSessions = async (req: Request, res: Response): Promise<Response> => {
  // const { userId } = req.body;


  let token = req.header("Authorization"); 
  console.log("token in student payment", token);

  const {id, role} = req.userData as IUserData;
  console.log("id, role", id, role);



  try {
    // const updatedUser = await userService.switchUserRole(id, newRole)
    const bookedSessions = await userService.bookedSessions(id)
    console.log("Booked sessions-----------", bookedSessions);
    
    return res.status(HttpStatus.OK).json({ message: "Booked sessions fetched successfully", ...bookedSessions });
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching booked sessions:" });
  }

}