"use client";

import { Button, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useMyClasses } from "@/hooks/class/useMyClasses";
import { useMyLearningClasses } from "@/hooks/class/useMyLearningClasses";
import { useAssignmentsByClass } from "@/hooks/assigment/useAssignmentsByClass";

import AssignmentList from "@/components/assigments/AssignmentList";
import CreateAssignmentModal from "@/components/assigments/CreateAssignmentModal";

export default function AssignmentManagementPage() {
    const [classId, setClassId] = useState<string>();
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<"student" | "instructor" | null>(null);
    const [openCreate, setOpenCreate] = useState(false);

    const auth = getAuth();
    console.log(auth);

    // 🔐 Auth
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const snap = await getDoc(
                    doc(db, "users", firebaseUser.uid)
                );
                setRole(snap.data()?.role ?? null);
            }
        });

        return () => unsub();
    }, []);

    // 👨‍🏫 Instructor
    const teachingClasses = useMyClasses(
        role === "instructor" ? user?.uid : undefined
    );

    // 👩‍🎓 Student
    const learningClasses = useMyLearningClasses(
        role === "student" ? user?.uid : undefined
    );

    const classes =
        role === "instructor" ? teachingClasses : learningClasses;

    const { assignments, loading } = useAssignmentsByClass(
        classId,
        role ?? "student"
    );


    // ⏳ Loading
    if (!user || !role) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* ===== HEADER ===== */}
            <div>
                <h2 className="text-3xl font-semibold mb-6">
                    {role === "instructor"
                        ? "Manage Assignments"
                        : "My Assignments"}
                </h2>

                <div className="flex gap-3 justify-end">
                    <Select
                        placeholder="Select class"
                        value={classId}
                        onChange={setClassId}
                        className="w-64"
                        options={classes.map((c) => ({
                            label: c.name,
                            value: c.id,
                        }))}
                    />

                    {/* ❌ Student không được tạo bài */}
                    {role === "instructor" && (
                        <Button
                            type="primary"
                            onClick={() => setOpenCreate(true)}
                            disabled={!classId}
                        >
                            + Create Assignment
                        </Button>
                    )}
                </div>
            </div>

            {/* ===== CONTENT ===== */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : classId ? (
                <AssignmentList assignments={assignments} />
            ) : (
                <div className="text-center text-gray-400 italic mt-10">
                    Please select a class
                </div>
            )}

            {/* ===== MODAL (Instructor only) ===== */}
            {role === "instructor" && (
                <CreateAssignmentModal
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    classId={classId}
                />
            )}
        </div>
    );
}
