'use client';
import { useMyClasses } from "@/hooks/class/useMyClasses";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useConversations } from "@/hooks/message/useConversations";
import ConversationList from "@/components/ConversationList";
import ChatBox from "@/components/ChatBox";
import CreateGroupModal from "@/components/CreateGroupModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {Spin} from "antd";

type User = {
    uid: string;
    role: "student" | "instructor";
    name?: string;
    email?: string;
};



export default function ChatPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState<{
        chatId?: string;
        partnerId?: string;
        chatName?: string;
    }>({});

    const [openCreateGroup, setOpenCreateGroup] = useState(false);

// 🔐 AUTH LISTENER
    useEffect(() => {
        const auth = getAuth();

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            const tokenResult = await firebaseUser.getIdTokenResult();

            setUser({
                uid: firebaseUser.uid,
                role: tokenResult.claims.role as "student" | "instructor",
                email: firebaseUser.email ?? undefined,
            });
            console.log("User set in chat page:", firebaseUser.uid, tokenResult.claims.role);

            setLoading(false);
        });

        return () => unsub();
    }, []);
    const currentUserId = user?.uid;
    const isTeacher = user?.role === "instructor";

    const conversations = useConversations(currentUserId || "");
    const classes = useMyClasses(currentUserId);

    const handleSelect = (chatId: string, otherId: string, chatName: string) => {
        setSelectedChat({
            chatId,
            partnerId: otherId,
            chatName,
        });
    };

    if (!user) {
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
                classes={classes.map((c) => ({
                    id: c.id,
                    name: c.name,
                }))}
            />
            )}
        </>
    );
}
