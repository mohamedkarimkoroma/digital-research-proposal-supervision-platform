import { useState, useEffect } from 'react';
import { API_URL, getToken, getUser, logout } from '../api';

function StudentDashboard() {
  const [user] = useState(getUser());
  const [proposals, setProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Review modal state
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch(`${API_URL}/proposals/my`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (response.ok) setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals', error);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('keywords', keywords);
    if (file) formData.append('document', file);

    try {
      const response = await fetch(`${API_URL}/proposals`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Proposal submitted successfully!');
        setTitle(''); setAbstract(''); setKeywords(''); setFile(null);
        fetchProposals();
      } else {
        setMessage(data.message || 'Failed to submit proposal');
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  const openReviews = async (proposal) => {
    setSelectedProposal(proposal);
    setLoadingReviews(true);
    setReviews([]);
    
    try {
      const response = await fetch(`${API_URL}/reviews/proposal/${proposal._id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (response.ok) setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Calculate Stats
  const stats = {
    total: proposals.length,
    submitted: proposals.filter(p => p.status === 'Submitted').length,
    approved: proposals.filter(p => p.status === 'Approved').length,
    revisions: proposals.filter(p => p.status === 'Revisions Required').length,
  };

  // Filter proposals by search
  const filteredProposals = proposals.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen pb-12 relative">
      
      {/* Background Image with Dark Overlay */}
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
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-800 text-lg font-black">SL</span>
              </div>
              <span className="text-xl font-bold tracking-wide hidden md:block">Research Hub</span>
            </div>

            {/* Right Side: Notification, Profile, Logout */}
            <div className="flex items-center gap-5">
              
              {/* Notification Bell */}
              <button className="relative p-2 text-green-100 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-green-800"></span>
              </button>

              {/* Profile Info */}
              <div className="flex items-center gap-3 border-l border-green-700 pl-5">
                <div className="w-9 h-9 bg-green-200 rounded-full flex items-center justify-center text-green-900 font-bold shadow-inner">
                  {user?.fullName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold leading-tight">{user?.fullName}</p>
                  <p className="text-xs text-green-300 font-medium">Student</p>
                </div>
              </div>

              {/* Logout Button */}
              <button onClick={logout} className="ml-2 px-4 py-2 bg-green-900 text-white text-sm font-semibold rounded-lg hover:bg-green-950 transition border border-green-700">
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 mt-8">
          
          {/* Welcome Banner & Stats */}
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-1">{greeting}, {user?.fullName.split(' ')[0]}</h1>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  <strong>Institution:</strong> {user?.university || 'N/A'}
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                  <strong>ID:</strong> {user?.studentId || 'N/A'}
                </p>
              </div>
            </div>
            
            {/* UPDATED: Real Download User Guide Button pointing to local PDF */}
            <a 
              href="/User_Guide.pdf" 
              download="Research_Hub_Student_User_Guide.pdf"
              className="px-5 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 font-semibold rounded-lg transition border border-green-200 text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download User Guide
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-800">{stats.total}</span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">Total</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl shadow-md border border-blue-100 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-blue-700">{stats.submitted}</span>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide mt-1">Submitted</span>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl shadow-md border border-orange-100 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-orange-600">{stats.revisions}</span>
              <span className="text-sm font-medium text-orange-500 uppercase tracking-wide mt-1">Revisions</span>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-md border border-green-100 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-green-700">{stats.approved}</span>
              <span className="text-sm font-medium text-green-600 uppercase tracking-wide mt-1">Approved</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Submit Proposal Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">New Proposal</h3>
                
                {message && (
                  <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleCreateProposal} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Abstract</label>
                    <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none h-24 transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords</label>
                    <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., AI, Education"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Proposal Document</label>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition" />
                  </div>

                  <button type="submit" className="mt-2 w-full py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition shadow-md">
                    Submit Proposal
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: My Proposals List */}
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 className="text-xl font-bold text-white drop-shadow-md">My Research Submissions</h3>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                  <input 
                    type="text" 
                    placeholder="Search proposals..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm shadow-md"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
              
              {filteredProposals.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 text-center flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <h4 className="text-lg font-bold text-gray-600 mb-1">No proposals found</h4>
                  <p className="text-gray-400">Try a different search or submit a new proposal.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredProposals.map((proposal) => (
                    <div key={proposal._id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition group flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition">{proposal.title}</h4>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            proposal.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            proposal.status === 'Revisions Required' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            proposal.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {proposal.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{proposal.abstract}</p>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-center text-sm border-t border-gray-100 pt-4 mt-2 gap-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          <span>Supervisor: <strong className={proposal.supervisor ? "text-gray-800" : "text-orange-500"}>{proposal.supervisor ? proposal.supervisor.fullName : 'Pending Assignment'}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => openReviews(proposal)}
                            className="flex items-center gap-1 text-gray-700 font-semibold hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-md transition"
                          >
                            View Feedback
                          </button>

                          {proposal.documentPath && (
                            <a href={`http://localhost:5000${proposal.documentPath}`} target="_blank" rel="noreferrer" 
                               className="flex items-center gap-1 text-green-700 font-semibold hover:text-green-800 hover:underline bg-green-50 px-3 py-1 rounded-md">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                              File
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Supervisor Feedback</h3>
                <p className="text-sm text-gray-500 truncate w-64">{selectedProposal.title}</p>
              </div>
              <button onClick={() => setSelectedProposal(null)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {loadingReviews ? (
                <p className="text-center text-gray-500 py-8">Loading feedback...</p>
              ) : reviews.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No feedback has been provided yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map(review => (
                    <div key={review._id} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-800">{review.supervisor?.fullName}</p>
                          <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                          review.decision === 'Approved' ? 'bg-green-100 text-green-700' :
                          review.decision === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {review.decision}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mt-3 bg-white p-3 rounded border border-gray-100">{review.feedback}</p>
                      <div className="mt-3 flex items-center gap-1">
                        <span className="text-xs font-semibold text-gray-500">Rating:</span>
                        <div className="flex text-orange-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setSelectedProposal(null)} className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;