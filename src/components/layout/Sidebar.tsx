"use client";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBook,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const router= useRouter()
  const menuItems = [
    { name: "Manage Students", icon: faUsers, path: "/instructor/manage-students" },
    { name: "Manage Lessons", icon: faBook, path: "/instructor/manage-lessons" },
    { name: "Message", icon: faMessage, path: "/instructor/message" },

  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-72 flex-shrink-0 h-screen p-6 flex flex-col justify-between ">
      <div>
        <nav className="mt-5">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.name}
                className="flex items-center text-[#2C7BE5] p-3 mt-2 rounded-sm cursor-pointer transition bg-[#E7F1FF] border-r-3 border-[#2C7BE5] shadow font-semibold hover:scale-105 transform transition-all duration-200"
                onClick={() => handleNavigation(item.path)}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-[#ff6500] "
                />
                <span className="ml-3">{item.name}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

    </div>
  );
};

export default Sidebar;
