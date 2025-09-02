import React, { useContext, useState } from "react";
import { APP_FEATURES } from "../../utils/data";
import heroImage from "../../assets/herox.png";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Modal from "../../components/Modal";
import Login from "../../pages/Auth/Login";
import Signup from "../../pages/Auth/Signup";
import { UserContext } from "../../Context/userContext";
import ProfileInfoCard from "../../components/Cards/ProfileInfoCard";


const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-r from-rose-50 via-orange-50 to-white">
        {/* Container */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          {/* Header */}
          <header className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-gray-800">
              Interview Prep AI
            </div>

            {user ? (
              <ProfileInfoCard /> // ✅ fixed ternary operator
            ) : (
              <button
                className="bg-rose-500 text-white px-5 py-2 rounded-full hover:bg-rose-600 transition font-medium shadow-sm"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Content */}
          <div className="flex flex-col justify-center mt-16 lg:mt-24">
            {/* 2 Column Layout */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-12">
              {/* Left: Badge + Heading */}
              <div className="space-y-6 text-left md:w-1/2">
                <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 text-sm font-medium px-3 py-1 rounded-full">
                  <LuSparkles className="text-rose-500" /> AI Powered
                </span>
                <h1 className="text-5xl font-extrabold leading-snug text-gray-900">
                  Ace Interviews with <br />
                  <span className="text-rose-500">AI-Powered</span> Learning
                </h1>
              </div>

              {/* Right: Paragraph + Button */}
              <div className="mt-8 md:mt-0 md:w-1/2 space-y-6 text-left">
                <p className="text-gray-600 text-lg leading-relaxed">
                  Get role-specific questions, expand answers when you need
                  them, dive deeper into concepts, and organize everything your
                  way. From preparation to mastery — your ultimate interview
                  toolkit is here.
                </p>
                <button
                  className="bg-rose-600 text-white px-8 py-3 rounded-full font-medium shadow-md 
                  hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-500 hover:shadow-lg transition-all duration-300"
                  onClick={handleCTA}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Hero Image BELOW */}
            <div className="mt-16 flex justify-center">
              <img
                src={heroImage}
                alt="Hero Section"
                className="rounded-xl shadow-lg border border-rose-100 w-full max-w-4xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Features that <span className="text-rose-500">make you shine</span>
          </h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {APP_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="p-6 rounded-2xl bg-gradient-to-b from-rose-50 to-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && (
            <Login
              setCurrentPage={setCurrentPage}
              onClose={() => {
                setOpenAuthModal(false);
                setCurrentPage("login");
              }}
            />
          )}
          {currentPage === "signup" && (
            <Signup
              setCurrentPage={setCurrentPage}
              onClose={() => {
                setOpenAuthModal(false);
                setCurrentPage("login");
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
