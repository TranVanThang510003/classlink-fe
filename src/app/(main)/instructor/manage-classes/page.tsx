'use client';

import {  Button, Spin } from "antd";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useClasses } from "@/hooks/class/useClasses";
import CreateClassModal from "@/components/intructor/ManageClasses/CreateClassModal";
import ClassListTable from "@/components/intructor/ManageClasses/ClassListTable";
export default function ManageClassesPage() {
    const { uid, loading: authLoading } = useAuthContext();
    const { classes, loading } = useClasses(uid ?? "");
    const [openCreateClass, setOpenCreateClass] = useState(false);
    const classItems = classes.map((c) => ({
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        description:c.description,
        // status: c.status ?? 'active',
        studentCount: c.studentIds?.length ?? 0,
    }));

    if (authLoading || loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Manage Classes</h2>

                <Button type="primary" onClick={() => setOpenCreateClass(true)}>
                    + Create Class
                </Button>
            </div>

            {/* CLASS TABLE */}
            <ClassListTable classes={classItems} onDelete={(id) => console.log(id)}/>


            {/* CREATE CLASS MODAL */}
            <CreateClassModal
                open={openCreateClass}
                onClose={() => setOpenCreateClass(false)}
                instructorId={uid ?? ""}
            />
        </div>
    );
}
