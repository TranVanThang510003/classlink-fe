// hooks/useConversations.ts
'use client';
import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ConversationItem = {
    id: string;
    participants: string[];
    lastMessage?: string;
    updatedAt: any;

    isGroup?: boolean;
    nameGroup?: string;
    userName?: Record<string, string>;
};

export function useConversations(currentUserId: string) {
    const [conversations, setConversations] = useState<ConversationItem[]>([]);

    useEffect(() => {
        if (!currentUserId) return;

        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", currentUserId),
            orderBy("updatedAt", "desc")
        );

        const unsub = onSnapshot(q, async (snap) => {
            const items = snap.docs.map(
                (d) => ({ id: d.id, ...d.data() })
            ) as ConversationItem[];

            // 🔹 lấy tất cả userId trong các cuộc chat
            const userIds = Array.from(
                new Set(items.flatMap((c) => c.participants))
            );

            // 🔹 query users
            const userSnap = await getDocs(
                query(
                    collection(db, "users"),
                    where("__name__", "in", userIds)
                )
            );

            const userNameMap: Record<string, string> = {};
            userSnap.docs.forEach((d) => {
                userNameMap[d.id] = d.data().name;
            });

            // 🔹 gắn tên vào conversation
            setConversations(
                items.map((c) => ({
                    ...c,
                    userName: userNameMap,
                }))
            );
        });

        return () => unsub();
    }, [currentUserId]);

    return conversations;
}
