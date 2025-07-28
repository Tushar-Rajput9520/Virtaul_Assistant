  import express from "express";
  import {
    logout,
    signUp,
    login,
    
  } from "../controllers/auth.controller.js";
  import isAuth from "../middleware/isAuth.js";

  const authRouter = express.Router();

  authRouter.post("/signup", signUp);
  authRouter.post("/signin", login);
  authRouter.get("/logout", logout);

  // ✅ Secure route to get logged-in user
  // authRouter.get("/user/current", isAuth, getCurrentUser);

  export default authRouter;
