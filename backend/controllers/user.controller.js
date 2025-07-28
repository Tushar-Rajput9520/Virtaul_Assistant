import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

// ✅ Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Current user fetched:", user.name);
    return res.status(200).json(user);
  } catch (err) {
    console.error("❌ getCurrentUser error:", err.message);
    return res.status(500).json({ message: "Failed to fetch current user", error: err.message });
  }
};

// ✅ Update Assistant (Name + Image)
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName } = req.body;
    let assistantImage = req.body.assistantImage; // default (in case no file is uploaded)

    // ✅ Upload image if user sent a file
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found for update" });
    }

    console.log("✅ Assistant updated:", user.assistantName);
    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ Update Assistant Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Ask Assistant using Gemini
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ response: "User not found." });
    }

    const assistantName = user.assistantName || "Assistant";
    const userName = user.name || "User";

    const result = await geminiResponse(command, assistantName, userName);

    // Extract only JSON part from Gemini's response
    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand the response." });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const { type, userInput, response: gemResponse } = gemResult;

    const time = moment();

    switch (type) {
      case "get_day":
        return res.status(200).json({
          type,
          userInput,
          response: `Today is ${time.format("dddd")}`,
        });

      case "get_month":
        return res.status(200).json({
          type,
          userInput,
          response: `It's ${time.format("MMMM")} now.`,
        });

      case "get_date":
        return res.status(200).json({
          type,
          userInput,
          response: `Today's date is ${time.format("LL")}`,
        });

      case "get_time":
        return res.status(200).json({
          type,
          userInput,
          response: `Current time is ${time.format("hh:mm A")}`,
        });

      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
      case "youtube_play":
      case "youtube_search":
      case "google_search":
      case "general":
        return res.status(200).json({
          type,
          userInput,
          response: gemResponse,
        });

      default:
        return res.status(400).json({ response: "Unknown command type." });
    }
  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    return res.status(500).json({ response: "Internal server error", error: error.message });
  }
};