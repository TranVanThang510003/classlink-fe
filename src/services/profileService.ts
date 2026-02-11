import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { User } from "@/types/user";

export type ClassItem = {
    id: string;
    name?: string;
};

/* ================= GET USER PROFILE ================= */
export async function getUserProfile(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data() as User;
}

/* ================= GET STUDENT CLASSES ================= */
export async function getStudentClasses(classIds: string[]): Promise<ClassItem[]> {
    const classDocs = await Promise.all(
        classIds.map((id) => getDoc(doc(db, "classes", id)))
    );

    return classDocs
        .filter((d) => d.exists())
        .map((d) => {
            const data = d.data() as any;
            return { id: d.id, name: data.name };
        });
}

/* ================= GET INSTRUCTOR CLASSES ================= */
export async function getInstructorClasses(uid: string): Promise<ClassItem[]> {
    const q = query(collection(db, "classes"), where("instructorId", "==", uid));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
        const data = d.data() as any;
        return { id: d.id, name: data.name };
    });
}
