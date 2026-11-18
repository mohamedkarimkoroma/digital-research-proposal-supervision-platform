import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student', // Default role is student
    university: '',
    studentId: '',
    department: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const universities = [
    "Limkokwing University of Creative Technology",
    "University of Sierra Leone (FBC)",
    "Njala University",
    "Institute of Public Administration and Management (IPAM)",
    "Ernest Bai Koroma University",
    "University of Makeni (UNIMAK)",
    "Other Institution"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('/campus.jpg')] bg-cover bg-center"></div>
      
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl relative z-10 border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-green-800">Registration Portal</h2>
          <p className="mt-2 text-sm text-gray-500">Create your account to access the research platform</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">{error}</div>}

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input name="fullName" type="text" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input name="email" type="email" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input name="password" type="password" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          {/* NEW: Account Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type</label>
            <select name="role" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
              <option value="student">Student</option>
              <option value="supervisor">Supervisor / Lecturer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">University / Institution</label>
            <select name="university" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
              <option value="">Select your university...</option>
              {universities.map(uni => <option key={uni} value={uni}>{uni}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Student / Staff ID</label>
            <input name="studentId" type="text" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Faculty / Department</label>
            <input name="department" type="text" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition shadow-md">
              Register Account
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-green-700 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;