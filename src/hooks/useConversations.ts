// hooks/useConversations.ts
'use client';
import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    DocumentData,
    QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ConversationItem = {
    id: string;
    participants: string[];
    lastMessage?: string;
    updatedAt?: any;
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

        const unsub = onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
            const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ConversationItem[];
            setConversations(items);
        });

        return () => unsub();
    }, [currentUserId]);

    return conversations;
}
