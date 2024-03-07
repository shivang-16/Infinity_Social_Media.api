import { Notification } from "../models/notificationModel.js";
import { User } from "../models/userModel.js";

export const follow = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = await User.findById(req.user._id);

    //checking such that user and cannot follow themselves
    if (userToFollow._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }

    let notification;
    // Check if the user is already in the following list
    const isFollowing = user.following.includes(userToFollow._id);

    if (isFollowing) {
      // User is already following, so unfollow
      user.following = user.following.filter(
        (followedUser) =>
          followedUser.toString() !== userToFollow._id.toString(),
      );

      //if user is already in followers list ,the remove
      userToFollow.followers = userToFollow.followers.filter(
        (followingUser) => followingUser.toString() !== user._id.toString(),
      );
    } else {
      // User is not following, so follow
      user.following.push(userToFollow._id);

      //push the current user data to the followers list of the user which i followed
      userToFollow.followers.push(user._id);

      notification = await Notification.create({
        receiver: userToFollow,
        sender: req.user,
        tag: "Follow",
        message: "Followed you",
      });
    }

    await user.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
