"use client";

import { Spin, Tag } from "antd";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import SubmitAssignment from "@/components/assigments/SubmitAssignment";
import { useAssignment } from "@/hooks/useAssignment";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function AssignmentDetailPage() {
    const params = useParams();
    const assignmentId = params?.assignmentId as string;

    // 🔹 assignment
    const { assignment, loading: assignmentLoading } =
        useAssignment(assignmentId);

    // 🔹 auth
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setAuthLoading(false);
                return;
            }

            const snap = await getDoc(
                doc(db, "users", firebaseUser.uid)
            );

            setUser({
                uid: firebaseUser.uid,
                ...snap.data(),
            });

            setAuthLoading(false);
        });

        return () => unsub();
    }, []);

    // ⏳ CHỜ CẢ 2
    if (assignmentLoading || authLoading) {
        return (
            <div className="flex justify-center mt-24">
                <Spin size="large" />
            </div>
        );
    }

    if (!assignment) return null;

    const role = user?.role;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    {assignment.title}
                </h1>

                <div className="flex gap-3 text-sm text-gray-500 mt-2">
                    <Tag color={assignment.status === "published" ? "green" : "orange"}>
                        {assignment.status.toUpperCase()}
                    </Tag>

                    {assignment.dueDate && (
                        <span>
                            Due:{" "}
                            <b>
                                {dayjs(assignment.dueDate).format("DD/MM/YYYY HH:mm")}
                            </b>
                        </span>
                    )}
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="rounded-xl border bg-white p-6">
                {assignment.description || (
                    <span className="italic text-gray-400">
                        No description provided.
                    </span>
                )}
            </div>

            {/* ATTACHMENTS */}
            {assignment.attachments?.length > 0 && (
                <div className="rounded-xl border bg-white p-6 space-y-2">
                    {assignment.attachments.map((file) => (
                        <a
                            key={file.fileUrl}
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600"
                        >
                            {file.fileName}
                        </a>
                    ))}
                </div>
            )}

            {/* ✅ SUBMIT (CHỈ STUDENT) */}
            {role === "student" && (
                <div className="rounded-xl border bg-white p-6">
                    <SubmitAssignment
                        assignmentId={assignment.id}
                        classId={assignment.classId}
                    />
                </div>
            )}
        </div>
    );
}
