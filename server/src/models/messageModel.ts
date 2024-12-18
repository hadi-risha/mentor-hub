import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    _id: mongoose.Types.ObjectId; // Ensure _id is explicitly included
    senderId: string; 
    receiverId: string; 
    content: string;
    reactions: { userId: string; type: string }[];
    seen: boolean;
    timestamp: Date;
}

const MessageSchema: Schema = new Schema({
    senderId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiverId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    reactions: [
        {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        type: { type: String }, // e.g., 'like', 'love', etc.
        },
    ],
    seen: { 
        type: Boolean, 
        default: false 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
