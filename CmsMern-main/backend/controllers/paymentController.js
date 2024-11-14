import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body; // Extract amount and currency from the request body

  try {
    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret }); // Return the client secret
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
};
