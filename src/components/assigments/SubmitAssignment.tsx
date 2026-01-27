"use client";

import { Button, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";
import type { Timestamp } from "firebase/firestore";

/* ===== TIPTAP ===== */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";

/* ===== HOOKS ===== */
import { useSubmitAssignment } from "@/hooks/assignment/useSubmitAssignment";
import { useMySubmission } from "@/hooks/assignment/useMySubmission";
import {useRouter} from "next/navigation";

/* =======================
   TYPES
======================= */
type SubmitAssignmentProps = {
    assignmentId: string;
    classId: string;
};

/* =======================
   TOOLBAR
======================= */
function EditorToolbar({ editor, disabled }: { editor: any; disabled: boolean }) {
    if (!editor || disabled) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 border-b pb-2 mb-3">
            <Button size="small" onClick={() => editor.chain().focus().toggleBold().run()}>
                B
            </Button>
            <Button size="small" onClick={() => editor.chain().focus().toggleItalic().run()}>
                I
            </Button>
            <Button size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                H1
            </Button>
            <Button size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                H2
            </Button>
            <Button size="small" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                ⬅
            </Button>
            <Button size="small" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                ⬍
            </Button>
            <Button size="small" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                ➡
            </Button>
            <input
                type="color"
                className="h-8 w-8 border rounded cursor-pointer"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
        </div>
    );
}

/* =======================
   HELPER
======================= */
function formatSubmittedAt(submittedAt?: Timestamp) {
    if (!submittedAt) return "";
    return dayjs(submittedAt.toDate()).format("HH:mm DD/MM/YYYY");
}

/* =======================
   MAIN
======================= */
export default function SubmitAssignment({
                                             assignmentId,
                                             classId,
                                         }: SubmitAssignmentProps) {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const router = useRouter();

    const auth = getAuth();
    const user = auth.currentUser;

    const { submitAssignment, loading } = useSubmitAssignment();
    const { submission, loading: checking } = useMySubmission(
        assignmentId,
        user?.uid
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Heading.configure({ levels: [1, 2, 3] }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({
                placeholder: "Write your answer...",
            }),
        ],
        content: "",
        editable: !submission,
        immediatelyRender: false,
    });

    /* ===== SET CONTENT KHI ĐÃ NỘP ===== */
    useEffect(() => {
        if (submission && editor) {
            editor.commands.setContent(submission.content || "");
            editor.setEditable(false);

            setFiles(
                (submission.attachments || []).map((file: any) => ({
                    uid: file.publicId,
                    name: file.fileName,
                    status: "done",
                    url: file.fileUrl,
                }))
            );
        }
    }, [submission, editor]);

    if (!editor || !user || checking) return null;

    /* ===== SUBMIT ===== */
    const handleSubmit = async () => {
        const html = editor.getHTML();

        if (!html.trim() && files.length === 0) {
            toast.error("Please write something or attach a file");
            return;
        }

        await submitAssignment({
            assignmentId,
            classId,
            content: html,
            files,
            submittedBy: user.uid,
        });
        router.back();
    };

    return (
        <div className="mt-8 rounded-xl border bg-gray-50 p-6">
            <h3 className="mb-2 text-lg font-semibold">
                Submit Assignment
            </h3>

            {/* ===== STATUS ===== */}
            {submission && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                    ✅ Đã nộp lúc{" "}
                    <b>{formatSubmittedAt(submission.submittedAt)}</b>
                    <br />
                    ⏳ Đang chờ giáo viên chấm bài
                </div>
            )}

            {/* ===== EDITOR ===== */}
            <div className="rounded-md border bg-white p-3">
                <EditorToolbar editor={editor} disabled={!!submission} />
                <EditorContent
                    editor={editor}
                    className="min-h-[180px] outline-none"
                />
            </div>

            {/* ===== UPLOAD ===== */}
            <Upload
                disabled={!!submission}
                multiple
                beforeUpload={() => false}
                fileList={files}
                onChange={({ fileList }) => setFiles(fileList)}
                className="mt-4"
            >
                <Button icon={<UploadOutlined />}>
                    Attach files
                </Button>
            </Upload>

            {/* ===== SUBMIT BUTTON ===== */}
            <Button
                type="primary"
                className="mt-4"
                disabled={!!submission}
                loading={loading}
                onClick={handleSubmit}
            >
                {submission ? "Already Submitted" : "Submit"}
            </Button>
        </div>
    );
}
