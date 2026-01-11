'use client';
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useConversations } from "@/hooks/useConversations";
import ConversationList from "@/components/ConversationList";
import ChatBox from "@/components/ChatBox";
import CreateGroupModal from "@/components/CreateGroupModal";

type User = {
    id: string;
    email: string;
    name: string;
    role: "student" | "instructor";
};

// DEMO class + students (sau này lấy từ API)
const DEMO_CLASS_ID = "class_10A1";
const DEMO_STUDENTS = [
    { id: "user_2", name: "Student A" },
    { id: "user_3", name: "Student B" },
    { id: "user_4", name: "Student C" },
];

export default function ChatPage() {
    const [user, setUser] = useState<User | null>(null);

    const [selectedChat, setSelectedChat] = useState<{
        chatId?: string;
        partnerId?: string;
        chatName?: string;
    }>({});

    const [openCreateGroup, setOpenCreateGroup] = useState(false);

    // 🔑 LẤY USER TỪ LOCALSTORAGE
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const currentUserId = user?.id;
    const isTeacher = user?.role === "instructor";

    const conversations = useConversations(currentUserId || "");

    const handleSelect = (chatId: string, otherId: string, chatName: string) => {
        setSelectedChat({
            chatId,
            partnerId: otherId,
            chatName,
        });
    };

    if (!user) {
        return <div className="p-6">Loading...</div>;
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
                    classId={DEMO_CLASS_ID}
                    students={DEMO_STUDENTS}
                />
            )}
        </>
    );
}
