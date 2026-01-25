
import type { Timestamp } from 'firebase/firestore';
export type User = {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
};

export type Message = {
    id: string;
    senderId: string;
    senderName: string; // ✅
    text: string;
    replyTo?: {
        id: string;
        text: string;
        senderId: string;
        senderName: string; // ✅
    } | null;
    createdAt: any;
};

export type CreateGroupChatPayload = {
    name: string;
    teacherId: string;
    classId: string;
    studentIds: string[];
};