import jwt from "jsonwebtoken";

export const setCookie = async (user, res, message, statusCode) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  await res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    })
    .json({
      success: true,
      message,
    });
};
