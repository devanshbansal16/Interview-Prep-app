import axios from "axios";
import { BASE_URL } from "./apiPaths";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // Increased to 2 minutes
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Special axios instance for AI operations with longer timeout
export const aiAxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 300000, // 5 minutes for AI operations
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AI Request Interceptor
aiAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response Interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //Handle common errors globally 
    if (error.response) {
      if (error.response.status === 401) {
        //Redirect to login page 
        window.location.href = "/";
      } else if (error.response.status === 500) {
        console.error("Server error, Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. AI generation is taking longer than expected. Please try again.");
    } else {
      console.error("Something went wrong, Please try again later.");
    }
    return Promise.reject(error);
  }
);

// AI Response Interceptor for error handling
aiAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //Handle common errors globally 
    if (error.response) {
      if (error.response.status === 401) {
        //Redirect to login page 
        window.location.href = "/";
      } else if (error.response.status === 500) {
        console.error("Server error, Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("AI request timed out after 5 minutes. The AI is taking longer than expected to generate questions. Please try again.");
    } else {
      console.error("Something went wrong, Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 