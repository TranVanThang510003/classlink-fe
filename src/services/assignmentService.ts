import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    serverTimestamp,
    updateDoc,
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
    studentId: string;
    classId: string;
    fileUrl: string;
    fileName: string;
}) {
    return addDoc(collection(db, "assignment_submissions"), {
        ...payload,
        status: "submitted",
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}