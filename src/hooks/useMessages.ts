'use client';
import { useEffect, useState } from "react";
import type { Message } from "@/types/chat";
import { subscribeMessages, sendMessageService } from "@/services/chatService";

export function useMessages(chatId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);

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
        }
    ) => {
        if (!chatId) throw new Error("Missing chatId");
        return sendMessageService(chatId, {
            senderId,
            text,
            replyTo,
        });
    };

    return { messages, sendMessage };
}
