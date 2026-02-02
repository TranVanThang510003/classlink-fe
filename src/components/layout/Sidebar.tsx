'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaUsers,
  FaBook,
  FaRegCommentDots,
  FaChalkboardTeacher,
  FaClipboardCheck, FaQuestionCircle,
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

  if (!role) return null;

  /* =========================
     MENU GROUP CONFIG
  ========================= */
  const menuGroups = [

    {
      label: 'CLASS',
      highlight: true, // 👉 nhóm phụ thuộc class
      items: [
        {
          name: 'Assignments',
          icon: <FaClipboardCheck />,
          path:
              role === 'instructor'
                  ? '/instructor/assignments'
                  : '/assignments',
          roles: ['instructor', 'student'],
        },
        {
          name: 'Tests & Quiz',
          icon: <FaQuestionCircle />,
          path:
              role === 'instructor'
                  ? '/instructor/tests'
                  : '/students/tests',
          roles: ['instructor', 'student'],
        },
        {
          name: 'Documents',
          icon: <FaBook />,
          path: '/documents',
          roles: ['instructor', 'student'],
        },
      ],
    },
    {
      label: 'GLOBAL',
      highlight: false,
      items: [
        {
          name: 'Manage Classes',
          icon: <FaChalkboardTeacher />,
          path: '/instructor/manage-classes',
          roles: ['instructor'],
        },
        {
          name: 'Manage Student Accounts',
          icon: <FaUsers />,
          path: '/instructor/manage-student-accounts',
          roles: ['instructor'],
        },
      ],
    },
    {
      label: 'COMMUNICATION',
      highlight: false,
      items: [
        {
          name: 'Message',
          icon: <FaRegCommentDots />,
          path: '/chat',
          roles: ['instructor', 'student'],
        },
      ],
    },
  ];

  /* =========================
     RENDER
  ========================= */
  return (
      <aside className="w-72 h-screen bg-gradient-to-b from-[#0B1C3D] to-[#08183A] px-4 py-6">
        {/* LOGO */}
        <div className="text-white text-xl font-semibold px-3 mb-8">
          School Admin
        </div>

        <nav className="space-y-5">
          {menuGroups.map((group) => (
              <div key={group.label}>
                {/* GROUP LABEL */}
                <div className="px-4 mb-2 text-xs uppercase tracking-wider text-[#6C7AA5]">
                  {group.label}
                </div>

                {/* GROUP ITEMS */}
                <ul
                    className={
                      group.highlight
                          ? 'bg-white/5 rounded-xl py-1'
                          : ''
                    }
                >
                  {group.items
                      .filter((item) => item.roles.includes(role))
                      .map((item) => {
                        const isActive =
                            pathname === item.path ||
                            pathname.startsWith(item.path + '/');

                        return (
                            <li
                                key={item.name}
                                onClick={() => router.push(item.path)}
                                className={`
                        flex items-center gap-3 px-4 py-3 mx-1
                        rounded-lg cursor-pointer transition-all
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
              </div>
          ))}
        </nav>
      </aside>
  );
};

export default Sidebar;
