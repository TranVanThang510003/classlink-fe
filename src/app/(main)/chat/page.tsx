// app/chat/page.tsx
'use client';
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useConversations } from "@/hooks/useConversations";
import ConversationList from "@/components/ConversationList";
import ChatBox from "@/components/ChatBox";

// For demo: replace with actual auth user id (from Firebase Auth)
const DEMO_CURRENT_USER = "user_2";

export default function ChatPage() {
    const currentUserId = DEMO_CURRENT_USER;
    const conversations = useConversations(currentUserId);
    const [selectedChat, setSelectedChat] = useState<{ chatId?: string; partnerId?: string }>({});

    const handleSelect = (chatId: string, otherId: string) => {
        setSelectedChat({ chatId, partnerId: otherId });
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="flex h-screen p-6 bg-gray-50 gap-6">
                <div className="w-80">
                    <ConversationList
                        items={conversations}
                        currentUserId={currentUserId}
                        onSelect={handleSelect}
                        selectedId={selectedChat.chatId}
                    />
                </div>
                <div className="flex-1 h-[80vh] ">
                    <ChatBox
                        chatId={selectedChat.chatId}
                        currentUserId={currentUserId}
                        partnerId={selectedChat.partnerId}
                    />
                </div>
            </div>
        </>
    );
}
