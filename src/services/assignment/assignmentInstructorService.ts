import {
    addDoc,
    collection,
    deleteDoc,
    doc, getDocs, limit, query,
    serverTimestamp,
    updateDoc, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CreateAssignmentPayload } from "@/types/assigmentPayload";
/* ======================================================
   ASSIGNMENT
====================================================== */

/** Create assignment */
export async function createAssignment(payload: CreateAssignmentPayload
) {
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

