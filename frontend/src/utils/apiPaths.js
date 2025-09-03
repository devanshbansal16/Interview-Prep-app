export const BASE_URL = "https://interview-prep-app-backend.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload profile picture
  },

  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions", // Generate interview questions and answers using Gemini
    GENERATE_EXPLANATION: "/api/ai/generate-explanation", // Generate concept explanation using Gemini
  },

  SESSION: {
    CREATE: "/api/session/create", // Create a new interview session with questions
    GET_ALL: "/api/session/my-sessions", // Get all user sessions
    GET_ONE: (id) => `/api/session/${id}`, // Get session details with questions
    DELETE: (id) => `/api/session/${id}`, // Delete a session
    ADD_MORE_QUESTIONS: "/api/ai/generate-questions", // Add more questions to a session
    ADD_TO_SESSION: "/api/questions/add", // Add questions to session
    GET_EXPLANATION: "/api/ai/generate-explanation", // Get concept explanation
  },

  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add", // Add more questions to a session
    PIN: (id) => `/api/questions/${id}/pin`, // Pin or Unpin a question
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`, // Update/Add a note to a question
  },
};
