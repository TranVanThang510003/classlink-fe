'use client';

import React from "react";
import type { ConversationItem } from "@/hooks/message/useConversations";
import { FiUsers, FiUser, FiPlus, FiUserPlus } from 'react-icons/fi';

type Props = {
    items: ConversationItem[];
    currentUserId: string;
    onSelect: (chatId: string, otherId: string, chatName: string) => void;
    selectedId?: string;
    canCreateGroup?: boolean;
    onCreateGroup?: () => void;
    onAddMember?: (chatId: string) => void;
};

export default function ConversationList({
                                             items,
                                             currentUserId,
                                             onSelect,
                                             selectedId,
                                             canCreateGroup = false,
                                             onCreateGroup,
                                             onAddMember,
                                         }: Props) {

    return (
        <div className="w-72 p-4 space-y-3 bg-white rounded shadow-sm">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">All Message</div>

                {canCreateGroup && (
                    <button
                        onClick={onCreateGroup}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600"
                        title="Create group"
                    >
                        <FiPlus size={16} />
                    </button>
                )}
            </div>

            {/* SEARCH */}
            <input
                className="w-full p-2 rounded border"
                placeholder="Search..."
            />

            {/* LIST */}
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
                            className={`flex items-center gap-2 p-3 rounded-lg ${
                                selectedId === c.id
                                    ? "bg-blue-50 border border-blue-500"
                                    : "bg-gray-50"
                            }`}
                        >
                            {/* CLICK AREA */}
                            <div
                                onClick={() => onSelect(c.id, otherId, title as string)}
                                className="flex-1 cursor-pointer"
                            >
                                <div className="flex items-center gap-2 font-medium">
                                    {c.isGroup ? (
                                        <FiUsers className="text-blue-500" size={16} />
                                    ) : (
                                        <FiUser className="text-gray-500" size={16} />
                                    )}

                                    <span className="truncate">{title}</span>
                                </div>

                                <div className="text-sm text-gray-600 truncate">
                                    {c.lastMessage || "No messages yet"}
                                </div>
                            </div>

                            {/* ADD MEMBER BUTTON */}
                            {c.isGroup && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); //  chặn click lan ra
                                        onAddMember?.(c.id);
                                    }}
                                    className="p-2 text-gray-500 hover:text-blue-500"
                                >
                                    <FiUserPlus size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}