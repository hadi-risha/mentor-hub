import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
    studentId: Types.ObjectId; 
    sessionId: Types.ObjectId; 
    instructorId: Types.ObjectId; 
    date: string; 
    timeSlot: string; 
    concerns?: string;
    status: "booked" | "completed" | "cancelled"; 
    bookedAt: Date; 
    stripePaymentCheckoutSessionId: string;  
    meetingRoomId: string; 
}

const bookingSchema: Schema<IBooking> = new mongoose.Schema(
  {
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: "Session", // Reference to the Session collection
        required: true,
    },
    instructorId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the instructor in the User collection
        required: true,
    },
    date: {
        type: String, // Store the selected date (e.g., "2024-11-20")
        required: true,
    },
    timeSlot: {
        type: String, // Store the selected time slot (e.g., "10:00 AM - 11:00 AM")
        required: true,
    },
    concerns: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["booked", "completed", "cancelled"],
        default: "booked",
        required: true,
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },
    stripePaymentCheckoutSessionId: {
        type: String, 
        required: true,
    },
    meetingRoomId: { 
        type: String, 
        required: true 
    }
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model<IBooking>("Booking", bookingSchema);
