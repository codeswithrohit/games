/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import eye icons
const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { email, password } = formData;

      // Sign in with email and password
      await signInWithEmailAndPassword(firebase.auth(), email, password);

      // Show success toast notification
      toast.success('Login successful.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      
      router.push('/dashboard.html')
      // Redirect to dashboard or other authenticated page
      // You can use React Router or other methods to handle the redirection 
      setLoading(false); // Set loading to false after successful login
    } catch (error) {
      // Show error toast notification
      toast.error('Email and Password are incorrect ', {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false); // Set loading to false after encountering an error
    }
  };

  return (
    <div className='bg-white dark:bg-white min-h-screen flex justify-center items-center'>
    <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-white">
      <div className="px-6 py-4">
       
  
        <h3 className="mt-3 text-xl font-medium text-center text-red-300 dark:text-red-300">ADMIN LOGIN</h3>
  
        
  
        <form onSubmit={handleFormSubmit}>
          <div className="w-full mt-4">
            <input className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Email address"
              aria-label="Email Address" />
          </div>
  
          <div className="relative w-full mt-4">
              <input
                type={showPassword ? 'text' : 'password'} // Use 'text' to display password
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Password"
                aria-label="Password"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />} {/* Toggle the eye icon */}
              </div>
            </div>

  
          <div className="flex items-center justify-between mt-4">
           

            <button disabled={loading} className="px-6 text-center py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-300 rounded-lg hover:bg-red-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
  
      <ToastContainer />
    </div>
  </div>
  
  );
};

export default Login;