import express from "express";
import { protactRoute } from "../middleware/protactRoute.js";
import {
  addBus,
  getAllBus ,
  searchBus
} from "../controllers/bus.controller.js";

const router = express.Router();
router.get("/all", protactRoute, getAllBus);
router.post("/add" , protactRoute , addBus);
router.post("/search" , protactRoute , searchBus);

export default router;
