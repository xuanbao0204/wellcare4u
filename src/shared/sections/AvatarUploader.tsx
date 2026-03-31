"use client";

type Props = {
    avatar?: string;
    onUpload: (file: File) => Promise<void>;
};

export default function AvatarUploader({ avatar, onUpload }: Props) {
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        await onUpload(e.target.files[0]);
    };

    return (
        <div className="flex items-center gap-6">
            <img
                src={avatar || "/avatar-placeholder.png"}
                className="h-20 w-20 rounded-full border border-primary/20 object-cover"
            />

            <label className="cursor-pointer rounded-xl border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5">
                Change Avatar
                <input type="file" className="hidden" onChange={handleChange} />
            </label>
        </div>
    );
}