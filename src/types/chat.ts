// types/chat.ts
export type User = {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
};

export type Message = {
    id?: string;
    senderId: string;
    text: string;
    createdAt?: any; // Firestore Timestamp or null
};
