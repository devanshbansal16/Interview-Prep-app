const Session = require("../models/Session");
const Question = require("../models/Question");

/**
 * @desc    Create a new session
 * @route   POST /api/session/create
 * @access  Private
 */
exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user._id;

    // Create a new session
    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    // If questions are provided, create them
    let questionDocs = [];
    if (questions && Array.isArray(questions)) {
      questionDocs = await Promise.all(
        questions.map(async (q) => {
          const question = await Question.create({
            session: session._id,
            question: q.question,
            answer: q.answer,
          });
          return question._id;
        })
      );
    }

    // Link questions to session
    session.questions = questionDocs;
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating session",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all sessions of logged-in user
 * @route   GET /api/session/my-sessions
 * @access  Private
 */
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching sessions",
      error: error.message,
    });
  }
};

/**
 * @desc    Get a session by ID (with questions)
 * @route   GET /api/session/:id
 * @access  Private
 */
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: -1 } },
    });

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Check if user owns this session
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching session",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a session by ID (and related questions)
 * @route   DELETE /api/session/:id
 * @access  Private
 */
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Check if logged-in user owns this session
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Delete all questions linked to this session
    await Question.deleteMany({ session: session._id });

    // Delete session itself
    await session.deleteOne();

    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting session",
      error: error.message,
    });
  }
};
