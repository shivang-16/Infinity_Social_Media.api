import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/features.js";

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
    const user = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
      avatar: { public_id: "sample_id", url: "sample_url" },
    });

    setCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    let user = await User.findOne({ userName }).select("+password");

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
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const { name, description } = req.body;
    user = await User.updateOne({
      name,
      description,
    });
    res.status(200).json({
      success: true,
      message: "User data updated",
    });
  } catch (error) {
    console.log(error);
  }
};

//to get any user profile using its username
export const getUserProfile = async (req, res, next) => {
  try {
    const username = req.params.userName;
    console.log(username);
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//get the profile of logined user
export const getMyProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user);
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
    let users = await User.find();
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No Users found",
      });
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logout = (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logout Successfull",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "user deleted succesfully",
    });
  } catch (error) {
    console.log(error);
  }
};
