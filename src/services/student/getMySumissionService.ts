import {
    collection,
    query,
    where,
    getDocs,
    limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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
