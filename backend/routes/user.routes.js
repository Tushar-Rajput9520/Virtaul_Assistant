// routes/user.routes.js
import { getCurrentUser } from "../controllers/user.controller.js";
import express from "express"; 
const userRouter = express.Router();

import {
  askToAssistant,
  updateAssistant,
  // getCurrentUser, // You can uncomment if needed
} from "../controllers/user.controller.js";

import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

// ✅ Test route
userRouter.get("/test", (req, res) => {
  res.send("✅ User route working!");
});

// ✅ Get current user (optional)
userRouter.get("/current", isAuth, getCurrentUser);


// ✅ Ask AI Assistant
userRouter.post("/asktoassistent", isAuth, askToAssistant);

// ✅ Update assistant (with optional image upload)
userRouter.put(
  "/update",
  isAuth,
  upload.single("assistantImage"),
  (req, res, next) => {
    console.log("✅ /update route hit");
    next();
  },
  updateAssistant
);

userRouter.get("/test", (req, res) => {
  res.send("✅ User route working!");
});

export default userRouter;
