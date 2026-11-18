import { useState, useEffect } from 'react';
import { API_URL, getToken, getUser, logout } from '../api';

function SupervisorDashboard() {
  const [user] = useState(getUser());
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  
  // Review form states
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState('Approved');
  const [rating, setRating] = useState(3);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProposals();
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/reviews/${selectedProposal._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ feedback, decision, rating: Number(rating) }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Review submitted successfully!');
        setFeedback('');
        setDecision('Approved');
        setRating(3);
        setSelectedProposal(null);
        fetchProposals(); // Refresh the list
      } else {
        setMessage(data.message || 'Failed to submit review');
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  // Calculate Stats
  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'Submitted' || p.status === 'Under Review').length,
    completed: proposals.filter(p => p.status === 'Approved' || p.status === 'Rejected' || p.status === 'Revisions Required').length,
  };

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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-800 text-lg font-black">SL</span>
              </div>
              <span className="text-xl font-bold tracking-wide">Research Hub</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium hidden md:block">{user?.fullName}</span>
              <button onClick={logout} className="px-4 py-2 bg-green-900 text-white text-sm font-semibold rounded-lg hover:bg-green-950 transition border border-green-700">
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 mt-8">
          
          {/* Welcome Banner & Stats */}
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Supervisor Portal</h1>
              <p className="text-gray-500">Review student proposals and guide their research journey.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-center">
                <span className="block text-xl font-black text-blue-700">{stats.pending}</span>
                <span className="text-xs font-bold text-blue-600 uppercase">Pending</span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-center">
                <span className="block text-xl font-black text-green-700">{stats.completed}</span>
                <span className="text-xs font-bold text-green-600 uppercase">Reviewed</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Proposals List */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-white drop-shadow-md mb-4">Assigned Proposals</h3>
              
              {proposals.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 text-center">
                  <p className="text-gray-500">No proposals assigned to you yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {proposals.map((proposal) => (
                    <div key={proposal._id} className={`bg-white p-6 rounded-2xl shadow-lg border transition ${selectedProposal?._id === proposal._id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-100 hover:shadow-xl'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold text-gray-800">{proposal.title}</h4>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                          proposal.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                          proposal.status === 'Revisions Required' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          proposal.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2"><strong>Student:</strong> {proposal.student?.fullName}</p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{proposal.abstract}</p>
                      
                      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                        <div>
                          {proposal.documentPath && (
                            <a href={`http://localhost:5000${proposal.documentPath}`} target="_blank" rel="noreferrer" 
                               className="text-green-700 bg-green-50 px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-100 transition inline-flex items-center gap-1">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                               View Document
                            </a>
                          )}
                        </div>
                        <button 
                          onClick={() => setSelectedProposal(proposal)}
                          className="px-5 py-2 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition text-sm shadow-md"
                        >
                          Review Proposal
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Review Form */}
            <div className="lg:col-span-1">
              {selectedProposal ? (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Review Submission</h3>
                  <p className="text-sm text-gray-500 mb-4 truncate"><strong>Reviewing:</strong> {selectedProposal.title}</p>
                  
                  {message && (
                    <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Decision</label>
                      <select 
                        value={decision} 
                        onChange={(e) => setDecision(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Revisions Required">Revisions Required</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (1-5)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="5" 
                        value={rating} 
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback</label>
                      <textarea 
                        value={feedback} 
                        onChange={(e) => setFeedback(e.target.value)} 
                        required
                        placeholder="Provide constructive feedback..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-32 transition" 
                      />
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button type="button" onClick={() => setSelectedProposal(null)} className="w-1/3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition">
                        Cancel
                      </button>
                      <button type="submit" className="w-2/3 py-2 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition shadow-md">
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 text-center flex flex-col items-center justify-center h-64 text-gray-500 sticky top-6">
                  <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p className="font-semibold">Ready to Review</p>
                  <p className="text-sm">Select a proposal from the left to begin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupervisorDashboard;