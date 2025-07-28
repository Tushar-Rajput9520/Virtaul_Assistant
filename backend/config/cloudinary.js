import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

// ✅ Load the .env file
dotenv.config();  // <-- THIS WAS MISSING


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // Remove local file after upload
    fs.unlinkSync(localFilePath);

    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove if error
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
};
