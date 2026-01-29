'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaUsers,
  FaBook,
  FaRegCommentDots,
  FaChalkboardTeacher,
  FaClipboardCheck,
} from 'react-icons/fa';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


type UserRole = 'student' | 'instructor';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
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

      const snap = await getDoc(doc(db, 'users', user.uid));
      setRole(snap.data()?.role);
    });

    return () => unsub();
  }, []);

  /* =========================
     MENU CONFIG
  ========================= */
  const menuItems = [
    {
      name: 'Assignments',
      icon: <FaClipboardCheck />,
      path: (role: UserRole) =>
      role === 'instructor'
          ? '/instructor/assignments'
          : '/assignments',
      roles: ['instructor', 'student'],
    },
    {
      name: 'Manage Students',
      icon: <FaUsers />,
      path: '/instructor/manage-students',
      roles: ['instructor'],
    },
    {
      name: 'Manage Documents',
      icon: <FaBook />,
      path: '/documents',
      roles: ['instructor', 'student'],
    },
    {
      name: 'Manage Classes',
      icon: <FaChalkboardTeacher />,
      path: '/instructor/manage-classes',
      roles: ['instructor'],
    },
    {
      name: 'Message',
      icon: <FaRegCommentDots />,
      path: '/chat',
      roles: ['instructor', 'student'],
    },
  ];

  if (!role) return null;

  return (
      <aside className="w-72 h-screen bg-gradient-to-b from-[#0B1C3D] to-[#08183A] px-4 py-6">
        {/* LOGO / TITLE */}
        <div className="text-white text-xl font-semibold px-3 mb-8">
          School Admin
        </div>

        <nav>
          <ul className="space-y-1">
            {menuItems
                .filter((item) => item.roles.includes(role))
                .map((item) => {
                  const resolvedPath =
                      typeof item.path === 'function'
                          ? item.path(role)
                          : item.path;

                  const isActive = pathname.startsWith(resolvedPath);

                  return (
                      <li
                          key={item.name}
                          onClick={() => router.push(resolvedPath)}
                          className={`
          flex items-center gap-3 px-4 py-3
          rounded-md cursor-pointer transition-all
          ${
                              isActive
                                  ? 'bg-[#F6C21C] text-[#08183A] font-semibold'
                                  : 'text-[#A9B4D0] hover:bg-white/10 hover:text-white'
                          }
        `}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                      </li>
                  );
                })}
          </ul>
        </nav>
      </aside>
  );
};

export default Sidebar;
