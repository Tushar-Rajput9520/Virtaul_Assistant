import React, { useContext, useRef } from "react";
import axios from "axios";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function Customize() {
  const {
    setFrontendImage,
    frontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const inputImage = useRef();
  const navigate = useNavigate();

  // ✅ Handle custom image upload
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_upload"); // ✅ This matches your Cloudinary preset

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dhwp7coec/image/upload", // ✅ Your Cloud name
      formData
    );

    const imageUrl = res.data.secure_url;
    console.log("✅ Uploaded Image URL:", imageUrl);

    setFrontendImage(imageUrl);         // ✅ Save in context
    setSelectedImage("input");          // ✅ Mark as selected
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    alert("Image upload failed. Please try again.");
  }
};



  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
      {/* Back Button */}
      <IoMdArrowRoundBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <h1 className="text-white text-[30px] mb-[40px] text-center">
        Select your <span className="text-blue-200">Assistant Image</span>
      </h1>

      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[15px]">
        {/* Predefined Cards */}
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

       

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImageChange}
        />
      </div>

      {/* Next Button */}
      {selectedImage && (
        <button
          className="min-w-[150px] mt-[20px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer hover:border-4 hover:border-black"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;
