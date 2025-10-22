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
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Message } from "@/types/chat";
import {set} from "@firebase/database";

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

    const unsub = onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
      console.log("📩 Fetched messages:", msgs);
      setMessages(msgs);
    });

    return () => unsub();
  }, [chatId]);

  // send message
  const sendMessage = async (senderId: string, text: string) => {
    if (!chatId) throw new Error("Missing chatId");
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId,
      text,
      createdAt: serverTimestamp(),
    });
    // update parent chat's lastMessage/updatedAt should be done by caller (or add cloud function)
  };

  return { messages, sendMessage };
}
