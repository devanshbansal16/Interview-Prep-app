import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4 w-full">
      {/* Label */}
      {label && (
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
      )}

      {/* Input with icon */}
      <div className="relative flex items-center">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-rose-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
          value={value}
          onChange={onChange}
        />

        {/* Show / Hide password button */}
        {type === "password" && (
          <span
            className="absolute right-3 text-rose-400 cursor-pointer hover:text-rose-600 transition-colors"
            onClick={toggleShowPassword}
          >
            {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
