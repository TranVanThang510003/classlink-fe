"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";

const Header = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ name?: string }>({});
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Lỗi parse user:", err);
            }
        }
    }, []);

    const firstLetter = user?.name?.[0]?.toUpperCase() || "?";

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        router.push("/login"); // chuyển hướng về trang login
    };

    return (
        <div className="w-full py-4 relative">
            <div className="flex gap-2 justify-end items-center px-6">
                <FaBell className="text-gray-400 w-7 h-7" />

                {/* Avatar */}
                <div className="relative">
                    <div
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-10 h-10 rounded-full bg-orange-400 text-gray-50 flex items-center justify-center text-lg font-semibold cursor-pointer select-none"
                        title={user?.name || "User"}
                    >
                        {firstLetter}
                    </div>

                    {/* Dropdown menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border p-2 z-10">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700"
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
