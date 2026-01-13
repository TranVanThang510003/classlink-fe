'use client';

import { Modal, Input, Checkbox } from "antd";
import { useState } from "react";
import { useCreateGroupChat } from "@/hooks/UseCreateGroupChat";
import toast from "react-hot-toast";

type Props = {
    open: boolean;
    onClose: () => void;
    teacherId: string;
    classId: string;
    students: { id: string; name: string }[];
};

export default function CreateGroupModal({
                                             open,
                                             onClose,
                                             teacherId,
                                             classId,
                                             students,
                                         }: Props) {
    const { mutateAsync: createGroupChat, isPending } = useCreateGroupChat();

    const [name, setName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Please enter group name");
            return;
        }

        if (selected.length === 0) {
            toast.error("Please select at least one student");
            return;
        }

        try {
            await createGroupChat({
                name,
                teacherId,
                classId,
                studentIds: selected,
            });

            onClose();
            setName("");
            setSelected([]);
        } catch {
            // error đã được xử lý trong hook
        }
    };

    return (
        <Modal
            title="Create Group Chat"
            open={open}
            onOk={handleCreate}
            onCancel={onClose}
            confirmLoading={isPending}
            okText="Create"
            destroyOnHidden
        >
            <Input
                placeholder="Group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3"
            />

            <Checkbox.Group
                className="flex flex-col gap-2"
                value={selected}
                onChange={(v) => setSelected(v as string[])}
            >
                {students.map((s) => (
                    <Checkbox key={s.id} value={s.id}>
                        {s.name}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </Modal>
    );
}
