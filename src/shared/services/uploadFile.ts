import api from "@/lib/axios";

export const uploadToCloudinary = async (
    file: File,
    options: { folder: string; publicId?: string }
) => {
    const { folder, publicId } = options;

    const res = await api.get("/upload/signature", {
        params: {
            folder,
            publicId,
        },
    });

    const { timestamp, signature, api_key, cloud_name } = res.data.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    if (publicId) {
        formData.append("public_id", publicId);
        formData.append("overwrite", "true");
    }

    const isPDF = file.type === "application/pdf";

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/${
            isPDF ? "raw" : "image"
        }/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await uploadRes.json();
    return data.secure_url;
};

export const deleteFile = async (publicId: string) => {
    const res = await api.delete("/upload/file", {
        params: { publicId },
    });

    return res.data;
};

export const getPublicIdFromUrl = (url: string) => {
    try {
        const parts = url.split("/upload/")[1]; 
        const withoutVersion = parts.replace(/v\d+\//, ""); 
        const publicId = withoutVersion.split(".")[0]; 
        return publicId;
    } catch {
        return null;
    }
};