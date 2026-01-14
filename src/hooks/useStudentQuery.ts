import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Student } from "@/types/student";

/* =========================
   1️⃣ Fetch ALL students (chỉ dùng cho ADMIN)
========================= */
const fetchStudents = async (): Promise<Student[]> => {
    const q = query(
        collection(db, "users"),
        where("role", "==", "student")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Student[];
};

export const useStudents = () => {
    return useQuery({
        queryKey: ["students"],
        queryFn: fetchStudents,
    });
};

/* =========================
   2️⃣ Fetch students theo instructor (createdBy)
========================= */
const fetchStudentsByInstructor = async (
    instructorId: string
): Promise<Student[]> => {
    if (!instructorId) return [];

    const q = query(
        collection(db, "users"),
        where("role", "==", "student"),
        where("createdBy", "==", instructorId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Student[];
};

export const useStudentsByInstructor = (instructorId?: string) => {
    return useQuery({
        queryKey: ["students", "instructor", instructorId],
        queryFn: () => fetchStudentsByInstructor(instructorId!),
        enabled: !!instructorId, // 🚨 rất quan trọng
    });
};
