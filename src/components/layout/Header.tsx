"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type User = {
    name?: string;
    email?: string;
};

const Header = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    // 🔐 Firebase Auth Guard
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                router.push("/login");
                return;
            }

            // Lấy info từ localStorage (đã lưu lúc verify OTP)
            const stored = localStorage.getItem("user");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        });

        return () => unsub();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("user");
        router.push("/login");
    };

    const firstLetter = user?.name?.[0]?.toUpperCase() || "?";

    return (
        <div className="w-full py-4 relative">
            <div className="flex gap-2 justify-end items-center px-6">
                <FaBell className="text-gray-400 w-7 h-7" />

                <div className="relative">
                    <div
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-10 h-10 rounded-full bg-orange-400 text-white flex items-center justify-center text-lg font-semibold cursor-pointer"
                    >
                        {firstLetter}
                    </div>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border p-2 z-10">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
