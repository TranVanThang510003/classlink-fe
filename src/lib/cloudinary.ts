export async function uploadFileToCloudinary(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    const data = await res.json();

    return {
        fileUrl: data.secure_url,   // ✔ raw/upload/....
        fileName: data.original_filename,
        fileType: file.type || "application/pdf",     // pdf
        fileSize: data.bytes,
    };
}
