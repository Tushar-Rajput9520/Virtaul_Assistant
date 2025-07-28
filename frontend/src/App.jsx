import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { userDataContext } from "./context/UserContext";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";

function App() {
  const { userData, loading } = useContext(userDataContext);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signup" />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signin" />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signin" />}
      />

      {/* Public Routes */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/customize" />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/customize" />}
      />

      {/* Fallback Route */}
      {/* <Route path="" element={<Navigate to="/" />} /> */}
    </Routes>
  );
}

export default App;
