import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{role}</h2>
              <p className="text-lg text-gray-600">
                {topicsToFocus}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
              Experience: {experience} {experience == 1 ? "year" : "years"}
            </div>
            <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
              {questions} Q&A
            </div>
            <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;