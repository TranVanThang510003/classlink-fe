'use client';

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createClassService } from "@/services/classService";
import type { CreateClassPayload } from "@/types/class";

export const useCreateClass = () => {
    return useMutation<string, Error, CreateClassPayload>({
        mutationFn: createClassService,
        onSuccess: () => {
            toast.success("Class created successfully");
        },
        onError: () => {
            toast.error("Failed to create class");
        },
    });
};
