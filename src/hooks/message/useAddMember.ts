'use client';

import { useMutation } from "@tanstack/react-query";
import { addMemberToGroup } from "@/services/message/chatService";

export const useAddMember = () => {
    return useMutation({
        mutationFn: ({
                         chatId,
                         userId,
                         userName,
                     }: {
            chatId: string;
            userId: string;
            userName: string;
        }) => addMemberToGroup(chatId, userId, userName),
    });
};