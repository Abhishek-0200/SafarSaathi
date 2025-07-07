import express from "express";
import { signUp, login, logout } from "../controllers/auth.controller.js";
import { protactRoute } from "../middleware/protactRoute.js";
import { getMe } from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/me", protactRoute, getMe);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

//
// 14.139.239.210

export default router;
