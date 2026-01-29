import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

interface UploadDocumentPayload {
    file: File;
    title: string;
    description?: string;
    classId: string;
    userId: string;
}

export async function uploadDocument({
                                         file,
                                         title,
                                         description,
                                         classId,
                                         userId,
                                     }: UploadDocumentPayload) {
    // 1. Upload file to Storage
    const fileRef = ref(
        storage,
        `documents/${classId}/${Date.now()}-${file.name}`
    );

    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    // 2. Save metadata to Firestore
    await addDoc(collection(db, "documents"), {
        classId,
        title,
        description,
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        visibility: "public",
        createdBy: userId,
        createdAt: serverTimestamp(),
    });
}
