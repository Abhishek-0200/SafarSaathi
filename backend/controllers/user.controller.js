import User from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  let name = username.substring(1);
  try {
    const user = await User.findOne({ username: name }).select("-password");
    console.log(user);
    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }
    res.status(201).json({
      data: user,
    });
  } catch (error) {
    console.log(`Error in getUserProfile : ${error.message}`);
    return res.status(500).json({
      error: error.message,
    });
  }
};


export const updateProfile = async (req, res) => {
  const { fullName, username, email, currentPass, newPass, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  console.log("check1", fullName, username, email, currentPass, newPass);
  try {
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        error: "User Not Found",
      });
    console.log("check2");
    if ((!newPass && currentPass) || (!currentPass && newPass)) {
      console.log("checking the both passwords are provided");
      return res.status(400).json({
        error: "Please provide both current and new passwords",
      });
    }
    console.log("check 3");
    if (newPass && currentPass) {
      console.log("checking in securing phase");
      const isMatch = await bcrypt.compare(currentPass, user.password);
      console.log(isMatch);
      if (!isMatch)
        return res.status(400).json({
          error: "The current password not matched.",
        });
      console.log("check 4");
      if (newPass.length < 6)
        return res.status(400).json({
          error: "new Password must be greater than 6 characters",
        });
      console.log("check 5");
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPass, salt);
    }
    if (profileImg) {
      if (user.profileImage) {
        await cloudinary.uploader.destroy(
          user.profileImage.split("/").pop().split(".")[0]
        );
      }
      const uploadedProfile = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedProfile.secure_url;
    }
    console.log("check 6");
    if (coverImg) {
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }

      const uploadedCover = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedCover.secure_url;
    }
    console.log("check 7");
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.password = newPass || user.password;
    user.link = link || user.link;
    user.profileImage = profileImg || user.profileImage;
    user.coverImage = coverImg || user.coverImage;
    user = await user.save();
    console.log("check 8");
    user.password = null;
    return res.status(200).json({
      updatedUser: user,
    });
  } catch (error) {
    res.status(500).json({
      error: `got some error in update : ${error.message}`,
    });
  }
};
