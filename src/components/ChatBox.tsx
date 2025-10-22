// components/ChatBox.tsx
'use client';
import React, { useEffect, useRef, useState } from "react";
import { useMessages } from "@/hooks/useMessages";
import type { Message } from "@/types/chat";
import { Button, Input } from "antd";
import toast from "react-hot-toast";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = {
    chatId?: string;
    currentUserId: string;
    partnerId?: string;
};

export default function ChatBox({ chatId, currentUserId, partnerId }: Props) {
    const { messages, sendMessage } = useMessages(chatId);
    const [text, setText] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chatId || messages.length === 0) return;

        // Tìm container chứa tin nhắn (có overflow-y-auto)
        const messageContainer = bottomRef.current?.parentElement;
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, chatId]);


    const handleSend = async () => {
        if (!text.trim()) return;
        if (!chatId || !partnerId) {
            toast.error("No chat selected");
            return;
        }
        try {
            await sendMessage(currentUserId, text.trim());
            console.log("Messages in ChatBox:", messages);
            setText("");

            // update chat meta: lastMessage + updatedAt
            const chatRef = doc(db, "chats", chatId);
            const docSnap = await getDoc(chatRef);
            if (docSnap.exists()) {
                await updateDoc(chatRef, {
                    lastMessage: text.trim(),
                    updatedAt: serverTimestamp(),
                });
            } else {
                // create chat doc if missing
                await setDoc(chatRef, {
                    participants: [currentUserId, partnerId],
                    lastMessage: text.trim(),
                    updatedAt: serverTimestamp(),
                });
            }
        } catch (err: any) {
            toast.error(err?.message || "Failed to send");
        }
    };

    return (
        <div className="flex flex-col bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-3xl h-full overflow-hidden mx-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="font-semibold text-gray-800 text-lg">Chat</div>
                <div className="text-sm text-gray-500">
                    {partnerId ? `With ${partnerId}` : "No partner selected"}
                </div>
            </div>

            {/* Message List (scrollable only this area) */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-gray-50">
                {messages.map((m: Message) => (
                    <div
                        key={m.id}
                        className={`flex ${
                            m.senderId === currentUserId ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm break-words shadow-sm ${
                                m.senderId === currentUserId
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-900"
                            }`}
                        >
                            <div>{m.text}</div>
                            <div className="text-[10px] mt-1 opacity-70 text-right">
                                {m.createdAt?.toDate
                                    ? m.createdAt.toDate().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-white flex items-center gap-2">
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onPressEnter={handleSend}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full !bg-gray-50 !border-gray-300"
                />
                <Button
                    type="primary"
                    onClick={handleSend}
                    className="rounded-full px-5"
                >
                    Send
                </Button>
            </div>
        </div>
    );
}