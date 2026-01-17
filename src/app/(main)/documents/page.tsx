"use client";

import {useEffect, useState} from "react";
import {Button, Spin} from "antd";
import { useDocumentsByClass } from "@/hooks/useDocumentsByClass";
import CreateDocumentModal from "@/components/documents/CreateDocumentModal";
import DocumentList from "@/components/documents/DocumentList";

import {getAuth, onAuthStateChanged} from "firebase/auth"; // hook auth của bạn

export default function DocumentPage() {
    const classId = "CLASS_ID_HERE"; // lấy từ route hoặc context
    const [user, setUser] = useState<any>(null);
    const auth = getAuth();
    const { documents, loading } = useDocumentsByClass(classId);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsub();
    }, []);
    // ===== AUTH LOADING =====
    if (!user) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }
    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Tài liệu học tập</h1>

                <Button type="primary" onClick={() => setOpen(true)}>
                    Thêm tài liệu
                </Button>
            </div>

            {loading ? <div className="flex justify-center py-10">
                     <Spin/>
                     </div>
                : <DocumentList documents={documents}/>}

            <CreateDocumentModal
                open={open}
                onClose={() => setOpen(false)}
                classId={classId}
                userId={user!.uid}
            />
        </div>
    );
}
