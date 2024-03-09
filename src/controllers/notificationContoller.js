import { Notification } from "../models/notificationModel.js";

export const listAllNotification = async (req, res) => {
  try {
    const { status } = req.query;
    const queryObject = { receiver: req.user._id, sender: { $ne: req.user._id } };

    if (status) {
      queryObject.unread = status;
    }

    const notifications = await Notification.find(queryObject)
      .populate("receiver sender refPost")
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changeReadStatus = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    //   if(notification.unread === false) { return res.status(400).json({message: "Bad request"})  }

    await notification.updateOne({
      unread: false,
    });

    res.status(200).json({
      success: true,
      message: "Read Status Changed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
