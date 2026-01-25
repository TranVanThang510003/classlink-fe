import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    getDocs,
    where,
    Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Message } from "@/types/chat";
import  type { CreateGroupChatPayload } from "@/types/chat";

export const createGroupChatService = async ({
                                                 name,
                                                 teacherId,
                                                 teacherName,
                                                 classId,
                                                 students, // [{ id, name }]
                                             }: {
    name: string;
    teacherId: string;
    teacherName: string;
    classId: string;
    students: { id: string; name: string }[];
}): Promise<string> => {

    const participants = [teacherId, ...students.map(s => s.id)];

    const userNameMap: Record<string, string> = {
        [teacherId]: teacherName,
    };

    students.forEach(s => {
        userNameMap[s.id] = s.name;
    });
    console.log("teacherName:", teacherName);
    console.log("students:", students);
    console.log("userNameMap:", userNameMap);


    const docRef = await addDoc(collection(db, "chats"), {
        isGroup: true,
        nameGroup: name,
        classId,
        createdBy: teacherId,
        participants,
        userName: userNameMap, // ✅ SNAPSHOT
        lastMessage: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
};



export function subscribeMessages(
    chatId: string,
    callback: (messages: Message[]) => void
): Unsubscribe {
    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snap) => {
        const messages = snap.docs.map(
            (d) => ({ id: d.id, ...d.data() })
        ) as Message[];

        callback(messages);
    });
}


export async function sendMessageService(
    chatId: string,
    data: {
        senderId: string;
        senderName: string; // ✅ thêm
        text: string;
        replyTo?: {
            id: string;
            text: string;
            senderId: string;
            senderName: string; // ✅ snapshot luôn
        };
    }
) {
    await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text,
        replyTo: data.replyTo || null,
        createdAt: serverTimestamp(),
    });
}
