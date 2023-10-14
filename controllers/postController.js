import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res, next) => {
  try {
    // const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //   folder: "posts"
    // })
    const { caption } = req.body;

    const post = await Post.create({
      caption,
      image: {
        public_id: "myCloud.public_id",
        url: "myCloud.secure_url",
      },
      owner: req.user,
    }).populate("owner likes comments.user");

    //pushing the post into the user data
    const user = await User.findById(req.user);
    user.posts.unshift(post._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Post added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPost = async (req, res, next) => {
  try {
    const post = await Post.find();
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Error in fetching post",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPostbyId = async (req, res) => {
  try {
    const postId = req.params.id;
    let post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPostofFollowings = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    }).populate("owner likes comments.user");

    res.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editPost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    const { caption } = req.body;
    post = await Post.updateOne({ caption });
    res.status(200).json({
      success: true,
      message: "Post updated successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    await post.deleteOne();

    //removing post id from user
    const user = await User.findById(req.user._id);
    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const likes = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }

    let user = await User.findById(req.user._id);

    // Check if the user ID is in the post.likes array
    const isLiked = post.likes.includes(user._id.toString());

    if (isLiked) {
      // User has already liked the post, so remove their ID
      post.likes = post.likes.filter(
        (likedUserId) => likedUserId.toString() !== user._id.toString(),
      );
      post.likesCount--;
    } else {
      // User has not liked the post, so add their ID
      post.likes.unshift(user._id);
      post.likesCount++;
    }

    await post.save();
    res.status(200).json({
      success: true,
      message: isLiked ? "Post unliked" : "Post liked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookmarks = async (req, res, next) => {
  try {
    let bookmarkedPost = await Post.findById(req.params.id);
    if (!bookmarkedPost) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    let user = await User.findById(req.user._id);
    const isBookmarked = user.bookmarks.includes(bookmarkedPost._id.toString());
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((bookmarkedPostid) => {
        bookmarkedPostid.toString() !== user._id.toString();
      });
    } else {
      user.bookmarks.unshift(bookmarkedPost._id);
    }
    await user.save();
    res.status(201).json({
      success: true,
      message: isBookmarked ? "Bookmarked remove" : "Post Bookmarked",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const comments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }

    const { comment } = req.body;

    post.comments.unshift({
      user: req.user._id,
      comment,
    });
    post.commentsCount++;
    await post.save();

    res.status(200).json({
      success: true,
      message: "comment added succesfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    if (post.owner.toString() === req.user._id.toString()) {
      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      res.status(200).json({
        success: true,
        message: "comment deleted successfully",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      res.status(200).json({
        success: true,
        message: "comment deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
