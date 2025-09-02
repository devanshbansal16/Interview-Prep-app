import React from "react";
import { LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      className={`fixed top-0 right-0 z-40 h-screen w-[500px] p-8 overflow-y-auto transition-transform bg-white dark:bg-gray-900 shadow-lg ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      tabIndex="-1"
      aria-labelledby="drawer-right-label"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h5
          id="drawer-right-label"
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          {title}
        </h5>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <LuX className="w-6 h-6" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
};

export default Drawer;
