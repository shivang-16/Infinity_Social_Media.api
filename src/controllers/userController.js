import { User } from "../models/userModel.js";
import { Post } from "../models/postModel.js";
import { setCookie } from "../utils/features.js";
import { sendMail } from "../middlewares/sendOtp.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";

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

    user = new User({
      name,
      userName,
      email,
      password: hashedPassword,
      avatar: {
        public_id: "",
        url: "https://res.cloudinary.com/ddszevvis/image/upload/v1697807048/avatars/Default_Image_oz0haa.png",
      },
    });
    res.status(200).json({
      success: true,
      message: `Otp sent to your email`,
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
    let email = req.body.email;
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
      message: `Otp sent to your email`,
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
    let { otp, newPassword, userName } = req.body;
    if (otp != OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }
    let user = await User.findOne({ userName });
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

    // Find the user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.about || req.body.dob || req.body.location || req.body.link) {
      user.description = {
        about: req.body.about || "",
        dob: req.body.dob || "",
        location: req.body.location || "",
        link: req.body.link || "",
      };
    } else {
      // If no description data is provided in req.body, remove the description
      user.description = {
        about: "",
        dob: "",
        location: "",
        link: "",
      };
    }

    const file = req.file;
    if (file) {
      // Destroy the existing avatar on Cloudinary if it exists
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }

      const fileUri = getDataUri(file);

      // Upload the new avatar to Cloudinary
      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
        folder: "avatars",
      });

      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User data updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let responseMessage = ""; // Variable to hold the response message

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      responseMessage = "Avatar deleted";
    } else {
      responseMessage = "Avatar not found";
    }

    user.avatar = {
      public_id: "",
      url: "https://res.cloudinary.com/ddszevvis/image/upload/v1697807048/avatars/Default_Image_oz0haa.png",
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: responseMessage, // Send the response message here
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get the profile of logined user
export const getMyProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id).populate(
      "posts followers following bookmarks",
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
      queryObject.userName = userName;
    }

    let apiData = User.find(queryObject).populate(
      "posts followers following bookmarks",
    );
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

export const getAllSearched = async (req, res) => {
  try {
    const { name, userName } = req.query;
    const queryObject = {};

    if (name) {
      //full search functionality using regex
      queryObject.name = { $regex: name, $options: "i" };
    }
    if (userName) {
      queryObject.name = { $regex: userName, $options: "i" };
    }

    let apiData = User.find(queryObject).populate(
      "posts followers following bookmarks",
    );

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

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logged out Successfully",
    });
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const bookmarks = user.bookmarks;
    const userId = user._id;

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    await user.deleteOne();
    res.cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    });

    // Removing all the user's posts
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      if (post) {
        if (post.image && post.image.public_id) {
          await cloudinary.v2.uploader.destroy(post.image.public_id);
        }

        await post.deleteOne();
      }
    }

    // Removing followers list from user.following
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);
      if (follower) {
        const index = follower.following.indexOf(userId);
        if (index !== -1) {
          follower.following.splice(index, 1);
          await follower.save();
        }
      }
    }

    // Removing the user from the followers list of following users
    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);
      if (follows) {
        const index = follows.followers.indexOf(userId);
        if (index !== -1) {
          follows.followers.splice(index, 1);
          await follows.save();
        }
      }
    }

    // Removing the bookmarked posts id
    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = await Post.findById(bookmarks[i]);
      if (bookmark) {
        const index = bookmark.bookmarks.indexOf(userId);
        if (index !== -1) {
          bookmark.bookmarks.splice(index, 1);
          await bookmark.save();
        }
      }
    }

    // Removing all the comments of the user
    const allPosts = await Post.find();

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);
      for (let j = post.comments.length - 1; j >= 0; j--) {
        if (post.comments[j].user.toString() === userId.toString()) {
          post.comments.splice(j, 1);
        }
      }
      await post.save();
    }

    // Removing all the likes of the user
    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      if (post.likes.some((like) => like.toString() === userId)) {
        // Filter out the like with the given userId from the likes array
        post.likes = post.likes.filter(
          (likeId) => likeId.toString() !== userId,
        );
        await post.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Your account deleted",
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
    const user = await User.findById(userId).populate(
      "posts followers following bookmarks",
    );

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

export const getMyBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const posts = [];

    for (let i = 0; i < user.bookmarks.length; i++) {
      const bookmark = await Post.findById(user.bookmarks[i]).populate(
        "likes comments.user owner",
      );
      posts.push(bookmark);
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
