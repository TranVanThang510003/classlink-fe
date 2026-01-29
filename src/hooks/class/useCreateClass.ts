import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createClassService } from "@/services/class/classService";
import type { CreateClassPayload } from "@/types/class";

export const useCreateClass = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createClassService,

        onSuccess: () => {
            toast.success("Class created successfully");

            queryClient.invalidateQueries({
                queryKey: ["classes"],
            });
        },

        onError: (error) => {
            toast.error(error.message || "Failed to create class");
        },
    });
};
