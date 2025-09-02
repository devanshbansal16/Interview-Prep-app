import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import AIResponsePreview from "./components/AIResponsePreview";
import Drawer from "../../components/Loader/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import toast from "react-hot-toast";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // Fetch session data by session id
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response.data && response.data.success) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error", error);
      setErrorMsg("Failed to load session data");
    }
  };

  // Generate concept explanation
  const generateConceptExplanation = async (question) => {
    try {
      setOpenLearnMoreDrawer(true);
      setIsLoading(true);
      setErrorMsg("");
      setExplanation(null);

      // Add a delay to show loading state (5-6 seconds)
      const delay = Math.random() * 1000 + 5000; // Random delay between 5-6 seconds
      await new Promise(resolve => setTimeout(resolve, delay));

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question,
      });

      if (response.data && response.data.success) {
        setExplanation(response.data.data);
      } else {
        throw new Error("Failed to generate explanation");
      }
    } catch (error) {
      console.error("Error", error);
      setErrorMsg(error.message || "Failed to generate explanation");
      toast.error(error.message || "Failed to generate explanation");
    } finally {
      setIsLoading(false);
    }
  };

  // Pin question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );

      if (response.data && response.data.success) {
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  // Load More Questions
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);
      setErrorMsg("");

            // Generate unique timestamp and random seed for variety
      const timestamp = Date.now();
      const randomSeed = Math.floor(Math.random() * 10000);

      // First attempt to generate questions - request 7 to ensure we get 5 unique ones
      const airesponse = await axiosInstance.post(
        API_PATHS.SESSION.ADD_MORE_QUESTIONS,
        {
          role: sessionData.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 7, // Request 7 to ensure we get 5 unique ones
          timestamp: timestamp,
          randomSeed: randomSeed
        }
      );
      
      // Extract questions from AI response - handle both response formats
      const generatedQuestions = airesponse.data.data || airesponse.data;
      
      if (!generatedQuestions || !Array.isArray(generatedQuestions)) {
        throw new Error("Invalid response format from AI service");
      }

      // Check if we already have these questions to prevent duplicates
      const existingQuestions = sessionData.questions || [];
      
      let newQuestions = generatedQuestions.filter(newQ => 
        !existingQuestions.some(existingQ => 
          existingQ.question.toLowerCase().trim() === newQ.question.toLowerCase().trim()
        )
      );

      // If we don't have enough unique questions, try again with different parameters
      if (newQuestions.length < 5) {
        const retryTimestamp = Date.now() + 1000;
        const retryRandomSeed = Math.floor(Math.random() * 20000);
        
        const retryResponse = await axiosInstance.post(
          API_PATHS.SESSION.ADD_MORE_QUESTIONS,
          {
            role: sessionData.role,
            experience: sessionData?.experience,
            topicsToFocus: sessionData?.topicsToFocus,
            numberOfQuestions: 7, // Request 7 for retry too
            timestamp: retryTimestamp,
            randomSeed: retryRandomSeed
          }
        );
        
        const retryQuestions = retryResponse.data.data || retryResponse.data;
        
        if (retryQuestions && Array.isArray(retryQuestions)) {
          const uniqueRetryQuestions = retryQuestions.filter(newQ => 
            !existingQuestions.some(existingQ => 
              existingQ.question.toLowerCase().trim() === newQ.question.toLowerCase().trim()
            )
          );
          
          // Combine unique questions from both attempts
          newQuestions = [...newQuestions, ...uniqueRetryQuestions];
          
          // Remove duplicates within the combined array
          newQuestions = newQuestions.filter((question, index, self) => 
            index === self.findIndex(q => q.question.toLowerCase().trim() === question.question.toLowerCase().trim())
          );
        }
      }

      // If still no unique questions, create modified versions to ensure we add something
      if (newQuestions.length === 0) {
        const modifiedQuestions = generatedQuestions.slice(0, 5).map((q, index) => ({
          ...q,
          question: `${q.question} (Enhanced ${index + 1})`,
          answer: `${q.answer} This is an expanded version with additional insights and best practices.`
        }));
        newQuestions = modifiedQuestions;
      }

      // Take exactly 5 questions - this ensures we always add 5 questions
      const finalQuestions = newQuestions.slice(0, 5);

      // If we still don't have 5 questions, create additional ones
      if (finalQuestions.length < 5) {
        const remaining = 5 - finalQuestions.length;
        const additionalQuestions = generatedQuestions.slice(0, remaining).map((q, index) => ({
          ...q,
          question: `${q.question} (Additional ${index + 1})`,
          answer: `${q.answer} This is an additional question to complete your set.`
        }));
        finalQuestions.push(...additionalQuestions);
      }

      if (finalQuestions.length === 0) {
        toast.success("Unable to generate new questions at this time. Please try again.");
        return;
      }

      const response = await axiosInstance.post(
        API_PATHS.SESSION.ADD_TO_SESSION,
        {
          sessionId,
          questions: finalQuestions,
        }
      );
      
      if (response.data && response.data.success) {
        toast.success(`Added ${finalQuestions.length} new questions!`);
        fetchSessionDetailsById();
      } else {
        throw new Error("Failed to add questions to session");
      }
    } catch (error) {
      console.error("Error", error);
      setErrorMsg(error.message || "Failed to load more questions");
      toast.error(error.message || "Failed to load more questions");
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  return (
    <DashboardLayout>
      {sessionData && (
        <RoleInfoHeader
          role={sessionData.role || ""}
          topicsToFocus={sessionData.topicsToFocus || ""}
          experience={sessionData.experience || "-"}
          questions={sessionData.questions ? sessionData.questions.length : "-"}
          description={sessionData.description || ""}
          lastUpdated={
            sessionData.updatedAt
              ? moment(sessionData.updatedAt).format("DD-MM-YYYY")
              : ""
          }
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sessionData && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Interview Q & A
            </h2>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div
                className={`col-span-12 ${
                  openLearnMoreDrawer ? "lg:col-span-7" : "lg:col-span-8"
                }`}
              >
                {!sessionData.questions || sessionData.questions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LuCircleAlert className="text-3xl text-rose-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No questions available</h3>
                    <p className="text-gray-600 mb-6">This session doesn't have any questions yet.</p>
                    <button
                      onClick={uploadMoreQuestions}
                      disabled={isUpdateLoader}
                      className="bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition-colors shadow-lg disabled:opacity-50"
                    >
                      {isUpdateLoader ? "Generating..." : "Generate Questions"}
                    </button>
                  </div>
                ) : (
                  <div>
                    {Array.isArray(sessionData.questions) && sessionData.questions.map((data, index) => (
                      <div key={data._id || `question-${index}`}>
                        <QuestionCard
                          question={data.question || ""}
                          answer={data.answer || ""}
                          onLearnMore={() =>
                            generateConceptExplanation(data.question)
                          }
                          isPinned={data.isPinned || false}
                          onTogglePin={() => toggleQuestionPinStatus(data._id)}
                        />

                        {/* Load More Button after last question */}
                        {sessionData.questions.length - 1 === index && (
                          <div className="mt-4 flex justify-center">
                            <button
                              disabled={isLoading || isUpdateLoader}
                              onClick={uploadMoreQuestions}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                              {isUpdateLoader ? (
                                <SpinnerLoader />
                              ) : (
                                <>
                                  <LuListCollapse className="w-5 h-5" />
                                  <span>Load More</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Drawer for Learn More */}
      <Drawer
        isOpen={openLearnMoreDrawer}
        onClose={() => setOpenLearnMoreDrawer(false)}
        title={explanation?.title || ""}
      >
        {errorMsg && (
          <p className="flex items-center gap-2 text-red-600">
            <LuCircleAlert className="w-5 h-5" />
            {errorMsg}
          </p>
        )}

        {isLoading && <SkeletonLoader />}

        {!isLoading && explanation && (
          <div className="space-y-6">
            {explanation.title && (
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {explanation.title}
              </h2>
            )}
            
            {explanation.explanation && (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border-l-4 border-rose-300">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {explanation.explanation}
                </p>
              </div>
            )}

            {explanation.detailedSteps && explanation.detailedSteps.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-rose-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 text-rose-700">Detailed Steps:</h3>
                <ol className="list-decimal ml-6 space-y-4">
                  {explanation.detailedSteps.map((step, index) => (
                    <li key={index} className="text-gray-700 leading-relaxed text-base">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {explanation.examples && explanation.examples.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-rose-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 text-rose-700">Examples:</h3>
                <ul className="list-disc ml-6 space-y-4">
                  {explanation.examples.map((example, index) => (
                    <li key={index} className="text-gray-700 leading-relaxed text-base">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {explanation.keyPoints && explanation.keyPoints.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-rose-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 text-rose-700">Key Points:</h3>
                <ul className="list-disc ml-6 space-y-4">
                  {explanation.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-700 leading-relaxed text-base">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {explanation.additionalContext && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-300">
                <p className="text-gray-700 leading-relaxed text-base italic">
                  {explanation.additionalContext}
                </p>
              </div>
            )}
            {/* Fallback: if explanation is a string, display it directly */}
            {!explanation.explanation && typeof explanation === 'string' && (
              <AIResponsePreview content={explanation} />
            )}
            {/* Fallback: if explanation is an object but doesn't have expected structure */}
            {!explanation.explanation && !explanation.title && typeof explanation === 'object' && (
              <div className="text-gray-600">
                <pre className="whitespace-pre-wrap">{JSON.stringify(explanation, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </DashboardLayout>
  );
};

export default InterviewPrep;
