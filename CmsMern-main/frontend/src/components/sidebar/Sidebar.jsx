import React, { useState, useEffect } from "react";
import Control from "../../assets/control.png";
import Logo from "../../assets/logo.png";
import { MdOutlineEventNote } from "react-icons/md";
import { IoManSharp } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { getUserInfo, removeUserInfo } from "../../services/localStorageInfo";
import axios from 'axios'; // Import axios
import { axiosInstance } from "../../services/axiosInstance";

function Sidebar({ role }) {
    const [open, setOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState(""); // Track the active menu
    const [unreadCount, setUnreadCount] = useState(0); // State for unread count
    const navigate = useNavigate();

    const Menus = {
        admin: [
            { title: "Dashboard", icon: <RxDashboard />, url: () => navigate("/all-users/dashboard") },
            { title: "Events", icon: <MdOutlineEventNote />, url: () => navigate("/all-users/events") },
            { title: "Users", icon: <IoManSharp />, url: () => navigate("/all-users/users") },
            { title: "LogOut", icon: <CiLogout />, url: () => {
                    removeUserInfo();
                    navigate("/login");
                }
            },
        ],
        attendee: [
            { title: "Events", icon: <MdOutlineEventNote />, url: () => navigate("/all-users/events") },
            { title: "My Events", icon: <IoManSharp />, url: () => navigate("/all-users/myevents") },
            { title: "Notifications", icon: <IoNotifications />, url: () => navigate("/all-users/notifications") },
            { title: "LogOut", icon: <CiLogout />, url: () => {
                    removeUserInfo();
                    navigate("/login");
                }
            },
        ],
        organizer: [
            { title: "Dashboard", icon: <RxDashboard />, url: () => navigate("/all-users/dashboard") },
            { title: "Events", icon: <MdOutlineEventNote />, url: () => navigate("/all-users/events") },
            { title: "Attendees", icon: <IoManSharp />, url: () => navigate("/all-users/attendee-management") },
            { title: "Notifications", icon: <IoNotifications />, url: () => navigate("/all-users/notifications") },
            { title: "LogOut", icon: <CiLogout />, url: () => {
                    removeUserInfo();
                    navigate("/login");
                }
            },
        ],
    };

    const handleMenuClick = (title, url) => {
        setActiveMenu(title); // Set the clicked item as active
        url(); // Navigate to the menu URL
    };

    // Fetch count of unread notifications when the component mounts
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axiosInstance.get('/notifications/unread-count');
                setUnreadCount(response.data.count); // Assuming the API response has a count property
            } catch (error) {
                console.error("Failed to fetch unread notifications count", error);
            }
        };

        fetchUnreadCount();
    }, []);

    return (
        <div className={`flex min-h-screen`}>
            <div className={`${open ? "w-60" : "w-20"} h-full bg-purple-950 p-5 pt-8 duration-300 relative`}>
                <img
                    src={Control}
                    alt="Control"
                    className={`absolute cursor-pointer rounded-full -right-3 top-9 w-7 border-2 bg-purple-950 ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                />
                <div className="flex gap-x-4 items-center">
                    <img src={Logo} alt="Logo" className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`} />
                    <h1 className={`text-white origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>{getUserInfo().name}</h1>
                </div>
                <ul className="pt-6">
                    {Menus[role]?.map((menu, index) => (
                        <li
                            key={index}
                            onClick={() => handleMenuClick(menu.title, menu.url)}
                            className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 rounded-md hover:bg-slate-800 ${
                                activeMenu === menu.title ? "bg-slate-800" : "" // Highlight if active
                            }`}
                        >
                            <div className="flex items-center gap-x-4">
                                <span>{menu.icon}</span>
                                <span className={`${!open && "hidden"} origin-left duration-200`}>{menu.title}</span>
                            </div>
                            {menu.title === "Notifications" && open && unreadCount > 0 && ( // Show count for notifications
                                <span className="bg-red-500 text-white rounded-full px-2 text-xs">{unreadCount}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
