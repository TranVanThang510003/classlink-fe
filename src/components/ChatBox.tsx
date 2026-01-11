
'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import type { Message } from '@/types/chat';
import { Button, Input,InputRef } from 'antd';

import toast from 'react-hot-toast';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import MessageList from './MessageList';

type Props = {
    chatId?: string;
    currentUserId: string;
    partnerId?: string;
    chatName?:string;
};

function getErrorMessage(err: unknown): string {
    if (!err || typeof err !== 'object') return 'Failed to send';
    if ('message' in err && typeof (err).message === 'string') {
        return (err).message;
    }
    return 'Failed to send';
}

export default function ChatBox({ chatId, currentUserId, partnerId,chatName }: Props) {
    const { messages, sendMessage } = useMessages(chatId);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<InputRef | null>(null);


    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);
    useEffect(() => {
        if (replyTo) {
            inputRef.current?.focus();
        }
    }, [replyTo]);

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => {
            // toMillis() nếu có, fallback 0
            const ta = a.createdAt?.toMillis?.() ?? 0;
            const tb = b.createdAt?.toMillis?.() ?? 0;
            return ta - tb;
        });
    }, [messages]);


    const handleSend = useCallback(async () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (!chatId) {
            toast.error("No chat selected");
            return;
        }


        setSending(true);
        try {
            await sendMessage(
                currentUserId,
                trimmed,
                replyTo
                    ? { id: replyTo.id, text: replyTo.text, senderId: replyTo.senderId }
                    : undefined
            );

            setReplyTo(null);
            setText('');

            const chatRef = doc(db, 'chats', chatId);
            const snap = await getDoc(chatRef);

            if (snap.exists()) {
                await updateDoc(chatRef, {
                    lastMessage: trimmed,
                    updatedAt: serverTimestamp(),
                });
            } else {
                await setDoc(chatRef, {
                    participants: [currentUserId, partnerId],
                    lastMessage: trimmed,
                    updatedAt: serverTimestamp(),
                });
            }
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setSending(false);
        }
    }, [text, chatId, partnerId, currentUserId, replyTo, sendMessage]);

    return (
        <div className="flex flex-col bg-white rounded-xl shadow-md  w-full max-w-3xl h-full mx-auto overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 ">
                <div className="font-semibold text-lg">Chat</div>
                <div className="text-sm text-gray-500">
                    {partnerId ? `With ${chatName}` : 'No partner selected'}
                </div>
            </div>

            {/* Messages */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-3"
            >
                <MessageList
                    messages={sortedMessages}
                    currentUserId={currentUserId}
                    onReply={setReplyTo}
                />
            </div>

            {/* Reply bar */}
            {replyTo && (
                <div className="px-4 py-2 bg-gray-100 border-t text-sm flex justify-between">
                    <div className="truncate">
                        <span className="text-gray-500">Replying to </span>
                        <span className="font-medium">
                            {replyTo.senderId === currentUserId ? 'You' : replyTo.senderId}
                        </span>
                        : {replyTo.text}
                    </div>
                    <button onClick={() => setReplyTo(null)}>✕</button>
                </div>
            )}

            {/* Input */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    void handleSend();
                }}
                className="p-3 border-t border-gray-200 flex gap-2"
            >
                <Input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                />
                <Button type="primary" htmlType="submit" disabled={sending || !text.trim()}>
                    {sending ? 'Sending...' : 'Send'}
                </Button>
            </form>
        </div>
    );
}
