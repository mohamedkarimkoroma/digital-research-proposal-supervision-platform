import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      if (data.role === 'student') navigate('/student');
      else if (data.role === 'supervisor') navigate('/supervisor');
      else if (data.role === 'admin') navigate('/admin');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-green-900 items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" 
          alt="University Campus" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 text-center px-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
             <span className="text-green-800 text-3xl font-black">SL</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">Sierra Leone<br/>Research Hub</h1>
          <p className="text-green-100 text-lg max-w-md mx-auto">Empowering tertiary institutions through digital research management and seamless supervision tracking.</p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to access your research portal</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="you@university.edu.sl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition shadow-md"
            >
              Sign In to Portal
            </button>
          </form>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            © 2026 Sierra Leone Tertiary Research Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;