  // server.js

  // ✅ Imports
  import express from "express";
  import dotenv from "dotenv";
  import cors from "cors";
  import cookieParser from "cookie-parser";

  // ✅ Custom modules
  import connectDb from "./config/db.js"; // DB connection
  import authRouter from "./routes/auth.routes.js"; // Auth routes
  import userRouter from "./routes/user.routes.js"; // User routes
  import isAuth from "./middleware/isAuth.js"; // Auth middleware

  // ✅ Load environment variables from .env
  dotenv.config();

  // ✅ Initialize Express app
  const app = express();
  const port = process.env.PORT || 8000;

  // ✅ Body parser (parse JSON request body)
  app.use(express.json());

  // ✅ CORS configuration
  app.use(cors({
    origin: "http://localhost:5173", // Frontend URL (Vite dev server default)
    credentials: true, // Allow sending cookies
  }));

  // ✅ Enable cookie parsing
  app.use(cookieParser());


  // ✅ API routes
  app.use("/api/auth", authRouter); // e.g., /api/auth/signup
  app.use("/api/user", userRouter); // e.g., /api/user/update

  // ✅ Public test route
  app.get("/test", (req, res) => {
    res.send("✅ User route working!");
  });

  // ✅ Protected test route using isAuth middleware
  app.get("/api/protected", isAuth, (req, res) => {
    res.json({ message: "Hello, this is protected", user: req.user });
  });

  // ✅ Start server and connect to MongoDB
  app.listen(port, async () => {
    try {
      await connectDb(); // 🔄 Make sure this works
      console.log(`✅ Server started on port ${port}`);
    } catch (error) {
      console.error("❌ Failed to connect to DB:", error);
    }
  });
