import jwt from "jsonwebtoken";

export const setCookie = async (user, res, message, statusCode) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  await res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 31536000,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message,
    });
};
