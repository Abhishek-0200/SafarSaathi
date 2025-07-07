import User from "../models/user.model.js";
import Bus from "../models/bus.model.js"
import { v2 as cloudinary } from "cloudinary";

export const addBus = async (req, res) => {
  try {
    console.log("entered");
    const {busName , route ,startingTime , departureTime, 
      duration, fare, driverDetails
    } = req.body;
   const userId = req.user._id.toString();
    console.log("check 1 ");
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        error: "User Not Found",
      });
    console.log(`check 2 ${userId} , ${busName} `);
    const newBus = new Bus({
      busName: busName ,
      route: route, 
      startingTime : startingTime, 
      departureTime : departureTime, 
      duration : duration,
      fare : fare,
      driverDetails: driverDetails
    });
    await newBus.save();

    return res.status(201).json({
      success: newBus,
    });
  } catch (error) {
    console.log(`Error in creating a post ${error.message}`);
    return res.status(500).json({
      error: "Internal server error ",
    });
  }
};


export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = id.substring(1);
    const post = await Post.findById({ _id: postId });
    if (!post)
      return res.status(404).json({
        error: "Post Not Found",
      });
    if (post.postedBy.toString() !== req.user._id.toString())
      return res.status(400).json({
        error: "You are not authorized to delete this post ",
      });

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);

    return res.status(201).json({
      success: "Post deleted successfully.",
    });
  } catch (error) {
    console.log(`there is some error while deleting post : ${error.message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllBus = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 }).populate({
      path: "route",
    });
    if (buses.length === 0) {
      return res.status(201).json({
        data : []
      });
    }
    return res.status(201).json(buses);
  } catch (error) {
    console.log(
      `there is some error while fetching all buses : ${error.message}`
    );
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const searchBus = async (req, res) => {
  try {
    const {startPoint , endPoint } = req.body;
    if(!startPoint || !endPoint)
      
      res.status(401).json({
    message:" dono point de naa bhai.. "})
    console.log(startPoint , endPoint)
    const buses = await Bus.find({
      "route.startPoint" : startPoint, 
      "route.endPoint" : endPoint
    })
    console.log(buses)
    return res.status(200).json(buses)
  } catch (error) {
    res.status(501).json({
      message: error.message
    })
  }
}