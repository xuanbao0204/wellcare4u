function Skeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="flex items-center justify-between p-5 border rounded-2xl animate-pulse"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-200 rounded" />
                            <div className="h-3 w-60 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Skeleton;