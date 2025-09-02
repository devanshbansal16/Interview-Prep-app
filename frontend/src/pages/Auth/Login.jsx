import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../Context/userContext.js';

const Login = ({ setCurrentPage, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if(!password) {
      setError("Please enter a valid password");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      console.log("Login response:", response.data);

      if(response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        updateUser(response.data);
        navigate("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch(error) {
      console.error("Login error:", error);
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if(error.code === 'ERR_NETWORK') {
        setError("Network error. Please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 relative'>
      {/* Cross Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        type="button"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <h3 className='text-2xl font-bold text-gray-800 mb-2'>Welcome Back</h3>
      <p className='text-gray-500 mb-6'>
        Please enter your details to log in
      </p>
      <form onSubmit={handleLogin} className='space-y-4'>
       <Input value={email} onChange={({target}) => setEmail(target.value)} label="Email Address" placeholder="john@example.com" type="text" />

       <Input value={password} onChange={({ target }) => setPassword(target.value)} label="Password" placeholder="Min 8 characters" type="password" />

       {error && <p className='text-red-500 text-sm'>{error}</p>}
       <button 
         type="submit" 
         className='w-full bg-rose-500 text-white py-2.5 rounded-full hover:bg-rose-600 transition font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
         disabled={isLoading}
       >
         {isLoading ? 'Logging in...' : 'Login'}
       </button>
       <p className='text-center text-gray-600 mt-6'>Don't have an account? <button type="button" className='text-rose-500 font-medium hover:underline cursor-pointer' onClick={() => setCurrentPage('signup')}>Sign Up</button></p>
     </form>
    </div>
  )
}

export default Login