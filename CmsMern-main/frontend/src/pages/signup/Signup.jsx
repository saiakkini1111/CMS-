import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SignupImage from '../../assets/signup.jpg'; // You can replace with your signup image
import { axiosInstance } from "../../services/axiosInstance";

const Signup = () => {
  useEffect(() => {
    document.title = "Sign Up"; // Matches test title expectation
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      general: "",
    };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must contain at least 8 characters, one uppercase, one number, and one special character";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateInputs()) {
      try {
        const response = await axiosInstance.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        if (response.data) {
          navigate('/login');
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          general: error.response?.data?.message || "Signup failed! Please try again."
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-blue-300 to-purple-300">
      <div className="flex flex-col md:flex-row shadow-xl rounded-lg overflow-hidden w-4/5 max-w-4xl">
        <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
          <img src={SignupImage} alt="Signup" className="object-cover h-full" />
        </div>
        <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Welcome! 🎉</h2>
              <p className="text-gray-500">Create your account to get started.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="mb-4">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="attendee">Attendee</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Sign Up
              </button>

              {errors.general && (
                <p className="text-red-500 text-sm text-center mt-4">{errors.general}</p>
              )}
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-500">
                Already have an account?{" "}
                <NavLink to="/login" className="text-blue-500 hover:underline">
                  Login
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
