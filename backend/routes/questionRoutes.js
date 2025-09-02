const express = require("express");

const { togglePinQuestion, updateQuestionNote, addQuestionsToSession } = require("../controllers/questionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Specific routes first
router.post("/add", protect, addQuestionsToSession);

// Parameterized routes after
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, updateQuestionNote);

module.exports = router;