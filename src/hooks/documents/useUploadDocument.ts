import { useState } from "react";
import toast from "react-hot-toast";

import { uploadDocument } from "@/services/document/documentInstructorService";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import {UploadDocumentForm} from "@/types/document";

export function useUploadDocument() {
    const [loading, setLoading] = useState(false);

    const upload = async (payload:UploadDocumentForm) => {
        try {
            setLoading(true);

            const attachments =
                payload.files?.length
                    ? await Promise.all(
                        payload.files
                            .filter((f) => f.originFileObj instanceof File)
                            .map((file) =>
                                uploadFileToCloudinary(file.originFileObj as File)
                            )
                    )
                    : [];

            await uploadDocument({
                classId: payload.classId,
                title: payload.title,
                description: payload.description,
                attachments,
                status: payload.status,
                createdBy: payload.createdBy,
            });

        } catch (err) {
            console.error(err);
            toast.error("Failed to upload  document");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadDocument: upload,
        loading,
    };
}
