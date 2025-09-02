import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuPlus } from 'react-icons/lu'
import {CARD_BG} from '../../utils/data'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import moment from 'moment'
import SummaryCard from '../../components/Cards/SummaryCard'
import { UserContext } from '../../Context/userContext.js'

const Dashboard = () => {
   const navigate = useNavigate();
   const { user, loading } = useContext(UserContext);
   const [sessions, setSessions] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

  const fetchAllSessions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      console.log("API Response:", response.data);
      // Ensure sessions is always an array
      const sessionsData = response.data;
      if (Array.isArray(sessionsData)) {
        setSessions(sessionsData);
      } else if (sessionsData && Array.isArray(sessionsData.sessions)) {
        setSessions(sessionsData.sessions);
      } else if (sessionsData && sessionsData.success && Array.isArray(sessionsData.sessions)) {
        setSessions(sessionsData.sessions);
      } else {
        console.log("Sessions data:", sessionsData);
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionId));
      toast.success("Session deleted successfully");
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchAllSessions();
    }
  }, [user, loading]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <DashboardLayout>
        <div className='p-6'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4'></div>
              <p className='text-gray-600'>Loading your sessions...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show empty state if no user
  if (!user) {
    return (
      <DashboardLayout>
        <div className='p-6'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <p className='text-gray-600 mb-4'>Please log in to view your sessions</p>
              <button 
                onClick={() => navigate('/')}
                className='bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors'
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='p-6'>
        {sessions.length === 0 ? (
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='w-24 h-24 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <LuPlus className='text-3xl text-rose-500' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>No sessions yet</h3>
              <p className='text-gray-600 mb-6'>Create your first interview preparation session</p>
              <button 
                onClick={() => navigate('/interview-prep')}
                className='bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition-colors shadow-lg'
              >
                Create New Session
              </button>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {Array.isArray(sessions) && sessions.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || ""}
                questions={data?.questions?.length || ""}
                description={data?.description || ""}
                lastUpdated={data?.updatedAt ? moment(data?.updatedAt).format("DD-MM-YYYY") : ""}
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => deleteSession(data?._id)}
              />
            ))}
          </div>
        )}
        <button 
          className='fixed bottom-6 right-6 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition-all duration-300 flex items-center gap-2' 
          onClick={() => navigate('/interview-prep')}
        >
          <LuPlus className='text-xl'/>
          Add New
        </button>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard