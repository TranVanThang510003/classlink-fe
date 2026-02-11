"use client";

import { Table, Tooltip, message } from "antd";
import { DownloadOutlined, PaperClipOutlined } from "@ant-design/icons";
import type { DocumentItem } from "@/types/document";

/**
 * Tải 1 file thật sự (force download) + xử lý lỗi
 */
const downloadFile = async (url: string, filename: string) => {
    try {
        const res = await fetch(url);

        if (!res.ok) throw new Error("Download failed");

        const blob = await res.blob();

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);
    } catch {
        message.error("Cannot download file");
    }
};

/**
 * Delay nhỏ để tránh browser chặn nhiều download liên tiếp
 */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Tải tất cả file trong 1 document (chuẩn LMS frontend)
 */
const downloadAllFiles = async (files?: DocumentItem["attachments"]) => {
    if (!files || files.length === 0) return;

    for (const file of files) {
        await downloadFile(file.fileUrl, file.fileName);
        await sleep(350); // tránh bị browser block
    }
};

export default function StudentDocumentTable({
                                                 documents,
                                             }: {
    documents: DocumentItem[];
}) {
    return (
        <Table
            pagination={{ pageSize: 8 }}
            dataSource={documents}
            rowKey="id"
            columns={[
                {
                    title: "Title",
                    dataIndex: "title",
                    width: 220,
                },
                {
                    title: "Description",
                    dataIndex: "description",
                    render: (text?: string) => (
                        <span className="text-gray-500 text-sm line-clamp-2">
                            {text || "-"}
                        </span>
                    ),
                },
                {
                    title: "Files",
                    dataIndex: "attachments",
                    width: 460,
                    render: (attachments?: DocumentItem["attachments"]) => {
                        if (!attachments || attachments.length === 0) return "-";

                        return (
                            <div className="flex flex-col gap-1">
                                {attachments.map((file, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between gap-2"
                                    >
                                        {/* VIEW FILE */}
                                        <a
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-600 hover:underline truncate"
                                        >
                                            <PaperClipOutlined />
                                            {file.fileName}
                                        </a>

                                    </div>
                                ))}
                            </div>
                        );
                    },
                },
                {
                    title: "",
                    align: "right",
                    width: 60,
                    render: (_, record: DocumentItem) => (
                        <Tooltip title="Download all">
                            <DownloadOutlined
                                className="cursor-pointer text-blue-500 text-lg"
                                onClick={() => downloadAllFiles(record.attachments)}
                            />
                        </Tooltip>
                    ),
                },
            ]}
        />
    );
}
