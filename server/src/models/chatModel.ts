import mongoose, { Schema } from "mongoose";

export interface IChat extends Document {
    _id: string;
    usersId: string[]; // userIds of participants
    messageIds: string[]; // All message IDs in the chat
    lastMessageId: string; // messageId of the last message
    unreadCounts: { userId: string; count: number }[]; // Unread messages count per user
  }
  
  const ChatSchema: Schema = new Schema({
    usersId: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    messageIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Message",
        },
    ],
    lastMessageId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Message' 
    },
    unreadCounts: [
      {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User' 
        },
        count: { 
            type: Number, 
            default: 0 
        },
      },
    ],
  });
  
  export const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);
  