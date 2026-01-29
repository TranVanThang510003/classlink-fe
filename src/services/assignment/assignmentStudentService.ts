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
