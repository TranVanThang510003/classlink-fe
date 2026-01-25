// hooks/useConversations.ts
'use client';

import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
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
    displayName: string;
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

        const unsub = onSnapshot(q, (snap) => {
            const items = snap.docs.map((d) => {
                const data = d.data();

                let displayName = "Unknown";

                // 🧠 Group chat
                if (data.isGroup) {
                    displayName = data.nameGroup || "Group chat";
                }
                // 🧠 1-1 chat
                else if (data.userName) {
                    const otherUserId = data.participants.find(
                        (id: string) => id !== currentUserId
                    );
                    if (otherUserId) {
                        displayName =
                            data.userName[otherUserId] || "Unknown user";
                    }
                }

                return {
                    id: d.id,
                    ...data,
                    displayName,
                } as ConversationItem;
            });

            setConversations(items);
        });

        return () => unsub();
    }, [currentUserId]);

    return conversations;
}
