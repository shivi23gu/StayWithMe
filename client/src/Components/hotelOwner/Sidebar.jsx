import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // Sidebar ke links aur unke icons ka array
  const sidebarLinks = [
    { name: "Dashboard", path: "/owner/dashboard", icon: "📊" },
    { name: "Add Room", path: "/owner/add-room", icon: "➕" },
    { name: "List Room", path: "/owner/list-room", icon: "📋" },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-100 p-4 flex flex-col gap-2">
      {/* Brand Logo/Name Panel ke andar */}
      <div className="mb-8 px-4 py-2">
        <h2 className="text-xl font-bold text-gray-800">Owner Panel</h2>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1">
        {sidebarLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;