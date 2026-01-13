import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CreateClassPayload, Class } from "@/types/class";
import type { Unsubscribe } from "firebase/firestore";

// ✅ Tạo class
export async function createClassService(
    payload: CreateClassPayload
): Promise<string> {
    const docRef = await addDoc(collection(db, "classes"), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
}

// ✅ Subscribe danh sách class theo instructor
export function subscribeClassesByInstructor(
    instructorId: string,
    callback: (classes: Class[]) => void
): Unsubscribe {
    const q = query(
        collection(db, "classes"),
        where("instructorId", "==", instructorId)
    );

    return onSnapshot(q, (snap) => {
        const list: Class[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Class, "id">),
        }));

        callback(list);
    });
}
