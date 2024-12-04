import mongoose, { Document, Schema } from "mongoose";

export interface IRating extends Document {
  ratedBy: mongoose.Types.ObjectId; // Student who rates
  ratedUser: mongoose.Types.ObjectId; // Instructor who is being rated
  rating: "poor" | "good" | "excellent"; // Rating type if using predefined options
  feedback?: string; // Optional feedback from student
  sessionId: mongoose.Types.ObjectId; // Reference to the session (if applicable)
}

const ratingSchema: Schema<IRating> = new mongoose.Schema(
  {
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ratedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: String, enum: ["poor", "good", "excellent"], required: false }, // Changed to required if necessary
    feedback: { type: String, required: false },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true }, // If you have a session model
  },
  { timestamps: true }
);

export const RatingModel = mongoose.model<IRating>("Rating", ratingSchema);
