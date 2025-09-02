const Question = require("../models/Question");
const Session = require("../models/Session");

//@desc Add additional questions to a session
//@route POST /api/questions/add
// @access Private
exports.addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ message: "Session not found" });
    }

    //Create new questions 
    const createdQuestions = await Question.insertMany(questions.map(q => ({
      ...q, session: session._id
      , question: q.question, answer: q.answer
    })));

    //update session to include new question IDs
    session.questions.push(...createdQuestions.map(q => q._id));
    await session.save();
    res.status(201).json({ success: true, session, createdQuestions });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while adding questions to session",
      error: error.message,
    });
  }
};

//@desc  pin or unpin a question
//@route POST /api/questions/:id/pin
// @access Private
exports.togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    question.isPinned = !question.isPinned;
    await question.save();
    res.status(200).json({ success: true, question });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while pinning/unpinning question",
      error: error.message,
    });
  }
};

//@desc update a question
//@route PUT /api/questions/:id
// @access Private
exports.updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    question.note = note;
    await question.save();
    res.status(200).json({ success: true, question });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating question",
      error: error.message,
    });
  }
};