import React, { useRef, useState, useEffect } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../../pages/InterviewPrep/components/AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [hasError, setHasError] = useState(false);
  const contentRef = useRef(null);

  // Validate props
  if (!question) {
    console.warn("QuestionCard: question prop is missing or undefined");
    return null;
  }

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      // Add a small delay to ensure the content is rendered
      const timer = setTimeout(() => {
        if (contentRef.current) {
          try {
            const contentHeight = contentRef.current.scrollHeight;
            setHeight(contentHeight + 10);
          } catch (error) {
            console.error("Error calculating content height:", error);
            setHeight(200); // Fallback height
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLearnMore = () => {
    try {
      if (onLearnMore && typeof onLearnMore === 'function') {
        onLearnMore();
      }
    } catch (error) {
      console.error("Error in learn more handler:", error);
      setHasError(true);
    }
  };

  const handleTogglePin = () => {
    try {
      if (onTogglePin && typeof onTogglePin === 'function') {
        onTogglePin();
      }
    } catch (error) {
      console.error("Error in toggle pin handler:", error);
      setHasError(true);
    }
  };

  // Show error state if something went wrong
  if (hasError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
        <p className="text-red-700 text-sm">Something went wrong with this question card. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Question Icon */}
          <div className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-xs">Q</span>
          </div>

          {/* Question Text */}
          <div className="flex-1 min-w-0">
            <h3 
              className="text-sm font-medium text-gray-900 cursor-pointer hover:text-gray-700 leading-tight"
              onClick={toggleExpand}
            >
              {question}
            </h3>
          </div>

          {/* Expand/Collapse Button */}
          <button 
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
            onClick={toggleExpand}
          >
            <LuChevronDown 
              size={16} 
              className={isExpanded ? "rotate-180" : ""}
            />
          </button>
        </div>
        
        {/* Action Buttons - Only show when expanded */}
        {isExpanded && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <button 
                className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded"
                onClick={handleTogglePin}
              >
                {isPinned ? (
                  <LuPinOff className="w-3.5 h-3.5" />
                ) : (
                  <LuPin className="w-3.5 h-3.5" />
                )}
              </button>
              <button 
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded"
                onClick={handleLearnMore}
              >
                <LuSparkles className="w-3.5 h-3.5" />
                <span>Learn More</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Answer Section */}
      {isExpanded && (
        <div className="bg-gray-50 px-4 pb-4">
          <div className="pt-2" ref={contentRef}>
            {answer ? (
              <AIResponsePreview content={answer} />
            ) : (
              <p className="text-gray-500 text-sm italic">No answer available for this question.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;