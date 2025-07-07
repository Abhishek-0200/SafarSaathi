import User from "../models/user.model.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import generateTokenAndSetCookie from "../lib/utils/generateTokenAndCookie.js";
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, username } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exist",
      });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email already taken",
      });
    }
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashPass = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName: fullName,
      username: username,
      email: email,
      password: hashPass,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res); // this is a middleware to generate token and set cookies
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
      });
    } else {
      res.status(400).json({
        error: "Invalid User data",
      });
    }
  } catch (error) {
    console.log(`there is an error in signUp method ${error.message}`);
    res.status(500).json({
      error: "Internal Server error ",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const user = await User.findOne({ username });
    if(!user)
      return res.status(400).json({
    error: "Please provide a valid username "})
    const isCorrectPass = await bcrypt.compare(password, user.password || "");
    console.log(isCorrectPass)
    // console.log(user, isCorrectPass)
    if (!user || !isCorrectPass) {
      return  res.status(400).json({
        error: "invalid username or password",
      });
    }
    // console.log(user, password)
    generateTokenAndSetCookie(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullname: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
    });
  } catch (error) {
    console.log(`there is an error in Login method ${error}`);
    res.status(500).json({
      error: "Internal Server error ",
    });
    throw error;
  }
};

export const logout = async (req, res) => {
  try {
    const cookie = req.cookies.jwt;
    if(!cookie){
      console.log("Pehle se logged out hai ")
      return null
    }
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(201).json({
      data: "Logged out successfully",
    });
  } catch (error) {
    console.log(`there is an error in Logout method ${error.message}`);
    res.status(500).json({
      error: "Internal Server error ",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
   return  res.status(201).json(user);
  } catch (error) {
    console.log(`error at the getMe controller : ${error.message}`);
    res.status(500).json({
      error: "internal server error",
    });
  }
};
