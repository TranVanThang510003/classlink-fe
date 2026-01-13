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
                                                 classId,
                                                 studentIds,
                                             }: CreateGroupChatPayload): Promise<string> => {
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

    return onSnapshot(q, async (snap) => {
        const raw = snap.docs.map(
            (d) => ({ id: d.id, ...d.data() })
        ) as Message[];

        const userIds = Array.from(
            new Set(
                raw.flatMap((m) =>
                    [m.senderId, m.replyTo?.senderId].filter(Boolean)
                )
            )
        ) as string[];

        let nameMap: Record<string, string> = {};

        if (userIds.length > 0) {
            const userSnap = await getDocs(
                query(
                    collection(db, "users"),
                    where("__name__", "in", userIds)
                )
            );

            userSnap.docs.forEach((d) => {
                nameMap[d.id] = d.data().name;
            });
        }

        callback(
            raw.map((m) => ({
                ...m,
                senderName: nameMap[m.senderId] ?? m.senderId,
            }))
        );
    });
}

export async function sendMessageService(
    chatId: string,
    data: {
        senderId: string;
        text: string;
        replyTo?: {
            id: string;
            text: string;
            senderId: string;
        };
    }
) {
    await addDoc(collection(db, "chats", chatId, "messages"), {
        ...data,
        replyTo: data.replyTo || null,
        createdAt: serverTimestamp(),
    });
}
