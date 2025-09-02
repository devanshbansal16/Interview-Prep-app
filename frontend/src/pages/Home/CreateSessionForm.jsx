import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuX } from "react-icons/lu";
import Input from "../../components/Inputs/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError("All fields are required");
      return;
    }
    setError("");

    setIsLoading(true);

    try {
      // Call AI API to generate questions
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 5, // Generate 5 questions initially
      });

      // Extract questions from AI response
      const generatedQuestions = aiResponse.data.data || aiResponse.data;

      // Create a session with generated questions
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions,
      });

      // Navigate to dashboard if session is created successfully
      if (response.data?.session?._id) {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Start a New Interview Journey</h3>
            <p className="text-gray-600 mt-1">
              Fill out a few quick details and unlock your personalized set of interview questions!
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleCreateSession} className="space-y-4">
            <Input
              value={formData.role}
              onChange={({ target }) => handleChange("role", target.value)}
              label="Target Role"
              placeholder="(e.g., Frontend Developer, UI/UX Designer, etc.)"
              type="text"
            />

            <Input
              value={formData.experience}
              onChange={({ target }) => handleChange("experience", target.value)}
              label="Years of Experience"
              placeholder="(e.g., 2, 5, 10, etc.)"
              type="number"
            />

            <Input
              value={formData.topicsToFocus}
              onChange={({ target }) => handleChange("topicsToFocus", target.value)}
              label="Topics to Focus On"
              placeholder="(Comma-separated, e.g., React, Node.js, MongoDB)"
              type="text"
            />

            <Input
              value={formData.description}
              onChange={({ target }) => handleChange("description", target.value)}
              label="Description"
              placeholder="(Any specific goals or notes for this session)"
              type="text"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <SpinnerLoader />}
              Create Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionForm;
