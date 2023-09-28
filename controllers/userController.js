import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/features.js";


export const register = async (req, res, next) => {
  try {
    const { name, userName, phone, email, password } = req.body;
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

    let phoneNumber = await User.findOne({ phone });

    if (phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone Number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      userName,
      phone,
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
    const { loginIdentifier, password } = req.body;

    // Check if the loginIdentifier contains "@" to determine if it's an email
    let user;
    if (loginIdentifier.includes("@")) {
      user = await User.findOne({ email: loginIdentifier }).select("+password");
    } else {
      // Check if it's a valid phone number format (you may need to adjust this regex)
      const phoneRegex = /^\d{10}$/;
      if (phoneRegex.test(loginIdentifier)) {
        user = await User.findOne({ phone: loginIdentifier }).select("+password");
      } else {
        // If it's not an email or phone, assume it's a username
        user = await User.findOne({ userName: loginIdentifier }).select("+password");
      }
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
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
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
    const {name, userName} = req.query
    const queryObject ={}

    if(name) {
      //full search functionality using regex
      queryObject.name =  {$regex: name, $options: "i"}
    }
    if(userName){
      queryObject.userName= {$regex: userName, $options: "i"}
    }

    let apiData = User.find(queryObject)
    let page = req.query.page || 1;
    let limit = req.query.limit || 2;
    
    //pagination formula
    let skip = (page-1) * limit;
    apiData = apiData.skip(skip).limit(limit)


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
      length: users.length
    });
  } catch (error) {
    console.log(error);
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
      })
      .json({
        success: true,
        message: "Logout Successfull",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
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
