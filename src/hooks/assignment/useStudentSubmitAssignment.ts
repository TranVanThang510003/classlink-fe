import { useState } from "react";
import toast from "react-hot-toast";
import type { UploadFile } from "antd/es/upload/interface";

import { submitAssignment } from "@/services/assignment/assignmentStudentService";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import type {
    AssignmentSubmissionAttachment,
} from "@/types/assignment";
import type {
    SubmitAssignmentPayload,
    SubmitAssignmentServicePayload,
} from "@/types/assigmentPayload";
export function useStudentSubmitAssignment() {
    const [loading, setLoading] = useState(false);

    const submitAssignmentHandler = async (
        payload: SubmitAssignmentPayload
    ): Promise<void> => {
        try {
            setLoading(true);

            /* =============================
               UPLOAD FILES
            ============================= */
            const attachments: AssignmentSubmissionAttachment[] =
                payload.files && payload.files.length > 0
                    ? (
                        await Promise.all(
                            payload.files.map(async (file: UploadFile) => {
                                if (!file.originFileObj) return null;

                                // ✅ Hàm này ĐÃ map sẵn
                                const result =
                                    await uploadFileToCloudinary(
                                        file.originFileObj as File
                                    );

                                if (!result?.fileUrl) return null;

                                return result; // 👈 dùng thẳng
                            })
                        )
                    ).filter(
                        (item): item is AssignmentSubmissionAttachment =>
                        item !== null)
                    : [];

            /* =============================
               SERVICE PAYLOAD
            ============================= */
            const servicePayload: SubmitAssignmentServicePayload = {
                assignmentId: payload.assignmentId,
                classId: payload.classId,
                content: payload.content ?? "",
                attachments,
                submittedBy: payload.submittedBy,
            };

            await submitAssignment(servicePayload);

            toast.success("Assignment submitted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit assignment");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        submitAssignment: submitAssignmentHandler,
        loading,
    };
}
