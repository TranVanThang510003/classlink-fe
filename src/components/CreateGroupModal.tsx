'use client';

import { Modal, Input, Checkbox, Select, Spin } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateGroupChat } from "@/hooks/UseCreateGroupChat";
import { useStudentsByClass } from "@/hooks/useStudentsByClass";

type Props = {
    open: boolean;
    onClose: () => void;
    teacherId: string;
    classes: { id: string; name: string }[];
};

export default function CreateGroupModal({
                                             open,
                                             onClose,
                                             teacherId,
                                             classes,
                                         }: Props) {
    const { mutateAsync, isPending } = useCreateGroupChat();

    const [classId, setClassId] = useState<string>();
    const [name, setName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);

    // ✅ destructuring đúng
    const { students, loading } = useStudentsByClass(classId);

    const handleCreate = async () => {
        if (!classId) {
            toast.error("Please select a class");
            return;
        }

        if (!name.trim()) {
            toast.error("Please enter group name");
            return;
        }

        if (!selected.length) {
            toast.error("Please select students");
            return;
        }

        await mutateAsync({
            name,
            teacherId,
            classId,
            studentIds: selected,
        });

        onClose();
        setName("");
        setSelected([]);
        setClassId(undefined);
    };

    return (
        <Modal
            title="Create Group Chat"
            open={open}
            onOk={handleCreate}
            onCancel={onClose}
            confirmLoading={isPending}
            okText="Create"
        >
            {/* CHỌN CLASS */}
            <Select
                placeholder="Select class"
                className="w-full mb-3"
                value={classId}
                onChange={(v) => {
                    setClassId(v);
                    setSelected([]); // reset khi đổi class
                }}
                options={classes.map((c) => ({
                    label: c.name,
                    value: c.id,
                }))}
            />

            <div className="my-3">
                <Input
                    placeholder="Group name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!classId}
                />
            </div>


            {!classId && (
                <div className="text-gray-400 text-sm">
                    Please select a class to load students
                </div>
            )}

            {loading ? (
                <Spin/>
            ) : (
                <Checkbox.Group
                    className="flex flex-col gap-2"
                    value={selected}
                    onChange={(v) => setSelected(v as string[])}
                    disabled={!classId}
                >
                    {students.map((s) => (
                        <Checkbox key={s.id} value={s.id}>
                            {s.name}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            )}
        </Modal>
    );
}
