import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  image: {
    public_id: String,
    url: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      comment: {
        type: String,
        // required: true,
      },
    },
  ],
  likesCount: {
    type: Number,
    default: 0, // Default to 0 when a new post is created
  },
  commentsCount: {
    type: Number,
    default: 0, // Default to 0 when a new post is created
  },
});

export const Post = mongoose.model("Post", postSchema);
