import {
    addDoc,
    collection,
    deleteDoc,
    doc, getDocs, limit, query,
    serverTimestamp,
    updateDoc, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ======================================================
   ASSIGNMENT
====================================================== */

/** Create assignment */
export async function createAssignment(payload: {
    classId: string;
    title: string;
    description?: string;
    attachments?: {
        fileUrl: string;
        fileName: string;
        fileType: string;
        fileSize: number;
    }[];
    dueDate?: Date | null;
    createdBy: string;
}) {
    return addDoc(collection(db, "assignments"), {
        ...payload,
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

/** Update assignment */
export async function updateAssignment(
    assignmentId: string,
    data: Partial<{
        title: string;
        description: string;
        dueDate: Date | null;
        status: "draft" | "published";
    }>
) {
    return updateDoc(doc(db, "assignments", assignmentId), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

/** Publish assignment */
export function publishAssignment(assignmentId: string) {
    return updateAssignment(assignmentId, { status: "published" });
}

/** Unpublish assignment */
export function unpublishAssignment(assignmentId: string) {
    return updateAssignment(assignmentId, { status: "draft" });
}

/** Delete assignment */
export async function deleteAssignment(assignmentId: string) {
    return deleteDoc(doc(db, "assignments", assignmentId));
}


/* ======================================================
   ASSIGNMENT SUBMISSION
====================================================== */

export async function submitAssignment(payload: {
    assignmentId: string;
    classId: string; // 🔥 BẮT BUỘC
    content: string;
    attachments: any[];
    submittedBy: string;
}) {
    const docData = {
        assignmentId: payload.assignmentId,
        classId: payload.classId,

        content: payload.content || "",

        attachments: payload.attachments ?? [],

        submittedBy: payload.submittedBy,
        submittedAt: serverTimestamp(),

        // ❌ KHÔNG thêm score, teacherComment lúc submit
    };
    console.log("SUBMIT PAYLOAD:", payload);

    return addDoc(
        collection(db, "assignmentSubmissions"),
        docData
    );
}
export async function getMyAssignmentSubmission(
    assignmentId: string,
    userId: string
) {
    const q = query(
        collection(db, "assignmentSubmissions"),
        where("assignmentId", "==", assignmentId),
        where("submittedBy", "==", userId),
        limit(1)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    return {
        id: snap.docs[0].id,
        ...snap.docs[0].data(),
    };
}
