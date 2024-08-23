import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firebase } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/router';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', // Changed from username to name
    // game: '',
    useremail: '',
    userpassword: '',
    time: '', // Add the time field to the formData state
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
      const { name, useremail, userpassword, time } = formData;

      const userCredential = await createUserWithEmailAndPassword(auth, useremail, userpassword);
      const userId = userCredential.user.uid;

      await firebase.firestore().collection('games').add({
        name, // Changed from username to name
        useremail,
        userId,
        // game,
        time, // Add the time field to the Firestore data
      });

      toast.success('Account created successfully. You can now sign in.', {
        position: toast.POSITION.TOP_RIGHT,
      });

      router.push(`/userdashboard/${userId}`);
    } catch (error) {
      toast.error('Error creating account. Please try again.', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoading(false);
  };

  return (
    <div className='bg-sky-100 min-h-screen flex justify-center items-center'>
      <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-blue-600">Create an Account</h3>

          <form onSubmit={handleFormSubmit}>
            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:border-blue-400"
                type="text"
                name="name" // Changed from username to name
                value={formData.name} // Changed from username to name
                onChange={handleFormChange}
                placeholder="Name" // Changed from Username to Name
                required
              />
            </div>
            {/* <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:border-blue-400"
                type="text"
                name="game"
                value={formData.game}
                onChange={handleFormChange}
                placeholder="Game Name"
                required
              />
            </div> */}
            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:border-blue-400"
                type="email"
                name="useremail"
                value={formData.useremail}
                onChange={handleFormChange}
                placeholder="Email address"
                required
              />
            </div>
            <div className="relative w-full mt-4">
              <input
                type={showPassword ? 'text' : 'password'}
                className="block w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:border-blue-400"
                name="userpassword"
                value={formData.userpassword}
                onChange={handleFormChange}
                placeholder="Password"
                required
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </div>
            </div>
            {/* Add the time input field */}
            <div className="w-full mt-4">
              <input
                type="time"
                className="block w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:border-blue-400"
                name="time"
                value={formData.time}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <button disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-sky-400 focus:outline-none focus:ring focus:ring-blue-300">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/UserLogin">
              <button className="text-blue-500">Sign In</button>
            </Link>
          </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
