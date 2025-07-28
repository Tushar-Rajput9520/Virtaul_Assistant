// src/context/UserContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "https://virtaul-assistant-back.onrender.com";
axios.defaults.withCredentials = true; // ✅ Always send cookies

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const serverUrl = "https://virtaul-assistant-back.onrender.com";

  // ✅ Fetch current user on mount
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true, // 🛠️ Important for cookie-based auth
      });
      console.log(result.data);
      setUserData(result.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // 🛠️ Ensures loading state is updated
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  // Gemini API call
  const getGeminiResponse = async (command) => {
    if (!command) return null;

    try {
      const res = await axios.post(
        "/api/user/asktoassistent",
        { command },
        { withCredentials: true } // 🛠️ Again, for session auth
      );
      const reply = res.data?.reply || res.data?.response || "No response";
      const type = res.data?.type || "text";
      return { reply, type };
    } catch (err) {
      console.error("❌ Gemini error:", err.response?.data || err.message);
      return {
        reply: "Something went wrong. Please try again.",
        type: "error",
      };
    }
  };

  const value = {
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    loading,
    serverUrl,
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
