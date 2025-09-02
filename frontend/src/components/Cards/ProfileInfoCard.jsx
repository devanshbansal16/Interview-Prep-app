import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/userContext.js";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  // If no user, render nothing
  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      {/* Profile Image */}
      <div className="relative">
        {user.profileImageUrl || user.ProfileImageUrl ? (
          <img
            src={user.profileImageUrl || user.ProfileImageUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-rose-200 shadow-sm object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-10 h-10 rounded-full border-2 border-rose-200 shadow-sm bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold ${(user.profileImageUrl || user.ProfileImageUrl) ? 'hidden' : 'flex'}`}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
      </div>

      {/* User Info */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">
          {user.name || "User Name"}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
