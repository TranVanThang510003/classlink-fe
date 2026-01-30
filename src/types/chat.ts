
import type { Timestamp } from 'firebase/firestore';


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
    createdAt: Timestamp|null;
};

export type CreateGroupChatPayload = {
    name: string;
    teacherId: string;
    classId: string;
    studentIds: string[];
};