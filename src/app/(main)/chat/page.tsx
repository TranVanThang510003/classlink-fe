'use client';
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useConversations } from "@/hooks/message/useConversations";
import ConversationList from "@/components/ConversationList";
import ChatBox from "@/components/ChatBox";
import CreateGroupModal from "@/components/CreateGroupModal";
import {Spin} from "antd";
import {useAuthContext} from "@/contexts/AuthContext";
import {useClassContext} from "@/contexts/ClassContext";


export default function ChatPage() {

    const [selectedChat, setSelectedChat] = useState<{
        chatId?: string;
        partnerId?: string;
        chatName?: string;
    }>({});

    const [openCreateGroup, setOpenCreateGroup] = useState(false);
    const { uid, loading: authLoading,role } = useAuthContext();
    const {  classes } = useClassContext();
    const isTeacher = role === "instructor";
    const currentUserId = uid;

    const conversations = useConversations(currentUserId || "");
    const handleSelect = (chatId: string, otherId: string, chatName: string) => {
        setSelectedChat({
            chatId,
            partnerId: otherId,
            chatName,
        });
    };


    if (authLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />

            <div className="flex h-screen p-6 bg-gray-50 gap-6">
                {/* LEFT – CONVERSATION LIST */}
                <div className="w-80">
                    <ConversationList
                        items={conversations}
                        currentUserId={currentUserId!}
                        selectedId={selectedChat.chatId}
                        onSelect={handleSelect}
                        canCreateGroup={isTeacher}
                        onCreateGroup={() => setOpenCreateGroup(true)}
                    />
                </div>

                {/* RIGHT – CHAT BOX */}
                <div className="flex-1 h-[80vh]">
                    <ChatBox
                        chatId={selectedChat.chatId}
                        currentUserId={currentUserId!}
                        partnerId={selectedChat.partnerId}
                        chatName={selectedChat.chatName}
                    />
                </div>
            </div>

            {/* CREATE GROUP MODAL – CHỈ INSTRUCTOR THẤY */}
            {isTeacher && (
                <CreateGroupModal
                open={openCreateGroup}
                onClose={() => setOpenCreateGroup(false)}
                teacherId={currentUserId!}

            />
            )}
        </>
    );
}
