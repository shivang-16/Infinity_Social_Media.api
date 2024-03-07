import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  refPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  message: String,
  tag: String,
  unread: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
