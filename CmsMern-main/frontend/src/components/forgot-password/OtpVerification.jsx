import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../services/axiosInstance';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [resendEnabled, setResendEnabled] = useState(false);
    const [timer, setTimer] = useState(60); // 1-minute countdown
    const [error, setError] = useState(''); // State for error messages
    const location = useLocation();
    console.log(location);
    
    const {email} = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(countdown); // Cleanup interval
        } else {
            setResendEnabled(true); // Enable the resend button after timer ends
        }
    }, [timer]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message on new submission
        try {
            const response = await axiosInstance.post('/users/verify-otp', { otp });
            // Navigate to update password page if OTP is valid
            navigate(`/update-password`,{state: {email}}); // Assuming you have a route to update the password
        } catch (error) {
            // Check if the error has a response and set the error message accordingly
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Invalid OTP. Please try again.'); // Update error message
            } else {
                setError('An unexpected error occurred. Please try again later.'); // Fallback error message
            }
        }
    };

    const handleResendOtp = async () => {
        try {
            await axiosInstance.post('/users/resend-otp', { email });
            setResendEnabled(false);
            setTimer(60); // Reset the timer after resending OTP
            setError(''); // Reset error message on resend
        } catch (error) {
            console.error(error);
            setError('Error resending OTP. Please try again later.'); // Set error message
        }
    };

    // Format time to mm:ss
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-200 via-gray-300 to-purple-300">
            <form 
                onSubmit={handleOtpSubmit} 
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">OTP Verification</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message */}

                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP"
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Conditionally display the timer or the resend button */}
                {!resendEnabled ? (
                    <p className="text-center text-gray-500 mb-4">
                        Resend available in: <span className="font-bold">{formatTime(timer)}</span>
                    </p>
                ) : (
                    <button 
                        type="button" 
                        onClick={handleResendOtp}
                        className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200 mb-4"
                    >
                        Resend OTP
                    </button>
                )}

                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Submit OTP
                </button>
            </form>
        </div>
    );
};

export default OtpVerification;
