import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ bookingId, totalCost }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { data: { clientSecret } } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        amount: totalCost * 100,
        currency: 'usd',
      });

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, {
          paymentStatus: 'Paid',
        });
        navigate('/all-users/confirmation', { state: { bookingId } });
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      setMessage('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '18px',
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#e53e3e',
      },
    },
  };

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Enter Your Card Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Number Field */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Card Number</label>
          <div className="p-4 border rounded-lg bg-gray-100">
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        {/* Expiry Date Field */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Expiry Date</label>
          <div className="p-4 border rounded-lg bg-gray-100">
            <CardExpiryElement options={cardStyle} />
          </div>
        </div>

        {/* CVC Field */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">CVC</label>
          <div className="p-4 border rounded-lg bg-gray-100">
            <CardCvcElement options={cardStyle} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={isLoading}
          className={`w-full py-4 mt-4 text-white font-bold rounded-lg ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          type="submit"
        >
          {isLoading ? 'Processing...' : `Pay $${totalCost}`}
        </button>

        {/* Message display */}
        {message && (
          <div
            className={`text-center mt-4 p-3 rounded ${
              message.includes('succeeded') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
