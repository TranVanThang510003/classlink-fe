// hooks/useMessages.ts
'use client';
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs, where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Message } from "@/types/chat";


export function useMessages(chatId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const raw = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() })
      ) as Message[];

      // 🔹 collect senderIds
      const userIds = Array.from(
          new Set(
              raw.flatMap((m) => [
                m.senderId,
                m.replyTo?.senderId,
              ].filter(Boolean) as string[])
          )
      );

      // 🔹 fetch users
      const userSnap = await getDocs(
          query(
              collection(db, 'users'),
              where('__name__', 'in', userIds)
          )
      );

      const nameMap: Record<string, string> = {};
      userSnap.docs.forEach((d) => {
        nameMap[d.id] = d.data().name;
      });

      // 🔹 attach senderName
      const msgs = raw.map((m) => ({
        ...m,
        senderName: nameMap[m.senderId] ?? m.senderId,
        replyTo: m.replyTo
            ? {
              ...m.replyTo,
              senderId: m.replyTo.senderId,
            }
            : undefined,
      }));

      setMessages(msgs);
    });


    return () => unsub();
  }, [chatId]);

  // send message
  const sendMessage = async (
      senderId: string,
      text: string,
      replyTo?: {
        id: string;
        text: string;
        senderId: string;
      }
      ) => {
    if (!chatId) throw new Error("Missing chatId");
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId,
      text,
      replyTo: replyTo || null,
      createdAt: serverTimestamp(),
    });
    // update parent chat's lastMessage/updatedAt should be done by caller (or add cloud function)
  };

  return { messages, sendMessage };
}
