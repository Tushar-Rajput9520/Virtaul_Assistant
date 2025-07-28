import jwt from "jsonwebtoken";

// Synchronous version is better for token generation (since jwt.sign is sync by default)
const genToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (err) {
    console.error("Error generating token:", err.message);
    return null; // Make sure to handle this in calling functions
  }
};

export default genToken;
