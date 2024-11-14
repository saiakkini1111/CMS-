import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/axiosInstance";
import { AiFillDelete } from "react-icons/ai";

function AllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users");
      setAllUsers(data);
      setFilteredUsers(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Could not fetch users. Please try again.");
    }
  };

  const handleFilterChange = (role) => {
    setRoleFilter(role);
    if (role === "") {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(allUsers.filter((user) => user.role === role));
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setAllUsers(allUsers.filter((user) => user._id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
      setError(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Could not delete user. Please try again.");
    }
  };

  // Displaying error in the UI
  if (error) {
    return <div className="error">{error}</div>; // Display error message
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Manage Users</h1>

      {/* Role filter dropdown */}
      <div className="flex justify-end mb-4">
        <label htmlFor="roleFilter" className="mr-2 text-lg font-medium">
          Filter by Role:
        </label>
        <select
          id="roleFilter"
          value={roleFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All</option>
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative bg-white shadow-md rounded-lg p-4 border border-gray-300 overflow-hidden"
          >
            <AiFillDelete
              className="absolute top-2 right-2 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
              onClick={() => handleDeleteUser(user._id)}
              size={20}
              data-testid={`${user._id}`}
            />
            <div className="text-start mt-4 break-words">
              <h2 className="text-gray-800">
                <span className="text-lg font-semibold">Name:</span> {user.name}
              </h2>
              <p className="text-gray-600">
                <span className="text-lg font-semibold">Email:</span>{" "}
                {user.email}
              </p>
              <p className="text-gray-500">
                <span className="text-lg font-semibold">Role:</span> {user.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUsers;
