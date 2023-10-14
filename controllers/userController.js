import { User } from "../models/userModel.js";
import { Post } from "../models/postModel.js";
import { setCookie } from "../utils/features.js";
import { sendMail } from "../middlewares/sendOtp.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";

let OTP, user;
export const register = async (req, res, next) => {
  try {
    const { name, userName, email, password } = req.body;
    let userEmail = await User.findOne({ email });

    if (userEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    let userWithName = await User.findOne({ userName });

    if (userWithName) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //sending the otp with the help of twilio
    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    await sendMail({
      email,
      subject: "Verification code",
      message: `Your verification code to signup is ${OTP}`,
    });

    // const myCloud = await cloudinary.v2.uploader.upload(req.bosy.avatar, {
    //   folder: "users"
    // })
    //creating user
    user = new User({
      name,
      userName,
      email,
      password: hashedPassword,
      avatar: { public_id: "myCloud.public_id", url: "myCloud.secure_url" },
    });
    res.status(200).json({
      success: true,
      message: `Otp sent to ${email}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (otp != OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }

    //if otp is correct then save the user in database
    user.save();
    setCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Forgot possword
export const forgetPassword = async (req, res, next) => {
  try {
    let email = req.user.email;
    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    await sendMail({
      email,
      subject: "Verification code",
      message: `Your verification code to change password is ${OTP}`,
    });
    res.status(200).json({
      success: true,
      message: `Password recovery otp sent to ${email}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    let { otp, newPassword } = req.body;
    if (otp != OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }
    let user = await User.findById(req.user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login to your account
export const login = async (req, res, next) => {
  try {
    const { loginIdentifier, password } = req.body;

    // Check if the loginIdentifier contains "@" to determine if it's an email
    let user;
    if (loginIdentifier.includes("@")) {
      user = await User.findOne({ email: loginIdentifier }).select("+password");
    } else {
      // If it's not an email, assume it's a username
      user = await User.findOne({ userName: loginIdentifier }).select(
        "+password",
      );
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found - Register first",
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Successful login
    setCookie(user, res, "Login Successfully", 200);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user; // Assuming req.user contains the user's ID
    const { name, about, dob, link, location } = req.body;

    // Find the user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user data
    user.name = name;
    user.description = {
      about,
      dob,
      location,
      link,
    };

    await user.save(); // Save the updated user data

    res.status(200).json({
      success: true,
      message: "User data updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating user data",
    });
  }
};

//get the profile of logined user
export const getMyProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id).populate(
      "posts followers following"
    );
    res.status(200).json({
      success: true,
      message: "Profile fetched",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { name, userName } = req.query;
    const queryObject = {};

    if (name) {
      //full search functionality using regex
      queryObject.name = { $regex: name, $options: "i" };
    }
    if (userName) {
      queryObject.userName = { $regex: userName, $options: "i" };
    }

    let apiData = User.find(queryObject);
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;

    //pagination formula
    let skip = (page - 1) * limit;
    apiData = apiData.skip(skip).limit(limit);

    let users = await apiData.sort("-name");
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No Users found",
      });
    }

    res.status(200).json({
      success: true,
      users,
      length: users.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
      })
      .json({
        success: true,
        message: "Logged out Successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const bookmarks = user.bookmarks;
    const userId = user._id;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    //removing all the users posts
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      await post.deleteOne();
    }

    //removing followers list from user.following
    for (let i = 0; i < followers.length; i++) {
      const follower = await Post.findById(followers[i]);
      const index = follower.following.indexOf(followers[i]);
      follower.following.splice(index, 1);
      await follower.save();
    }

    //removing the user from the followers list of following users
    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);
      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    //removing the bookmarked posts id
    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = await User.findById(bookmarks[i]);
      const index = bookmark.bookmarks.indexOf(bookmarks[i]);
      bookmark.bookmarks.splice(index, 1);
      await bookmark.save();
    }

    //removing all the comments of the user
    const allPost = await Post.find();

    for (let i = 0; i < allPost.length; i++) {
      const post = await Post.findById(allPost[i]._id);
      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === userId) {
          post.comments.splice(j, 1);
        }
      }
      post.save();
    }
    //removing all the likes of the user
    for (let i = 0; i < allPost.length; i++) {
      const post = await Post.findById(allPost[i]._id);
      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1);
        }
      }
      post.save();
    }

    await user.deleteOne();
    res.cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    });

    res.status(200).json({
      success: true,
      message: "user deleted succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserbyID = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user owner",
      );
      posts.push(post);
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all user posts by user id
export const getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user owner",
      );
      posts.push(post);
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
