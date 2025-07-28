import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

function Customize2() {
  const serverUrl = "http://localhost:8000";
  const { userData, setUserData, backendImage, selectedImage } = useContext(userDataContext);

  const [assistantName, setAssistantName] = useState("");
  const navigate = useNavigate();

  // Clear previous name when you enter this page
  useEffect(() => {
    setAssistantName(""); // Reset name when component mounts
  }, []);

  const handleUpdateAssistant = async () => {
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);
      console.log("Saving image: ", backendImage || selectedImage);


      // Append the image
      if (backendImage) {
        formData.append("assistantImage", backendImage); // handled by multer and Cloudinary
      } else {
        formData.append("imageUrl", selectedImage.split("/").pop()); // just the filename like "image2.jpg"
 // just a URL string
      }

      const result = await axios.put(
        `${serverUrl}/api/user/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("✅ Assistant Updated:", result.data);
      setUserData(result.data);
      navigate("/"); // ✅ Go to homepage after update
    } catch (error) {
      console.error("❌ Failed to update assistant:", error);
    }
  };

  return (

    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#0f3035] flex justify-center items-center flex-col p-[20px]">
      <IoMdArrowRoundBack
              className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
              onClick={() => navigate("/")}
            />
      <h1 className="text-white mb-[40px] text-[30px] text-center">
        Enter Your <span className="text-blue-200">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="eg. shifra"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[19px]"
          onClick={handleUpdateAssistant}
        >
          Finally Create Your Assistant
        </button>
      )}
    </div>
  );
}

export default Customize2;
