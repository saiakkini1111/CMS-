import React from 'react';
import LandingPageBackground from '../assets/landingpagebg.jpg'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const handleGetStarted = () =>{
    navigate('/signup');
  }

  const handleSignIn = () =>{
    navigate('/login');
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${LandingPageBackground})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Manage Your Events Seamlessly
          </h1>
          <p className="text-white text-lg md:text-xl mb-6">
            Effortlessly plan and manage Events with ticketing, attendee registration, and more.
          </p>
          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer" onClick={handleGetStarted}>
              Get Started
            </button>
            <button className="bg-gray-100 text-blue-600 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-300 transition duration-300 cursor-pointer" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-16 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Key Features of Our Conference Management System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Easy Event Creation</h3>
              <p className="text-gray-600">
                Create and manage events effortlessly with our user-friendly interface.
              </p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Seamless Ticketing</h3>
              <p className="text-gray-600">
                Sell and manage tickets with built-in payment integrations.
              </p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Real-Time Analytics</h3>
              <p className="text-gray-600">
                Track attendees, ticket sales, and performance metrics in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Plan Your Next Conference?
          </h2>
          <p className="text-lg mb-8">
            Sign up today and start organizing events effortlessly.
          </p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-200 transition duration-300 cursor-pointer" onClick={handleGetStarted}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <p className="text-sm">© 2024 Conference Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
