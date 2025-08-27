import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Chat ||
  mongoose.model<IChat>("Chat", ChatSchema);
