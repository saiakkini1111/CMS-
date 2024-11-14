import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading';
import {axiosInstance} from '../../services/axiosInstance';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(''); // State to hold the error message
    const [loading, setLoading] = useState(false); // State to manage loading status
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message on new submission
        setLoading(true); // Set loading to true before making the request
        try {
            await axiosInstance.post('/users/forgot-password', { email });
            // Navigate to OTP page
            navigate('/otp-verification',{state:{email}});
        } catch (error) {
            // Check if the error has a response and set the error message accordingly
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Error sending OTP. Please try again later.');
            } else {
                setError('Error sending OTP. Please try again later.'); // Fallback error message
            }
        } finally {
            setLoading(false); // Reset loading state regardless of success or failure
        }
    };

    // If loading, show the loader
    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-200 via-gray-300 to-purple-300">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message */}

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
