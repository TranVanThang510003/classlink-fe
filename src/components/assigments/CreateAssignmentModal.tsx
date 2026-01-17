"use client";

import { Modal, Input, DatePicker, Upload, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";

import { createAssignment } from "@/services/assignmentService";

const { TextArea } = Input;

export default function CreateAssignmentModal({
                                                  open,
                                                  onClose,
                                                  classId,
                                              }: {
    open: boolean;
    onClose: () => void;
    classId?: string;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<any>(null);
    const [files, setFiles] = useState<UploadFile[]>([]);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return null;

    const handleCreate = async () => {
        if (!classId || !title.trim()) {
            toast.error("Title is required");
            return;
        }

        try {
            await createAssignment({
                classId,
                title,
                description,
                dueDate: dueDate ? dueDate.toDate() : null,
                files, // 👉 sau này upload lên Firebase Storage
                createdBy: user.uid,
            });

            toast.success("Assignment created");
            setTitle("");
            setDescription("");
            setDueDate(null);
            setFiles([]);
            onClose();
        } catch (err) {
            console.log(err);
            toast.error("Failed to create assignment");
        }
    };

    return (
        <Modal
            open={open}
            onOk={handleCreate}
            onCancel={onClose}
            okText="Create"
            title="Create Assignment"
        >
            <div className="flex flex-col gap-4">
                <Input
                    placeholder="Assignment title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <TextArea
                    placeholder="Assignment description (optional)"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <DatePicker
                    className="w-full"
                    placeholder="Due date"
                    showTime
                    value={dueDate}
                    onChange={setDueDate}
                    disabledDate={(date) =>
                        date && date.isBefore(dayjs().startOf("day"))
                    }
                />

                {/* FILE UPLOAD (ĐỀ BÀI) */}
                <Upload
                    fileList={files}
                    beforeUpload={() => false} // ❗ chưa upload ngay
                    onChange={({ fileList }) => setFiles(fileList)}
                >
                    <Button>Upload assignment file</Button>
                </Upload>

                <div className="text-xs text-gray-400">
                    Supported: PDF, DOCX, ZIP
                </div>
            </div>
        </Modal>
    );
}
