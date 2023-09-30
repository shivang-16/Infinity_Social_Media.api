import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
export const createPost = async (req, res, next) => {
  try {
    const { caption } = req.body;

    const post = await Post.create({
      caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: req.user,
    });

    //pushing the post into the user data
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
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
      message: "Internal Server Error",
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
    console.log(error)
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
    } else {
      // User has not liked the post, so add their ID
      post.likes.push(user._id);
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


export const bookmarks = async(req, res, next)=>{
  try {
    let bookmarkedPost = await Post.findById(req.params.id);
    if(!bookmarkedPost){
      return res.status(400).json({
        success: false,
        message: "Invalid request"
      })
    }

    let user = await User.findById(req.user._id)
    const isBookmarked = user.bookmarks.includes(bookmarkedPost._id.toString())
    if(isBookmarked){
       user.bookmarks = user.bookmarks.filter((bookmarkedPostid)=>{
              bookmarkedPostid.toString() !== user._id.toString();
       })
    }
    else{
      user.bookmarks.push(bookmarkedPost._id)
    }
    await user.save()
    res.status(201).json({
      success: true,
      message: isBookmarked ? "Bookmarked remove" : "Post Bookmarked"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

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

    post.comments.push({
      user: req.user._id,
      comment,
    });

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
    const comment = await Post.comments.findById(req.param.id)
    console.log(comment)
    if(!comment){
      return res.status(400).json({
        success: false,
        message: "Invalid request"
      })
    }
    
    comment.deleteOne()
    await comment.save()
    res.status(200).json({
      success: true,
      message: "comment deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    }) 
  }
};
