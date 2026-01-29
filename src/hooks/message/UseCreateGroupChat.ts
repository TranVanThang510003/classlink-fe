'use client';

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createGroupChatService } from "@/services/message/chatService";

export const useCreateGroupChat = () => {
    return useMutation({
        mutationFn: createGroupChatService,
        onSuccess: () => {
            toast.success("Group created successfully");
        },
        onError: () => {
            toast.error("Failed to create group");
        },
    });
};
