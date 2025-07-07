import express from "express";
import { protactRoute } from "../middleware/protactRoute.js";
import {
  getUserProfile,
  
} from "../controllers/user.controller.js";
const router = express.Router();
router.get("/profile:username", protactRoute, getUserProfile);

export default router;
