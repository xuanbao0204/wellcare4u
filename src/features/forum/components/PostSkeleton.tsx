export function PostSkeleton() {
    return (
        <div className="relative animate-pulse overflow-hidden rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
            
            {/* Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 rounded-full bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                    Đang tải bài viết của bạn lên...
                </div>
            </div>


            {/* Skeleton content */}
            <div className="mb-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-slate-200" />

                <div className="space-y-2">
                    <div className="h-4 w-32 rounded-full bg-slate-200" />
                    <div className="h-3 w-20 rounded-full bg-slate-200" />
                </div>
            </div>


            <div className="mb-3 h-7 w-3/4 rounded-2xl bg-slate-200" />

            <div className="mb-2 h-4 w-full rounded-full bg-slate-200" />

            <div className="mb-5 h-4 w-5/6 rounded-full bg-slate-200" />


            <div className="grid gap-3 md:grid-cols-[1fr_280px]">
                <div className="h-10 rounded-2xl bg-slate-200" />
                <div className="h-10 rounded-2xl bg-slate-200" />
            </div>

        </div>
    );
}