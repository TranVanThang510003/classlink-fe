"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBell } from "react-icons/fa";
import {getUserInf} from "@/services/authService";

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<{ name?: string }>({});
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        router.push("/login");
    };

    // Kiểm tra token khi app chạy
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            // Nếu không có token mà không đang ở /login => logout
            if (pathname !== "/login") handleLogout();
            return;
        }

        // Gọi BE để xác thực token và lấy user
        const verifyToken = async () => {
            try {
                const userData = await getUserInf();
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));

            } catch (err: any) {
                console.error("Lỗi xác minh token:", err);
                // Nếu bị 401 hoặc 403 thì logout
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleLogout();
                }
            }
        };


        verifyToken();
    }, [pathname]);

    const firstLetter = user?.name?.[0]?.toUpperCase() || "?";

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

                    {/* Dropdown */}
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
