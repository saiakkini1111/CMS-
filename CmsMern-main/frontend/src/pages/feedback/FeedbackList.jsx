import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../services/axiosInstance";

const FeedbackList = () => {
  const { eventId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch feedback for the event
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get(`/feedback/${eventId}`);
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    fetchFeedbacks();
  }, [eventId]);

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? '★' : '☆'; // Filled and empty stars
    }
    return stars;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Feedback for Event</h2>
      {feedbacks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                {/* Access user name from userId object */}
                <h3 className="text-xl font-semibold text-gray-800">
                 {feedback.userId?.name || "Anonymous"} {/* Handle if userId.name is not available */}
                </h3>
                <span className="text-yellow-500">{renderStars(feedback.rating)}</span>
              </div>
              <p className="text-gray-700 mt-2">{feedback.feedbackText}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">Rating: {feedback.rating}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No feedback available for this event.</p>
      )}
    </div>
  );
};

export default FeedbackList;
