// For local development, point to your locally running backend
export const BASE_URL = "https://interview-prep-app-backend.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`, // Signup
    LOGIN: `${BASE_URL}/api/auth/login`, // Authenticate user & return JWT token
    GET_PROFILE: `${BASE_URL}/api/auth/profile`, // Get logged-in user details
  },

  IMAGE: {
    UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`, // Upload profile picture
  },

  AI: {
    GENERATE_QUESTIONS: `${BASE_URL}/api/ai/generate-questions`, // Generate interview questions and answers using Gemini
    GENERATE_EXPLANATION: `${BASE_URL}/api/ai/generate-explanation`, // Generate concept explanation using Gemini
  },

  SESSION: {
    CREATE: `${BASE_URL}/api/session/create`, // Create a new interview session with questions
    GET_ALL: `${BASE_URL}/api/session/my-sessions`, // Get all user sessions
    GET_ONE: (id) => `${BASE_URL}/api/session/${id}`, // Get session details with questions
    DELETE: (id) => `${BASE_URL}/api/session/${id}`, // Delete a session
    ADD_MORE_QUESTIONS: `${BASE_URL}/api/ai/generate-questions`, // Add more questions to a session
    ADD_TO_SESSION: `${BASE_URL}/api/questions/add`, // Add questions to session
    GET_EXPLANATION: `${BASE_URL}/api/ai/generate-explanation`, // Get concept explanation
  },

  QUESTION: {
    ADD_TO_SESSION: `${BASE_URL}/api/questions/add`, // Add more questions to a session
    PIN: (id) => `${BASE_URL}/api/questions/${id}/pin`, // Pin or Unpin a question
    UPDATE_NOTE: (id) => `${BASE_URL}/api/questions/${id}/note`, // Update/Add a note to a question
  },
};
