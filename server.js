import express from "express";
const app = express();
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connnetMongoDb from "./db/connectMongoDb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import { v2 as cloudinary } from "cloudinary";
import busRoutes from "./routes/bus.route.js"
// import postRoutes from "./routes/post.route.js";
// import notificationRoutes from "./routes/notification.route.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse form data ( urlencoded )
app.use(cookieParser()); // for the cookie parser to implement the concep of token
dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bus", busRoutes);

app.get("/", (req, res) => {
  res.send("Hello buddy its me!!");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server started at ${port}`);
  connnetMongoDb(process.env.MONGO_URI);
});
