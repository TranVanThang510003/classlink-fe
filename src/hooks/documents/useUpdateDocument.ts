
"use client";

import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { UploadFile } from "antd/es/upload/interface";

export type UpdateDocumentPayload = {
  documentId: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  files: UploadFile[];
};

export function useUpdateDocument() {
  const [loading, setLoading] = useState(false);

  const updateDocument = async ({
    documentId,
    title,
    description,
    status,
    files,
  }: UpdateDocumentPayload) => {
    try {
      setLoading(true);

      const uploadedFiles: {
        fileName: string;
        fileSize: number;
        fileType: string;
        fileUrl: string;
      }[] = [];

      for (const file of files) {
        /** 1️⃣ File cũ → giữ nguyên */
        if (file.url && !file.originFileObj) {
          uploadedFiles.push({
            fileName: file.name,
            fileSize: file.size ?? 0,
            fileType: file.type ?? "",
            fileUrl: file.url,
          });
          continue;
        }

        /** 2️⃣ File mới → upload */
        if (file.originFileObj) {
          const storageRef = ref(
            storage,
            `documents/${documentId}/${Date.now()}_${file.name}`
);

await uploadBytes(storageRef, file.originFileObj);
const downloadURL = await getDownloadURL(storageRef);

uploadedFiles.push({
    fileName: file.name,
    fileSize: file.originFileObj.size,
    fileType: file.originFileObj.type,
    fileUrl: downloadURL,
});
}
}

const docRef = doc(db, "documents", documentId);

await updateDoc(docRef, {
    title,
    description: description || "",
    status,
    attachments: uploadedFiles,
    updatedAt: serverTimestamp(),
});
} catch (error) {
    console.error("Update document error:", error);
    throw error; //  để modal bắt lỗi
} finally {
    setLoading(false);
}
};

return { updateDocument, loading };
}

