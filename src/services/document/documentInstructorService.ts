import {addDoc, collection, deleteDoc, doc, serverTimestamp,
    updateDoc,
    onSnapshot,
    orderBy,
    query,
    where,} from "firebase/firestore";
import {db} from "@/lib/firebase";
import { UploadDocumentPayload} from "@/types/document";


export async function uploadDocument(payload: UploadDocumentPayload) {
    return addDoc(collection(db, "documents"), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}


export async function updateDocument(
    documentId: string,
    data: Partial<{
        title: string;
        description: string;
        status: "draft" | "published";
    }>
) {
    return updateDoc(doc(db, "documents", documentId), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export function publishDocument(documentId: string) {
    return updateDocument(documentId, { status: "published" });
}

export function unpublishDocument(documentId: string) {
    return updateDocument(documentId, { status: "draft" });
}

export async function deleteDocument(documentId: string) {
    return deleteDoc(doc(db, "documents", documentId));
}







export function subscribeInstructorDocumentsByClass(
    classId: string,
    callback: (docs: any[]) => void,
    onError?: () => void
) {
    const q = query(
        collection(db, "documents"),
        where("classId", "==", classId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(
        q,
        (snap) => {
            const data = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(data);
        },
        onError
    );
}


