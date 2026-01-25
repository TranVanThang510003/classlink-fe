'use client';

import { Modal, Input } from "antd";
import { useState } from "react";
import { useCreateClass } from "@/hooks/class/useCreateClass";

type Props = {
    open: boolean;
    onClose: () => void;
    instructorId: string;
};

export default function CreateClassModal({
                                             open,
                                             onClose,
                                             instructorId,
                                         }: Props) {
    const { mutateAsync, isPending } = useCreateClass();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = async () => {
        if (!name.trim()) return;

        await mutateAsync({
            name,
            description,
            instructorId,
        });

        setName("");
        setDescription("");
        onClose();
    };

    return (
        <Modal
            title="Create Class"
            open={open}
            onOk={handleCreate}
            onCancel={onClose}
            confirmLoading={isPending}
            okText="Create"
            destroyOnHidden
        >
            <Input
                placeholder="Class name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3"
            />

            <Input.TextArea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
            />
        </Modal>
    );
}
