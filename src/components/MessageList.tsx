'use client';
import React from 'react';
import type { Message } from '@/types/chat';
import {  HiReply } from "react-icons/hi";

type Props = {
    messages: Message[];
    currentUserId: string;
    onReply: (m: Message) => void;
};

const hasToDate = (v: unknown): v is { toDate: () => Date } =>
    typeof v === 'object' &&
    v !== null &&
    'toDate' in v &&
    typeof (v as { toDate?: unknown }).toDate === 'function';

const toMs = (t: unknown): number => {
    if (!t) return 0;
    if (hasToDate(t)) return t.toDate().getTime();
    if (typeof t === 'number') return t;
    if (t instanceof Date) return t.getTime();
    return 0;
};

const isSameDay = (a: unknown, b: unknown): boolean => {
    const da = new Date(toMs(a));
    const db = new Date(toMs(b));
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
};

const formatDayLabel = (val: unknown): string => {
    const d = new Date(toMs(val));
    if (isNaN(d.getTime())) return '';

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(d, today)) return 'Today';
    if (isSameDay(d, yesterday)) return 'Yesterday';
    return d.toLocaleDateString();
};

export default function MessageList({ messages, currentUserId, onReply }: Props) {
    return (
        <ul role="list" className="space-y-3">
            {messages.map((m, i) => {
                const prev = messages[i - 1];
                const isMine = m.senderId === currentUserId;
                const newDay = !prev || !isSameDay(prev.createdAt, m.createdAt);

                const timeLabel = hasToDate(m.createdAt)
                    ? m.createdAt
                        .toDate()
                        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date(m.createdAt as any).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                return (
                    <React.Fragment key={m.id}>
                        {newDay && (
                            <li className="flex justify-center">
                                <div className="text-xs px-3 py-1 bg-gray-200 rounded-full text-gray-600">
                                    {formatDayLabel(m.createdAt)}
                                </div>
                            </li>
                        )}

                        <li
                            id={`msg-${m.id}`}
                            className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[78%] flex items-end gap-2 ${
                                    isMine ? 'flex-row-reverse' : 'flex-row'
                                }`}
                            >
                                {/* Avatar + tooltip */}
                                <div className="relative flex-shrink-0">
                                    {/* Avatar */}
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                          ${isMine ? 'bg-blue-400 text-white' : 'bg-gray-300 text-gray-800'}`}
                                    >
                                        {String(m.senderName || 'U').slice(0, 1).toUpperCase()}
                                    </div>

                                    {/* Tooltip name */}
                                    <div
                                        className={`
                                        absolute z-20 -top-8 left-1/2 -translate-x-1/2
                                        whitespace-nowrap rounded-md px-2 py-1 text-xs text-white
                                        bg-black/80
                                        opacity-0 scale-95
                                        group-hover:opacity-100 group-hover:scale-100
                                        transition-all duration-150`}
                                    >
                                        {m.senderId === currentUserId ? 'You' : m.senderName}
                                    </div>
                                </div>


                                {/* Message bubble */}
                                <div className="relative">
                                    <div
                                        className={`px-4 py-2 rounded-2xl text-sm break-words shadow-sm overflow-hidden
                                        ${
                                            isMine
                                                ? 'bg-blue-400 text-white '
                                                : 'bg-gray-50 text-gray-900 border border-gray-200'
                                        }`}
                                    >
                                        {/* Reply preview */}
                                        {m.replyTo && (
                                            <div
                                                onClick={() => {
                                                    const el = document.getElementById(
                                                        `msg-${m.replyTo?.id}`
                                                    );
                                                    if (!el) return;
                                                    el.scrollIntoView({
                                                        behavior: 'smooth',
                                                        block: 'center',
                                                    });

                                                }}
                                                className={`mb-2 px-3 py-2 text-xs rounded-lg cursor-pointer
                                                ${
                                                    isMine
                                                        ? 'bg-blue-300 text-blue-900'
                                                        : 'bg-gray-100 text-gray-700'
                                                } hover:bg-black/5`}
                                            >
                                                <div className="font-medium">
                                                    {m.replyTo.senderId === currentUserId
                                                        ? 'You'
                                                        : m.replyTo.senderName}
                                                </div>
                                                <div className="truncate">
                                                    {m.replyTo.text}
                                                </div>
                                            </div>
                                        )}

                                        {/* Message text */}
                                        <div>{m.text}</div>

                                        {/* Time */}
                                        <div className="text-[10px] mt-1 opacity-60 text-right">
                                            {timeLabel}
                                        </div>
                                    </div>

                                    {/* Reply button */}
                                    <button
                                        onClick={() => onReply(m)}
                                        className={`absolute bottom-4 -right-2  ${
                                            isMine ? '-left-6' : '-right-6'
                                        } opacity-0 group-hover:opacity-100 transition
                                        text-gray-400 hover:text-blue-500`}
                                    >
                                        < HiReply size={20} />
                                    </button>
                                </div>
                            </div>
                        </li>
                    </React.Fragment>
                );
            })}
        </ul>
    );
}
