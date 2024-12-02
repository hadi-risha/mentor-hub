import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  // recipients: mongoose.Types.ObjectId[]; // List of user IDs
  // isRead: boolean;
}

const notificationSchema: Schema<INotification> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    // recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema);
