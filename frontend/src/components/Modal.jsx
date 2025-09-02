import React from 'react';

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  
  if(!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fade-in-up">
      {/* Modal Content */}
      <div className="relative flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden w-96 max-w-md mx-4 border border-rose-100">
        
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button
              type="button"
              className="text-rose-400 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-50"
              onClick={onClose}
            >
              {/* Close Icon (X) */}
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
