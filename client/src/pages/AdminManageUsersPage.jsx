import React, { useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import AdminTable from '../components/AdminTable';
  
  const AdminManageUsersPage = () => {
    useEffect(() => {
      const response = 
      // Fetch data from API and update state
      // Example: fetch('/api/users').then(res => res.json()).then(data => setUsers(data));
      fetchUsers();
    }, []);

    const students = [
      { name: 'Hamraz Hakeem', language: 'Spanish', details: 'last class 09 - 03 - 2024 to 11 - 09 - 2024', credits: '133 Credits', status: 'Active' },
      { name: 'Joe Biden', language: 'English', details: 'Not a tutor', credits: '137 Credits', status: 'Inactive' },
    ];
  
    const tutors = [
      { name: 'Donald Trump', language: 'Spanish', credits: '350 Credits', rating: 4.8, status: 'Active' },
      { name: 'Joe Biden', language: 'English', credits: '369 Credits', rating: 4.7, status: 'Inactive' },
    ];
  
    const pendingTutors = [
      { name: 'RFK', language: 'Spanish' },
      { name: 'Kamala', language: 'English' },
    ];
  
    const sidebarItems = [
      { label: 'Dashboard', active: false },
      { label: 'Manage Users', active: true },
      { label: 'Sessions', active: false },
    ];
  
    const studentColumns = ['#', 'Name', 'Language', 'Details', 'Status', 'Action'];
    const tutorColumns = ['#', 'Name', 'Language', 'Credits', 'Rating', 'Status', 'Action'];
    const pendingColumns = ['#', 'Name', 'Language', 'Action'];
  
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <AdminNavbar/>
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar items={sidebarItems} />
          <div className="flex-1 p-8 overflow-y-auto">
            <AdminTable title="Students" columns={studentColumns} data={students} />
            <AdminTable title="Tutors" columns={tutorColumns} data={tutors} showRating={true} />
            <h2 className="text-lg font-semibold mb-2">Verify Tutors</h2>
            <AdminTable title="Pending" columns={pendingColumns} data={pendingTutors} isPending={true} />
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminManageUsersPage;