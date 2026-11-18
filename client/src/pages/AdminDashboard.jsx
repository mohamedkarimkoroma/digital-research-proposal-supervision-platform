import { useState, useEffect } from 'react';
import { API_URL, getToken, getUser, logout } from '../api';

function AdminDashboard() {
  const [user] = useState(getUser());
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals' or 'users'
  
  const [proposals, setProposals] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');

  useEffect(() => {
    fetchProposals();
    fetchSupervisors();
    fetchAllUsers();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch(`${API_URL}/proposals`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (response.ok) setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals', error);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/supervisors`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (response.ok) setSupervisors(data);
    } catch (error) {
      console.error('Error fetching supervisors', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (response.ok) setAllUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleAssign = async (proposalId, supervisorId) => {
    if (!supervisorId) return;
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/admin/proposals/${proposalId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ supervisorId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Supervisor assigned successfully!');
        fetchProposals();
      } else {
        setMessage(data.message || 'Failed to assign supervisor');
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  // Filter proposals based on Search AND University Dropdown
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.student?.university?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUniversity = selectedUniversity === 'All Universities' || 
                              p.student?.university === selectedUniversity;

    return matchesSearch && matchesUniversity;
  });

  // Filter users based on Search
  const filteredUsers = allUsers.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.university?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-12 relative">
      
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/campus.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.8
        }}
      ></div>

      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <nav className="bg-green-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-800 text-lg font-black">SL</span>
              </div>
              <span className="text-xl font-bold tracking-wide hidden md:block">Research Hub</span>
            </div>
            <div className="flex items-center gap-5">
              <button className="relative p-2 text-green-100 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-green-800"></span>
              </button>
              <div className="flex items-center gap-3 border-l border-green-700 pl-5">
                <div className="w-9 h-9 bg-green-200 rounded-full flex items-center justify-center text-green-900 font-bold shadow-inner">
                  {user?.fullName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold leading-tight">{user?.fullName}</p>
                  <p className="text-xs text-green-300 font-medium">Administrator</p>
                </div>
              </div>
              <button onClick={logout} className="ml-2 px-4 py-2 bg-green-900 text-white text-sm font-semibold rounded-lg hover:bg-green-950 transition border border-green-700">
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 mt-8">
          
          {/* STEP 2 APPLIED: Dynamic Header with University Name */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
              {user?.university || 'University'} Administration Portal
            </h1>
            <p className="text-gray-500">Manage proposals and assign supervisors for your institution.</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8 bg-white rounded-t-xl px-4 pt-2">
            <button 
              onClick={() => { setActiveTab('proposals'); setSearchTerm(''); }}
              className={`py-3 px-6 font-bold text-lg border-b-2 transition ${activeTab === 'proposals' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Proposals & Assignments
            </button>
            <button 
              onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
              className={`py-3 px-6 font-bold text-lg border-b-2 transition ${activeTab === 'users' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Registered Users ({allUsers.length})
            </button>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-lg font-medium shadow-sm ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[500px]">
            
            {/* Search & Filter Bar Area */}
            <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-4 bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800 whitespace-nowrap">
                {activeTab === 'proposals' ? 'Institution Proposal Registry' : 'Institution User Registry'}
              </h3>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto justify-end">
                
                {/* University Filter Dropdown */}
                {activeTab === 'proposals' && (
                  <select 
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm shadow-sm bg-white font-medium text-gray-700"
                  >
                    <option value="All Universities">All Universities</option>
                    <option value="Limkokwing University of Creative Technology">Limkokwing University</option>
                    <option value="University of Sierra Leone (FBC)">University of Sierra Leone (FBC)</option>
                    <option value="Njala University">Njala University</option>
                    <option value="Institute of Public Administration and Management (IPAM)">IPAM</option>
                    <option value="Other Institution">Other Institutions</option>
                  </select>
                )}

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <input 
                    type="text" 
                    placeholder={activeTab === 'proposals' ? "Search by title or student..." : "Search users by name or email..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm shadow-sm"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
            </div>

            {/* TAB 1: PROPOSALS */}
            {activeTab === 'proposals' && (
              <div className="divide-y divide-gray-100">
                {filteredProposals.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">No proposals found for this filter.</div>
                ) : (
                  filteredProposals.map((proposal) => (
                    <div key={proposal._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition">
                      <div className="md:w-1/2">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold text-gray-800">{proposal.title}</h4>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded border ${
                            proposal.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            proposal.status === 'Revisions Required' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            proposal.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {proposal.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium mb-1">
                          {proposal.student?.fullName} <span className="text-gray-400 font-normal ml-2">({proposal.student?.studentId || 'No ID'})</span>
                        </p>
                        <p className="text-xs text-green-700 bg-green-50 inline-block px-2 py-1 rounded mb-2 font-semibold">
                          {proposal.student?.university || 'University Not Set'}
                        </p>
                      </div>

                      <div className="md:w-1/2 flex flex-col md:flex-row md:items-center justify-end gap-3">
                        {proposal.supervisor ? (
                          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border border-green-200 shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Assigned to: {proposal.supervisor.fullName}
                          </div>
                        ) : (
                          <select 
                            onChange={(e) => handleAssign(proposal._id, e.target.value)}
                            defaultValue=""
                            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white shadow-sm font-medium text-gray-700"
                          >
                            <option value="" disabled>Select a Supervisor...</option>
                            {supervisors.map((sup) => (
                              <option key={sup._id} value={sup._id}>{sup.fullName} ({sup.department})</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: USERS */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold">University / Institution</th>
                      <th className="p-4 font-semibold">ID / Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan="4" className="text-center text-gray-500 py-8">No users found.</td></tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            <p className="font-bold text-gray-800">{u.fullName}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'supervisor' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-700">{u.university || 'N/A'}</td>
                          <td className="p-4 text-sm text-gray-600">
                            {u.role === 'student' ? u.studentId : u.department}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;