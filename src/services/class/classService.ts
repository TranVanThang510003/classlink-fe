import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { CreateClassPayload, Class } from "@/types/class";

/* =====================================================
   CREATE CLASS
===================================================== */
export async function createClassService(
    payload: CreateClassPayload
): Promise<string> {
    const docRef = await addDoc(collection(db, "classes"), {
        name: payload.name,
        description: payload.description ?? "",
        instructorId: payload.instructorId,

        studentIds: [], // 🔥 quan trọng – luôn khởi tạo

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
}

/* =====================================================
   SUBSCRIBE CLASSES BY INSTRUCTOR
===================================================== */
export function subscribeClassesByInstructor(
    instructorId: string,
    callback: (classes: Class[]) => void
): Unsubscribe {
    const q = query(
        collection(db, "classes"),
        where("instructorId", "==", instructorId)
    );

    return onSnapshot(
        q,
        (snap) => {
            const list: Class[] = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Class, "id">),
            }));

            callback(list);
        },
        (error) => {
            console.error("❌ subscribeClassesByInstructor error:", error);
        }
    );
}

/* =====================================================
   ADD STUDENT TO CLASS
===================================================== */
export async function addStudentToClass(
    classId: string,
    studentId: string
) {
    const classRef = doc(db, "classes", classId);

    await updateDoc(classRef, {
        studentIds: arrayUnion(studentId),
        updatedAt: serverTimestamp(),
    });
}

/* =====================================================
   REMOVE STUDENT FROM CLASS
===================================================== */
export async function removeStudentFromClass(
    classId: string,
    studentId: string
) {
    const classRef = doc(db, "classes", classId);

    await updateDoc(classRef, {
        studentIds: arrayRemove(studentId),
        updatedAt: serverTimestamp(),
    });
}
