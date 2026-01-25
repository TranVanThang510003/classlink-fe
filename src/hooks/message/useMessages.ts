'use client';
import { useEffect, useState } from "react";
import type { Message } from "@/types/chat";
import { subscribeMessages, sendMessageService } from "@/services/chatService";

export function useMessages(chatId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);

    // 👉 lấy user hiện tại
    const currentUser =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : null;

    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        const unsub = subscribeMessages(chatId, setMessages);
        return () => unsub();
    }, [chatId]);

    const sendMessage = async (
        senderId: string,
        text: string,
        replyTo?: {
            id: string;
            text: string;
            senderId: string;
            senderName?: string;
        }
    ) => {
        if (!chatId) throw new Error("Missing chatId");

        if (!currentUser?.name) {
            throw new Error("Missing senderName");
        }

        return sendMessageService(chatId, {
            senderId,
            senderName: currentUser.name, // ✅ SNAPSHOT
            text,
            replyTo: replyTo
                ? {
                    ...replyTo,
                    senderName: replyTo.senderName || "",
                }
                : undefined,
        });
    };

    return { messages, sendMessage };
}
