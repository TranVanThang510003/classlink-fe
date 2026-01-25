"use client";

import { Button, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

/* ===== TIPTAP ===== */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";

import { useSubmitAssignment } from "@/hooks/assigment/useSubmitAssignment";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebase";

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
function EditorToolbar({ editor }: { editor: any }) {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 border-b pb-2 mb-3">
            <Button
                size="small"
                type={editor.isActive("bold") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                B
            </Button>

            <Button
                size="small"
                type={editor.isActive("italic") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                I
            </Button>

            <Button
                size="small"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
            >
                H1
            </Button>

            <Button
                size="small"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                H2
            </Button>

            <Button
                size="small"
                onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
            >
                ⬅
            </Button>

            <Button
                size="small"
                onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
            >
                ⬍
            </Button>

            <Button
                size="small"
                onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
            >
                ➡
            </Button>

            <input
                type="color"
                className="h-8 w-8 border rounded cursor-pointer"
                onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                }
            />
        </div>
    );
}

/* =======================
   MAIN
======================= */
export default function SubmitAssignment({
                                             assignmentId,
                                             classId,
                                         }: SubmitAssignmentProps) {
    const [files, setFiles] = useState<UploadFile[]>([]);

    const auth = getAuth();
    const user = auth.currentUser;

    const { submitAssignment, loading } = useSubmitAssignment();

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Heading.configure({ levels: [1, 2, 3] }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder: "Write your answer...",
            }),
        ],
        content: "",
        immediatelyRender: false,
    });

    if (!editor || !user) return null;

    const handleSubmit = async () => {
        const token = await user.getIdTokenResult();
        console.log("🔥 TOKEN:", token.claims);
        const classSnap = await getDoc(doc(db, "classes", classId));
        console.log("CLASS DATA:", classSnap.data());
        if (!classId) {
            toast.error("Missing classId");
            return;
        }

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


    };

    return (
        <div className="mt-8 rounded-xl border bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold">
                Submit Assignment
            </h3>

            <div className="rounded-md border bg-white p-3">
                <EditorToolbar editor={editor} />
                <EditorContent
                    editor={editor}
                    className="min-h-[180px] outline-none"
                />
            </div>

            <Upload
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

            <Button
                type="primary"
                className="mt-4"
                loading={loading}
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </div>
    );
}
