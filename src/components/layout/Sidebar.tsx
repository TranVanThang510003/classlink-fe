"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaBook,
  FaRegCommentDots,
  FaChalkboardTeacher,
  FaClipboardCheck,
} from "react-icons/fa";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type UserRole = "student" | "instructor";

const Sidebar = () => {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);

  /* =========================
     LOAD USER ROLE
  ========================= */
  useEffect(() => {
    const auth = getAuth();

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setRole(null);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      setRole(snap.data()?.role);
    });

    return () => unsub();
  }, []);

  /* =========================
     MENU CONFIG
  ========================= */
  const menuItems = [
    {
      name: "Manage Students",
      icon: <FaUsers className="text-[#ff6500]" />,
      path: "/instructor/manage-students",
      roles: ["instructor"],
    },
    {
      name: "Manage Assignments",
      icon: <FaClipboardCheck className="text-[#ff6500]" />,
      path: "/assignments",
      roles: ["instructor", "student"],
    },
    {
      name: "Manage Documents",
      icon: <FaBook className="text-[#ff6500]" />,
      path: "/documents",
      roles: ["instructor", "student"],
    },
    {
      name: "Manage Classes",
      icon: <FaChalkboardTeacher className="text-[#ff6500]" />,
      path: "/instructor/manage-classes",
      roles: ["instructor"],
    },
    {
      name: "Message",
      icon: <FaRegCommentDots className="text-[#ff6500]" />,
      path: "/chat",
      roles: ["instructor", "student"],
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (!role) return null; // ⛔ chờ load role

  return (
      <div className="w-72 flex-shrink-0 h-screen p-6 flex flex-col">
        <nav className="mt-5">
          <ul>
            {menuItems
                .filter((item) => item.roles.includes(role))
                .map((item) => (
                    <li
                        key={item.name}
                        className="flex items-center text-[#2C7BE5] p-3 mt-2 rounded-sm cursor-pointer bg-[#E7F1FF] border-r-4 border-[#2C7BE5] shadow font-semibold hover:scale-105 transition-all duration-200"
                        onClick={() => handleNavigation(item.path)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </li>
                ))}
          </ul>
        </nav>
      </div>
  );
};

export default Sidebar;
