import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../services/axiosInstance";

const FeedbackForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");

  // Fetch user data from localStorage and parse it
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User not logged in!");
      return;
    }

    try {
      const response = await axiosInstance.post("/feedback/add-feedback", {
        eventId,
        userId,
        feedbackText: comments,
        rating,
      });

      if (response.data) {
        navigate(`/all-users/events`);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        console.error("Error submitting feedback:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" max-w-lg mx-auto mt-28">
      {error && <p className="text-red-500">{error}</p>}

      <label className="block text-lg font-semibold">Rating:</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="w-full p-2 border"
      />

      <label className="block text-lg font-semibold mt-4">Comments:</label>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        className="w-full p-2 border"
        rows="4"
      ></textarea>

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-4 rounded">
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
