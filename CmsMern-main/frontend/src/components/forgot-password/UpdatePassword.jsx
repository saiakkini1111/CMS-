import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../services/axiosInstance';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const  location= useLocation(); // Get email from URL
    const { email } = location.state; 
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const validatePassword = (password) => {
        const minLength = 8; // Minimum length requirement
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long.';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!hasDigit) {
            return 'Password must contain at least one digit.';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validatePassword(password);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await axiosInstance.post('/users/update-password', { email, password }); // Send email along with new password
            // Navigate to login or success page
            navigate('/login'); // Assuming you want to redirect to login after password update
        } catch (error) {
            console.error(error);
            setError('Failed to update password. Please try again.'); // Show an error message
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-200 via-gray-300 to-purple-300">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Update Password</h2>
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message */}
                
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="New Password" 
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="Confirm New Password" 
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default UpdatePassword;
