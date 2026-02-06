"use client";

import { Button, Input, Spin } from "antd";
import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useClassContext } from "@/contexts/ClassContext";
import UploadDocumentModal from "@/components/documents/UploadDocumentModal";
import { useDocumentsByClass } from "@/hooks/documents/useDocumentsByClass";
import InstructorDocumentTable from "@/components/documents/InstructorDocumentTable";
import type { DocumentItem } from "@/types/document";

export default function InstructorAssignmentsPage() {
    const [openCreate, setOpenCreate] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

    const { loading: authLoading } = useAuthContext();
    const { activeClassId } = useClassContext();
    const { documents, loading } = useDocumentsByClass(activeClassId);

    if (authLoading) {
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
                <h1 className="text-2xl font-semibold">Document</h1>

                <Button
                    type="primary"
                    disabled={!activeClassId}
                    onClick={() => setOpenCreate(true)}
                >
                    + ADD NEW
                </Button>
            </div>

            {/* SEARCH */}
            <Input.Search
                placeholder="Search documents"
                className="w-72"
                disabled={!activeClassId}
            />

            {/* CONTENT */}
            {!activeClassId ? (
                <div className="text-center text-gray-400 italic mt-10">
                    Please select a class
                </div>
            ) : loading ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : (
                <InstructorDocumentTable
                    documents={documents}
                    onEdit={(doc) => setEditingDoc(doc)}
                />
            )}

            {/* MODAL CREATE + UPDATE */}
            <UploadDocumentModal
                open={openCreate || !!editingDoc}
                onClose={() => {
                    setOpenCreate(false);
                    setEditingDoc(null);
                }}
                initialValues={editingDoc ?? undefined}
            />
        </div>
    );
}
