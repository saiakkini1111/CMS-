import React from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'; // Assuming CheckoutForm is in the same directory
import { STRIPE_PUBLISHABLE_KEY } from '../../config.js';

// Load the Stripe publishable key from the environment variables
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const bookingId = location.pathname.split('/')[3]; // Extract bookingId from the URL
  const totalCost = queryParams.get('totalCost'); // Get totalCost from query parameters

  return (
    <Elements stripe={stripePromise}>
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="max-w-md w-full p-5 border border-gray-300 rounded-md bg-white shadow-md">
          <h2 className="text-2xl font-bold text-center mb-5">Complete Your Payment</h2>
          <CheckoutForm bookingId={bookingId} totalCost={totalCost} />
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;
