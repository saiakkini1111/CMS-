import express from 'express';
import { getUsers,getRoleCounts, getUserProfile, sendOtp, verifyOtp, updatePassword, resendOtp, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:userId').delete(protect,admin,deleteUser);
router.route('/profile').get(protect, getUserProfile);


// Forgot password routes
router.post('/forgot-password', sendOtp);       // Send OTP
router.post('/verify-otp', verifyOtp);          // Verify OTP
router.post('/update-password', updatePassword); // Update password
router.post('/resend-otp', resendOtp);    
router.get('/roles/counts', protect, getRoleCounts);

export default router;
