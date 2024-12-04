import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { uploadImageToS3 } from '../utils/s3Service';
import config from '../config/config'
import { HttpStatus } from '../utils/httpStatusCodes';
import { log } from 'winston';
import { IBooking } from '../models/bookingModel';
import mongoose from "mongoose"; 
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';




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

// export const stripePayment = async (req: Request, res: Response): Promise<Response> => {
//   let token = req.header("Authorization"); 
//   const {id, role} = req.userData as IUserData;
//   console.log("id, role", id, role);
//   console.log("token in student payment", token);

//   const { sessionId, selectedDate, selectedTimeSlot, concerns, amount } =req.body;
//   console.log("sessionId, selectedDate, selectedTimeSlot, concerns", sessionId, selectedDate, selectedTimeSlot, concerns);
//   console.log("amount",amount);
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//           {
//             price_data: {
//                 currency: 'usd',
//                 product_data: {
//                     name: 'Session Booking', // Static product name
//                 },
//                 unit_amount: amount, // Amount in cents
//             },
//             quantity: 1,
//           },
//       ],
//       mode: 'payment',
//       success_url: `${config.frontendUrl}/student/payment-succes`, // Success page URL
//       cancel_url: `${config.frontendUrl}/student/payment-cancel`,   // Cancel page URL
//     });

//     return res.status(HttpStatus.OK).json({ message: "Payment successfull", url: session.url });
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error creating booking:" });
//   }
// }


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
    // const bookedSessions = await userService.bookedSessions(id)

    
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


    // const { bookingId } = req.body;

    const { sessionId, bookingId, rating, feedback } = req.body;
    console.log("bookingId......hh.........", bookingId);
    
    log
    // Validate rating options
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