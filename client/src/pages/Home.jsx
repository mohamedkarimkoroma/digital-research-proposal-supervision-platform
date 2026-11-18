import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen relative flex flex-col justify-between">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(6, 78, 59, 0.85), rgba(6, 78, 59, 0.95)), url('/campus.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <div>
          {/* Navigation */}
          <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-green-800 text-xl font-black">SL</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">Research Hub</span>
            </div>
            
            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8 text-green-100 font-medium">
              <a href="#" className="hover:text-white transition">Home</a>
              <a href="#about" className="hover:text-white transition">About Platform</a>
              <a href="#contact" className="hover:text-white transition">Contact Support</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="px-5 py-2 text-white font-bold hover:text-green-300 transition">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 bg-white text-green-800 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg">
                Register
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="max-w-5xl mx-auto text-center px-6 mt-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Digital Research Proposal Submission <br/>
              <span className="text-green-300">and Supervision Tracking Platform</span>
            </h1>
            <p className="text-lg text-gray-200 mb-10 max-w-3xl mx-auto">
              A centralized digital platform for tertiary institutions in Sierra Leone. Streamlining proposals, supervision, and academic excellence across all universities.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-500 transition shadow-xl border border-green-400">
                Create an Account
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white text-green-800 text-lg font-bold rounded-xl hover:bg-gray-100 transition shadow-xl">
                Login to Portal
              </Link>
            </div>
          </div>
        </div>

        {/* About & Contact Section */}
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-white w-full">
          
          {/* About */}
          <div id="about" className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">About the Platform</h3>
            <p className="text-green-50 leading-relaxed">
              The Sierra Leone Digital Research Hub is a centralized digital platform designed to modernize academic research management across all tertiary institutions. 
              It eliminates paper-based processes, ensuring transparency, faster feedback, and secure record-keeping for students, supervisors, and university administrators. Each university operates its own secure portal, ensuring complete data isolation and privacy.
            </p>
          </div>

          {/* Contact */}
          <div id="contact" className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Contact Support</h3>
            <p className="text-green-50 mb-4">Need help accessing your account or submitting a proposal? Reach out to our support team.</p>
            <ul className="space-y-3 text-green-100">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>support@researchhub.edu.sl</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+232 76 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Ministry of Higher Education, Freetown</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-green-200 text-sm font-medium">Supported by the Ministry of Technical and Higher Education, Sierra Leone</p>
          <p className="text-green-300/50 text-xs mt-2">© 2026 National Research Hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;