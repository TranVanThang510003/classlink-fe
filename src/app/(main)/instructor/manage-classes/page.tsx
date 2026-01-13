'use client';

import { useState } from "react";
import { useClasses } from "@/hooks/useClasses";
import CreateClassModal from "@/components/CreateClassModal";

const CURRENT_INSTRUCTOR_ID = "user_1"; // lấy từ auth

export default function ManageClassesPage() {
    const { classes, loading } = useClasses(CURRENT_INSTRUCTOR_ID);
    const [open, setOpen] = useState(false);

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold">My Classes</h2>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => setOpen(true)}
                >
                    + Create Class
                </button>
            </div>

            {loading && <div>Loading...</div>}

            <ul className="space-y-2">
                {classes.map((c) => (
                    <li
                        key={c.id}
                        className="p-4 border rounded bg-white"
                    >
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-gray-600 text-sm">
                            {c.description}
                        </div>
                    </li>
                ))}
            </ul>

            <CreateClassModal
                open={open}
                onClose={() => setOpen(false)}
                instructorId={CURRENT_INSTRUCTOR_ID}
            />
        </div>
    );
}
