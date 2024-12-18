import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import AdminTable from '../components/AdminTable';
import useAxios from '../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
  
const AdminManageUsersPage = () => {
  const axiosInstance = useAxios();
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [languageChangeRequests, setLanguageChangeRequests] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // Page loading state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchUsers = async () => {
    try {
        setLoading(true);
        const [usersResponse, requestsResponse] = await Promise.all([
          axiosInstance.get('users/'),
          axiosInstance.get('teaching-language-change-requests/') // Add your actual endpoint
        ]);
        const users = usersResponse.data;
        const requests = requestsResponse.data;
        console.log('Users:', users);
        console.log('Language change requests:', requests);
        // Filter out the data for students, approved tutors, and pending tutors
        setTimeout(() => {
          // Filter out the data for students, approved tutors, and pending tutors
          const studentData = users.filter(user => user.user_type === 'student');
          const approvedTutors = users.filter(user => user.user_type === 'tutor' && user.tutor_details.status === 'approved');
          const pendingTutorsData = users.filter(user => user.user_type === 'tutor' && user.tutor_details.status === 'pending');
  
          // Update state with the fetched data
          setStudents(studentData);
          console.log(studentData)
          setTutors(approvedTutors);
          setPendingTutors(pendingTutorsData);
          setLanguageChangeRequests(requests);
          setLoading(false); // End loading
        }, 500); // 2 seconds delay for loading
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchUsers();
    }, []);

  const sidebarItems = [
      { label: 'Dashboard', active: false },
      { label: 'Manage Users', active: true },
      { label: 'Sessions', active: false },
  ];

  const studentColumns = ['#', 'Name','Email', 'Language to Learn', 'Balance Credits', 'Status', 'Action'];
  const tutorColumns = ['#', 'SpeakIn Name', 'Email', 'Language to Teach', 'Balance Credits', 'Rating', 'Status', 'Action'];
  const pendingColumns = ['#', 'SpeakIn Name','Email', 'Language to Teach', 'Required Credits', 'Action'];
  const languageRequestColumns = ['#', 'Full Name', 'Email', 'Current Language', 'Requested Language', 'Status', 'Action'];

  // Action handler for blocking/unblocking tutors and verifying pending tutors
  const handleAction = async (userId, action) => {
    try {
      const response = await axiosInstance.patch(`users/${userId}/`, {
        user_id: userId,
        is_active: action, // Include the action in the payload
      });
      console.log(`User ${action}ed successfully:`, response.data);
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    } finally {
      // Refetch the users after the action is completed
      fetchUsers();
    }
  };
  

  const handleVerify = async (userId) => {
    try {
      const response = await axiosInstance.get(`users/${userId}/`);
      navigate(`/admin/verify-tutor/${userId}`, { state: response.data });
      console.log("Tutor data:", response.data);
    } catch (error) {
      console.error('Error verifying tutor:', error);
    } 
  }

  const handleLanguageChangeVerify = async (requestId) => {
    try {
      const requestData = languageChangeRequests.find(
        request => request.id === requestId
      );

      if (requestData) {
        // Navigate with the found data instead of making a new API call
        navigate(`/admin/verify-language-change/${requestId}`, {
          state: requestData
        });
      } else {
        console.error('Language change request not found in cached data');
      }
    } catch (error) {
      console.error('Error getting language change request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <AdminNavbar>
        <button 
          className="lg:hidden p-2 text-white hover:text-gray-300"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </AdminNavbar>
      
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar 
          items={sidebarItems} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-10 h-10 border-4 border-white/20 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Students Table */}
              <AdminTable
                title="Students"
                columns={studentColumns}
                data={students.map((student, index) => ({
                  id: index + 1,
                  name: student.name,
                  email: student.email,
                  language: student.language_to_learn.map(lang => lang.language).join(', ') || 'N/A',
                  credits: `${student.balance_credits} Credits`,
                  status: student.is_active ? 'Active' : 'Inactive',
                  action: (
                    <button
                      className={`inline-block w-20 px-3 py-1 rounded text-white ${student.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      onClick={() => handleAction(student.id, student.is_active ? false : true)}
                    >
                      {student.is_active ? 'Block' : 'Unblock'}
                    </button>
                  ),
                }))}
              />

              {/* Tutors Table */}
              <AdminTable
                title="Tutors"
                columns={tutorColumns}
                data={tutors.map((tutor, index) => ({
                  id: index + 1,
                  name: tutor.tutor_details.speakin_name,
                  email: tutor.email,
                  language: tutor.tutor_language_to_teach.map(lang => lang.language).join(', ') || 'N/A',
                  credits: `${tutor.balance_credits} Credits`,
                  rating: tutor.tutor_details.rating,
                  status: tutor.is_active ? 'Active' : 'Inactive',
                  action: (
                    <button
                      className={`inline-block w-20 px-3 py-1 rounded text-white ${tutor.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      onClick={() => handleAction(tutor.id, tutor.is_active ? false : true)}
                    >
                      {tutor.is_active ? 'Block' : 'Unblock'}
                    </button>
                  ),
                }))}
                showRating={true}
              />

              {/* Pending Tutors for Verification */}
              <h2 className="text-lg font-semibold mb-2">Verify Tutors</h2>
              <AdminTable
                title="Pending"
                columns={pendingColumns}
                data={pendingTutors.map((tutor, index) => ({
                  id: index + 1,
                  name: tutor.tutor_details.speakin_name,
                  email: tutor.email,
                  language: tutor.tutor_language_to_teach.map(lang => lang.language).join(', '),
                  credits: `${tutor.tutor_details.required_credits} Credits`,
                  action: (
                    <button
                      className={`bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1`}
                      onClick={() => handleVerify(tutor.id)}
                    > Verify</button>
                  ),
                }))}
                isPending={true}
              />

              <AdminTable
                title="Language Change Requests"
                columns={languageRequestColumns}
                data={languageChangeRequests.map((request, index) => ({
                  id: index + 1,
                  name: request.full_name || 'N/A',
                  email: request.user?.email || 'N/A',
                  language: request.tutor_language_to_teach?.[0]?.language || 'N/A',
                  newLanguage: request.new_language || 'N/A',
                  status: request.user?.is_active? 'Active' : 'Inactive',
                  action: (
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1"
                        onClick={() => handleLanguageChangeVerify(request.id)}
                      >
                        Verify
                      </button>
                    </div>
                  ),
                }))}
              />

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageUsersPage;