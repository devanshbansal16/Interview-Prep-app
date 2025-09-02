require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config.js/db");

// Debug: Check environment variables
console.log("🔍 Environment Variables Debug:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Found" : "❌ Not found");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Found" : "❌ Not found");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Not found");
console.log("PORT:", process.env.PORT || "8000 (default)");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");
const { protect } = require("./middlewares/authMiddleware");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Connect to database
try {
  connectDB();
} catch (error) {
  console.error("Database connection failed:", error);
}

// Test routes
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running successfully!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/questions", questionRoutes);

// AI Routes
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/test`);
});