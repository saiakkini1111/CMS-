import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { axiosInstance } from "../../services/axiosInstance";
import {
  getUserInfo,
  isAdmin,
  isOrganizer,
} from "../../services/localStorageInfo";

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [uniqueOrganizers, setUniqueOrganizers] = useState([]);
  const [colorsLine, setColorsLine] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const COLORS = ["#8884d8", "#82ca9d"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        if (isAdmin()) {
          const userResponse = await axiosInstance.get("/users/roles/counts");
          setUserData(userResponse.data);

          const eventResponse = await axiosInstance.get(
            "/events/attendee-counts"
          );
          const eventData = eventResponse.data;
          setEventsData(eventData);

          const organizers = [
            ...new Set(eventData.map((event) => event.organizer)),
          ];
          setUniqueOrganizers(organizers);

          setColorsLine(generateColors(organizers.length));
        } else if (isOrganizer()) {
          const eventResponse = await axiosInstance.get(
            `/events/organizer/${getUserInfo()._id}/attendee-counts`
          );
          setEventsData(eventResponse.data);
          setColorsLine(["#8884d8"]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    ); // Display loading message while data is being fetched
  }

  if ((isAdmin() && userData.length === 0 && eventsData.length === 0) || (isOrganizer() && eventsData.length === 0)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">No Data Found</p>
      </div>
    ); // Display no data found message
  }

  const generateColors = (count) => {
    return Array.from(
      { length: count },
      () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );
  };

  const augmentedEventsData = uniqueOrganizers.flatMap((organizer) => {
    const events = eventsData.filter((event) => event.organizer === organizer);
    return events.length > 1
      ? events
      : [...events, { name: "events", attendees: 0, organizer }];
  });

  return (
    <>
      <h1 className="text-3xl text-center font-semibold mb-4">Dashboard</h1>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className={`flex ${eventsData.length ? "flex-col md:flex-row" : "justify-center"} items-center gap-24 w-full`}>
          {/* Render PieChart only if user is admin */}
          {isAdmin() && (
            <div className={`flex flex-col justify-center items-center ${eventsData.length ? "w-full md:w-[400px]" : "w-[400px]"} h-[400px]`}>
              <PieChart width={400} height={400}>
                <Pie
                  data={userData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
              <p className="text-center mt-2">User Role Distribution</p>
            </div>
          )}

          {/* Render LineChart for Admin with multiple organizers */}
          {isAdmin() && eventsData.length > 0 && (
            <div className="flex flex-col justify-center items-center w-full md:w-[500px] h-[400px]">
              <ResponsiveContainer>
                <LineChart
                  data={augmentedEventsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    label={{
                      value: "Event Names",
                      position: "insideBottomRight",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Number of Attendees",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const { payload } = props;
                      return [
                        `Attendees: ${value}`,
                        `Organizer: ${payload.organizer}`,
                      ];
                    }}
                  />
                  <Legend />

                  {uniqueOrganizers.map((organizer, index) => (
                    <Line
                      key={organizer}
                      type="monotone"
                      dataKey="attendees"
                      stroke={colorsLine[index % colorsLine.length]}
                      activeDot={{ r: 8 }}
                      data={augmentedEventsData.filter((event) => event.organizer === organizer)}
                      name={organizer}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center mt-2">Attendees per Event by Organizer</p>
            </div>
          )}

          {/* Render LineChart for Organizer */}
          {isOrganizer() && eventsData.length > 0 && (
            <div className="flex flex-col justify-center items-center w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={eventsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    label={{
                      value: "Event Names",
                      position: "insideBottomRight",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Number of Attendees",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip formatter={(value) => [`Attendees: ${value}`]} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center mt-2">Your Events Attendee Count</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
