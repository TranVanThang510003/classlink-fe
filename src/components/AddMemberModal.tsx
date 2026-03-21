'use client';

import { Modal, List, Button, message } from "antd";
import { useEffect, useState } from "react";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAddMember } from "@/hooks/message/useAddMember";
import toast from "react-hot-toast";

type User = {
    id: string;
    name: string;
    email: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    chatId: string;
};

export default function AddMemberModal({ open, onClose, chatId }: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const mutation = useAddMember();
    useEffect(() => {
        const fetchData = async () => {
            // 1. Lấy chat
            const chatRef = doc(db, "chats", chatId);
            const chatSnap = await getDoc(chatRef);

            const chatData = chatSnap.data();
            const participants: string[] = chatData?.participants || [];
            const classId = chatData?.classId;

            if (!classId) {
                console.error("Chat chưa có classId");
                return;
            }

            // 2. Lấy users thuộc class
            const q = query(
                collection(db, "users"),
                where("classIds", "array-contains", classId)
            );

            const snap = await getDocs(q);

            const data = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as any),
            }));

            // 3. Filter: chưa có trong group
            const filtered = data.filter(
                (user) => !participants.includes(user.id)
            );

            setUsers(filtered);
        };

        if (open && chatId) {
            fetchData();
        }
    }, [open, chatId]);

    const handleAdd = async (user: User) => {
        try {
            await mutation.mutateAsync({
                chatId,
                userId: user.id,
                userName: user.name,
            });
            setTimeout(() => {
                onClose();
            }, 300);
            toast.success("Added successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed");
        }
    };

    return (
        <Modal open={open} onCancel={onClose} footer={null} title="Add member">
            <List
                dataSource={users}
                renderItem={(user) => (
                    <List.Item
                        actions={[
                            <Button
                                type="primary"
                                size="small"
                                loading={mutation.isPending}
                                onClick={() => handleAdd(user)}
                            >
                                Add
                            </Button>,
                        ]}
                    >
                        <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    );
}