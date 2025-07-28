// ✅ Make this a default export
import React, { useContext } from 'react';
import { userDataContext } from '../context/UserContext';

export default function Card({ image }) {
  const {
    serverUrl,
    backendImage,
    setBackendImage,
    userData,
    setUserData,
    selectedImage,
    setSelectedImage,
    frontendImage,
    setFrontendImage
  } = useContext(userDataContext);

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] 
      bg-[#020220] border-2 border-[#0000ff66] rounded-2xl 
      overflow-hidden hover:shadow-2xl hover:shadow-blue-950 
      cursor-pointer hover:border-4 hover:border-white 
      ${String(selectedImage) === String(image) ? "border-4 border-white shadow-blue-950" : ""}`}
      onClick={() => {
        setSelectedImage(String(image));
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} className="h-full w-full object-cover" />
    </div>
  );
}
