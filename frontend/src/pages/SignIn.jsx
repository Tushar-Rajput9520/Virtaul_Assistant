import React, { useState, useContext } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import bg from "../assets/authBg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(userDataContext); // ✅ Pull setUserData from context

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      console.log("Login Success:", result.data);

      // ✅ Set user data to global context
      setUserData(result.data);

      // ✅ Redirect
      navigate("");
    } catch (error) {
      const err = error.response?.data?.message || "Something went wrong";
      setErrorMsg(err);
      console.log("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[500px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]"
        onSubmit={handleSignin}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Welcome back to{" "}
          <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {errorMsg && (
          <p className="text-red-400 text-[16px] mt-[-10px] -mb-[10px]">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p
          className="text-[white] text-[18px] cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account?{" "}
          <span className="text-blue-400 cursor-pointer">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
