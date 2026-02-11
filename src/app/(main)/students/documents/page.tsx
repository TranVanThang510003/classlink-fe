"use client";

import { Input, Spin } from "antd";
import { useState, useMemo } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useClassContext } from "@/contexts/ClassContext";
import { usePublishedDocumentsByClass } from "@/hooks/documents/usePublishedDocumentsByClass";
import StudentDocumentTable from "@/components/documents/StudentDocumentTable";

export default function StudentDocumentsPage() {
    const { loading: authLoading } = useAuthContext();
    const { activeClassId } = useClassContext();
    const { documents, loading } = usePublishedDocumentsByClass(activeClassId);

    const [keyword, setKeyword] = useState("");

    // filter client-side + chỉ lấy published
    const filteredDocs = useMemo(() => {
        return documents
            .filter((d) =>
                d.title.toLowerCase().includes(keyword.toLowerCase())
            );
    }, [documents, keyword]);

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
            <h1 className="text-2xl font-semibold">Documents</h1>

            {/* SEARCH */}
            <Input.Search
                placeholder="Search documents"
                className="w-72"
                disabled={!activeClassId}
                onChange={(e) => setKeyword(e.target.value)}
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
                <StudentDocumentTable documents={filteredDocs} />
            )}
        </div>
    );
}
