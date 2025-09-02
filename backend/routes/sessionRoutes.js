const express = require("express");
const { createSession, getSessionById, getMySessions, deleteSession } = require("../controllers/sessionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Specific routes first
router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);

// Parameterized routes after
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

module.exports = router;