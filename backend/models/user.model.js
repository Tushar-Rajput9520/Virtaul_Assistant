import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Don't return password by default
    },
    assistantName: {
      type: String,
    },
    assistantImage: {
      type: String,
    },
    history: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ Custom instance method to compare hashed passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
