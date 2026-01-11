// components/ConversationList.tsx
'use client';
import React from "react";
import toast from "react-hot-toast";
import type { ConversationItem } from "@/hooks/useConversations";
import {FiUsers, FiUser, FiPlus} from 'react-icons/fi';

type Props = {
    items: ConversationItem[];
    currentUserId: string;
    onSelect: (chatId: string, otherId: string,chatName: string) => void;
    selectedId?: string;
    canCreateGroup?: boolean;
    onCreateGroup?: () => void;
};

export default function ConversationList({ items, currentUserId, onSelect, selectedId,
                                             canCreateGroup = false,
                                             onCreateGroup, }: Props) {
    return (
        <div className="w-72 p-4 space-y-3 bg-white rounded shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">All Message</div>

                {canCreateGroup && (
                    <button
                        onClick={onCreateGroup}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600"
                        title="Create group"
                    >
                        <FiPlus size={16}/>
                    </button>
                )}
            </div>
            <input
                className="w-full p-2 rounded border"
                placeholder="Search..."
                onChange={(e) => {
                    toast.dismiss(); // noop - placeholder if you want search behaviour
                }}
            />
            <div className="mt-3 space-y-2">
                {items.map((c) => {
                    const otherId =
                        c.participants.find((p) => p !== currentUserId) || c.participants[0];

                    const title = c.isGroup
                        ? c.nameGroup
                        : c.userName?.[otherId] || otherId;


                    return (
                        <div
                            key={c.id}
                            onClick={() => onSelect(c.id, otherId, title as string)}

                            className={`p-3 rounded-lg cursor-pointer ${
                                selectedId === c.id
                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                    : "bg-gray-50"
                            }`}
                        >
                            {/* TITLE */}
                            <div className="flex items-center gap-2 font-medium">
                                {c.isGroup ? (
                                    <FiUsers className="text-blue-500" size={16}/>
                                ) : (
                                    <FiUser className="text-gray-500" size={16}/>
                                )}

                                <span className="truncate">{title}</span>
                            </div>

                            <div className="text-sm text-gray-600 truncate">
                                {c.lastMessage || "No messages yet"}
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
