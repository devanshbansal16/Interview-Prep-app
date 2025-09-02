import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import LandingPage from './pages/InterviewPrep/LandingPage'
import Dashboard from './pages/Home/Dashboard'
import InterviewPrep from './pages/InterviewPrep/InterviewPrep'
import CreateSessionForm from './pages/Home/CreateSessionForm'
import UserProvider from './Context/userContext.jsx'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  return (
    <UserProvider>
    <div>
     <Router>
           <Routes>
              {/*Default Route */}
              <Route path='/' element={<LandingPage />} />
              
              {/* Auth Routes */}
              <Route path='/login' element={<LandingPage />} />
              
              {/* Dashboard Route */}
              <Route path='/dashboard' element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              
              {/* Interview Prep Routes */}
              <Route path='/interview-prep' element={<CreateSessionForm />} />
              <Route path='/interview-prep/:sessionId' element={<InterviewPrep />} />
              
              {/* Catch all route - redirect to home */}
              <Route path='*' element={<LandingPage />} />
           </Routes>
     </Router>

     <Toaster
           toastOptions={{
             className: '',
             style: {
               fontSize: "13px",
             },
           }}
          />
    </div>
    </UserProvider>
  )
}

export default App