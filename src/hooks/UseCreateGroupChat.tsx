'use client';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export function useCreateGroupChat() {
    const createGroupChat = async ({
                                       name,
                                       teacherId,
                                       classId,
                                       studentIds,
                                   }: {
        name: string;
        teacherId: string;
        classId: string;
        studentIds: string[];
    }) => {
        try {
            const docRef = await addDoc(collection(db, "chats"), {
                isGroup: true,
                nameGroup: name,
                classId,
                createdBy: teacherId,
                participants: [teacherId, ...studentIds],
                lastMessage: "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            toast.success("Group created");
            return docRef.id;
        } catch (err) {
            toast.error("Failed to create group");
            throw err;
        }
    };

    return { createGroupChat };
}
