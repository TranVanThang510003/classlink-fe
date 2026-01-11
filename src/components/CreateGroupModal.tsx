'use client';
import { Modal, Input, Checkbox } from "antd";
import { useState } from "react";
import { useCreateGroupChat } from "@/hooks/UseCreateGroupChat";

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
    const { createGroupChat } = useCreateGroupChat();
    const [name, setName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim() || selected.length === 0) return;

        setLoading(true);
        await createGroupChat({
            name,
            teacherId,
            classId,
            studentIds: selected,
        });
        setLoading(false);
        onClose();
        setName("");
        setSelected([]);
    };

    return (
        <Modal
            title="Create Group Chat"
            open={open}
            onOk={handleCreate}
            onCancel={onClose}
            confirmLoading={loading}
            okText="Create"
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
