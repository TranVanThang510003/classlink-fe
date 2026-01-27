"use client";

import { Modal, Input, DatePicker, Upload, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import dayjs from "dayjs";
import { getAuth } from "firebase/auth";

import { useCreateAssignment } from "@/hooks/assignment/useCreateAssignment";

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

    const { createAssignment, loading } = useCreateAssignment();

    if (!user) return null;

    const handleCreate = async () => {
        if (!classId || !title.trim()) return;

        await createAssignment({
            classId,
            title,
            description,
            dueDate: dueDate ? dueDate.toDate() : null,
            files,
            createdBy: user.uid,
        });

        setTitle("");
        setDescription("");
        setDueDate(null);
        setFiles([]);
        onClose();
    };

    return (
        <Modal
            open={open}
            onOk={handleCreate}
            onCancel={onClose}
            confirmLoading={loading}
            title="Create Assignment"
        >
            <div className="flex flex-col gap-4">
                <Input
                    placeholder="Assignment title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <TextArea
                    placeholder="Assignment description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <DatePicker
                    className="w-full"
                    showTime
                    value={dueDate}
                    onChange={setDueDate}
                    disabledDate={(date) =>
                        date && date.isBefore(dayjs().startOf("day"))
                    }
                />

                <Upload
                    fileList={files}
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setFiles(fileList)}
                >
                    <Button>Upload assignment file</Button>
                </Upload>
            </div>
        </Modal>
    );
}
