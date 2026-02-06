'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBell } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import { useAuthContext } from '@/contexts/AuthContext';
import { useClassContext } from '@/contexts/ClassContext';

const Header = () => {
    const router = useRouter();
    const { loading, isLoggedIn, profile } = useAuthContext();
    const { classes, activeClassId, setActiveClassId } =
        useClassContext();

    const [showMenu, setShowMenu] = useState(false);

    /* AUTH GUARD */
    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push('/login');
        }
    }, [loading, isLoggedIn]);

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem('activeClassId');
        router.replace('/login');

    };

    const firstLetter =
        profile?.name?.[0]?.toUpperCase() ?? '?';

    if (loading) return null;

    return (
        <header className="w-full h-14 bg-white z-50 shadow-sm flex items-center justify-between px-6">
            {/* LEFT */}
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center text-white font-bold">
                    M
                </div>

                {classes.length > 0 && (
                    <select
                        value={activeClassId ?? ''}
                        onChange={(e) => setActiveClassId(e.target.value)}
                        className="border rounded-md px-3 py-1 text-sm"
                    >
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">
                <FaBell className="text-gray-400 w-5 h-5 cursor-pointer" />

                <div
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center cursor-pointer"
                >
                    {firstLetter}
                </div>

                {showMenu && (
                    <div className="absolute mt-3 right-6 top-14 w-36 bg-white rounded shadow border-yellow-300 border text-sm">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
