'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBell } from 'react-icons/fa';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type User = {
    name?: string;
    email?: string;
};

const Header = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    /* =========================
       AUTH GUARD
    ========================= */
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                router.push('/login');
                return;
            }

            const stored = localStorage.getItem('user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        });

        return () => unsub();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem('user');
        router.push('/login');
    };

    const firstLetter = user?.name?.[0]?.toUpperCase() || '?';

    return (
        <header className="
              w-full h-14
              bg-white
              border-b border-gray-200
              shadow-sm
              flex items-center justify-between
              px-6
              relative z-20
            ">

            {/* ===== LEFT: LOGO ===== */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center text-white font-bold">
                    M
                </div>
                <span className="font-semibold text-gray-800">
                    M
                </span>
            </div>



            {/* ===== RIGHT: USER ===== */}
            <div className="flex items-center gap-5 relative">
                <FaBell className="text-gray-400 w-5 h-5 cursor-pointer"/>

                <div className="relative">
                    <div
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center font-semibold cursor-pointer"
                    >
                        {firstLetter}
                    </div>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border text-sm z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
