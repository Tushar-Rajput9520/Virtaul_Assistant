  import React, { useContext, useEffect, useRef, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { userDataContext } from '../context/UserContext';
  import axios from 'axios';
  import { motion, AnimatePresence } from "framer-motion";
  import { HiOutlineMenuAlt3 } from 'react-icons/hi';
  import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
const assistantImages = {
  "image1.png": image1,
  "image2.jpg": image2,
  "authBg.png": image3,
  "image4.png": image4,
  "image5.png": image5,
  "image6.jpeg": image6,
  "image7.jpeg": image7,
};

  function Home() {
    const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [listening, setListening] = useState(false);

    const recognitionRef = useRef(null);
    const isSpeakingRef = useRef(false);
    const isRecognizingRef = useRef(false);
    const isMountedRef = useRef(true);

    const speak = (text) => {
    if (!window.speechSynthesis) {
      console.warn("🛑 Speech synthesis not supported.");
      return;
    }
    try {
      console.log("🗣️ Speaking:", text); // <--- DEBUG
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onerror = (e) => console.error("🛑 Speech synthesis error:", e.error);
      utterance.onend = () => {
        isSpeakingRef.current = false;
        console.log("✅ Speech finished.");
        restartRecognition();
      };
      isSpeakingRef.current = true;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("🛑 Speech synthesis failed:", err);
    }
  };

    const restartRecognition = () => {
      if (
        !isSpeakingRef.current &&
        !isRecognizingRef.current &&
        recognitionRef.current &&
        isMountedRef.current
      ) {
        try {
          recognitionRef.current.start();
          isRecognizingRef.current = true;
          setListening(true);
          console.log("🎤 Recognition restarted");
        } catch (err) {
          if (err.name !== "InvalidStateError") console.error("❌ Restart error:", err);
        }
      }
    };

    const handleCommand = ({ type, userInput, reply }) => {
      console.log("🧠 Command type detected:", type);
      switch (type) {
        case "google-search":
          window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, "_blank");
          break;
        case "youtube_search":
        case "youtube_play":
          window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, "_blank");
          break;
        case "calculator_open":
          window.open("https://www.google.com/search?q=calculator", "_blank");
          break;
        case "instagram_open":
          window.open("https://www.instagram.com/", "_blank");
          break;
        case "facebook_open":
          window.open("https://www.facebook.com/", "_blank");
          break;
        case "youtube_open":
          window.open("https://www.youtube.com/", "_blank");
          break;
        case "whatsapp_open":
          window.open("https://web.whatsapp.com/", "_blank");
          break;
        case "github_open":
          window.open("https://www.github.com/", "_blank");
          break;
        case "general":
        default:
          speak(reply || "Sorry, I didn't get that.");
      }
    };

    const fallbackHandler = (command) => {
      const cmd = command.toLowerCase();
      if (cmd.includes("open youtube")) return { type: "youtube_open", reply: "Opening YouTube" };
      if (cmd.includes("open instagram")) return { type: "instagram_open", reply: "Opening Instagram" };
      if (cmd.includes("search")) return { type: "google-search", reply: "Searching Google" };
      return null;
    };

    const handleLogout = async () => {
      try {
        await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
        localStorage.removeItem('user');
        setUserData(null);
        navigate('/');
      } catch (error) {
        console.log(error);
        setUserData(null);
      }
    };

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await axios.get("/api/user/current", { withCredentials: true });
          setUserData(res.data);
        } catch (err) {
          console.log("❌ Failed to fetch user:", err);
        }
      };
      fetchUser();
    }, []);

    useEffect(() => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("🗣️ User Input:", transcript);

        if (!userData?.assistantName) return;

        const regex = new RegExp(`\\b${userData.assistantName}\\b`, 'i');
        if (regex.test(transcript)) {
          const command = transcript.replace(regex, '').trim();

          const fallback = fallbackHandler(command);
          if (fallback) {
            console.log("🚨 Using fallback command:", fallback);
            speak(fallback.reply);
            handleCommand({ ...fallback, userInput: command });
            return;
          }

          try {
            const response = await getGeminiResponse(command);
            console.log("🤖 Assistant Reply:", response);

            if (!response || !response.type) {
              console.warn("⚠️ Invalid Gemini response. Falling back to speak only.");
              speak(response?.reply || "Sorry, I didn't understand.");
              return;
            }

            handleCommand({ ...response, userInput: command });
          } catch (err) {
            console.error("❌ Error in Gemini response:", err);
            speak("Something went wrong while processing.");
          }
        }
      };

      recognition.onend = () => {
        console.log("🛑 Recognition ended");
        isRecognizingRef.current = false;
        setListening(false);
        if (!isSpeakingRef.current && isMountedRef.current) {
          setTimeout(restartRecognition, 1000);
        }
      };

      recognition.onerror = (event) => {
        console.warn("🎤 Recognition error:", event.error);
        isRecognizingRef.current = false;
        setListening(false);
        if (isMountedRef.current) {
          setTimeout(restartRecognition, 1500);
        }
      };

      return () => recognition.stop();
    }, [userData]);

    const startRecognition = () => {
      if (recognitionRef.current && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognitionRef.current.start();
          isRecognizingRef.current = true;
          setListening(true);
          speak(`${userData?.assistantName || "Jarvis"} activated. How can I help you?`);
          console.log("🎤 Recognition manually started");
        } catch (err) {
          if (err.name !== "InvalidStateError") console.error("❌ Start error:", err);
        }
      }
    };

    return (
      <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] relative overflow-hidden">
        <motion.button
          className="absolute top-[20px] right-[20px] text-white text-[30px] z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <HiOutlineMenuAlt3 />
        </motion.button>

        {menuOpen && (
          <motion.div
            className="absolute top-[70px] right-[20px] flex flex-col gap-4 z-40"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <button
              onClick={handleLogout}
              className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md"
            >
              🚪 Log Out
            </button>
            <button
              onClick={() => navigate('/customize')}
              className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md"
            >
              🎨 Customize Assistant
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-[300px] h-[400px] mt-[20px] overflow-hidden rounded-4xl shadow-lg"
        >
          {console.log("🖼️ assistantImg path:", userData?.assistantImage)}

  <div className="w-[300px] h-[300px] rounded-full overflow-hidden border-4 border-white shadow-xl">
    <img
      src={
        assistantImages[
          userData?.assistantImage?.split("/").pop()
        ] || assistantImages["authBg.png"]
      }
      alt="Assistant"
      className="w-full h-full object-cover"
    />
  </div>
\









        </motion.div>

        <motion.h1
          className="text-white text-[22px] font-semibold mt-[20px]"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          I am <span className="text-blue-300">{userData?.assistantName || "Unknown"}</span>
        </motion.h1>

        <AnimatePresence>
          {!listening && (
            <motion.button
              onClick={startRecognition}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="mt-8 px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-500 text-xl font-semibold rounded-full shadow-lg hover:bg-purple-500 hover:text-white"
              style={{
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                boxShadow: "0 0 15px rgba(168, 85, 247, 0.7)",
              }}
            >
              ✨ Activate {userData?.assistantName || "Jarvis"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }

  export default Home; 