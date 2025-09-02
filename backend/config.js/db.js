const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      console.log("⚠️  MONGO_URI not found. Please create a .env file with your MongoDB connection string.");
      console.log("🚀 Starting server without database connection...");
      return;
    }

    console.log("🔄 Connecting to MongoDB...");

    // Add connection options for better performance and timeout handling
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 1, // Maintain at least 1 socket connection
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.log("❌ Error connecting to database:", error.message);
    console.log("🚀 Starting server without database connection...");
    // Don't exit process - allow server to run without DB
  }
};

module.exports = connectDB;