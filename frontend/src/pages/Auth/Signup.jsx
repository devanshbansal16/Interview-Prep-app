import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../Context/userContext";
import uploadImage from "../../utils/uploadImage";

const Signup = ({ setCurrentPage, onClose }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  /// Handle Signup Form Submit
  const handleSignup = async (e) => {
    e.preventDefault();
    
    let profileImageUrl = "";
    
    if(!fullName) {
      setError("Please enter your full name");
      return;
    }
    if(!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if(!password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      //Upload image if provided
      if(profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });
      
      console.log("Signup response:", response.data);
      
      if(response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        updateUser(response.data);
        navigate("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if(error.code === 'ERR_NETWORK') {
        setError("Network error. Please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 relative">
      {/* Cross Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        type="button"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Heading */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Create an account</h3>
      <p className="text-gray-500 mb-6">
        Please enter your details to sign up
      </p>

      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
    
        {/* Full Name */}
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          placeholder="John Doe"
          type="text"
        />

        {/* Email */}
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="email"
        />

        {/* Password */}
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
        />

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-rose-500 text-white py-2.5 rounded-full hover:bg-rose-600 transition font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      {/* Switch to Login */}
      <p className="text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <button
          type="button"
          className="text-rose-500 font-medium hover:underline"
          onClick={() => setCurrentPage("login")}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
