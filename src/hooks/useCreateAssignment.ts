import { useState } from "react";
import toast from "react-hot-toast";
import type { UploadFile } from "antd/es/upload/interface";

import { createAssignment } from "@/services/assignmentService";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

export function useCreateAssignment() {
    const [loading, setLoading] = useState(false);

    const create = async (payload: {
        classId: string;
        title: string;
        description?: string;
        dueDate?: Date | null;
        files?: UploadFile[];
        createdBy: string;
    }) => {
        try {
            setLoading(true);

            const attachments =
                payload.files && payload.files.length > 0
                    ? await Promise.all(
                        payload.files.map((file) =>
                            uploadFileToCloudinary(
                                file.originFileObj as File
                            )
                        )
                    )
                    : [];

            await createAssignment({
                classId: payload.classId,
                title: payload.title,
                description: payload.description,
                dueDate: payload.dueDate,
                attachments,
                createdBy: payload.createdBy,
            });

            toast.success("Assignment created");
        } catch (err) {
            console.error(err);
            toast.error("Failed to create assignment");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createAssignment: create,
        loading,
    };
}
