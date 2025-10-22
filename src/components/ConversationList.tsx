// components/ConversationList.tsx
'use client';
import React from "react";
import toast from "react-hot-toast";
import type { ConversationItem } from "@/hooks/useConversations";

type Props = {
    items: ConversationItem[];
    currentUserId: string;
    onSelect: (chatId: string, otherId: string) => void;
    selectedId?: string;
};

export default function ConversationList({ items, currentUserId, onSelect, selectedId }: Props) {
    return (
        <div className="w-72 p-4 space-y-3 bg-white rounded shadow-sm">
            <div className="text-sm font-semibold mb-2">All Message</div>
            <input
                className="w-full p-2 rounded border"
                placeholder="Search..."
                onChange={(e) => {
                    toast.dismiss(); // noop - placeholder if you want search behaviour
                }}
            />
            <div className="mt-3 space-y-2">
                {items.map((c) => {
                    // pick other participant id
                    const otherId = c.participants.find((p) => p !== currentUserId) || c.participants[0];
                    return (
                        <div
                            key={c.id}
                            className={`p-3 rounded-lg cursor-pointer ${selectedId === c.id ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-50"}`}
                            onClick={() => onSelect(c.id, otherId)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200" />
                                <div className="flex-1">
                                    <div className="font-medium">User {otherId}</div>
                                    <div className="text-sm text-gray-600 truncate">{c.lastMessage || "No messages yet"}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
