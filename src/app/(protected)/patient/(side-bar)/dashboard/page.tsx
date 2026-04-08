const PatientDashboardPage = () => {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-semibold">
                    Chào mừng trở lại 👋
                </h2>
                <p className="text-gray-600">
                    Đây là tổng quan nhanh về tình trạng sức khỏe và hoạt động của bạn.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-primary/15 bg-white/80 backdrop-blur-md p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Lịch hẹn sắp tới</p>
                    <h3 className="text-2xl font-semibold text-primary mt-1">2</h3>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-white/80 backdrop-blur-md p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Hồ sơ bệnh án</p>
                    <h3 className="text-2xl font-semibold text-primary mt-1">5</h3>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-white/80 backdrop-blur-md p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Đơn thuốc</p>
                    <h3 className="text-2xl font-semibold text-primary mt-1">3</h3>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-white/80 backdrop-blur-md p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Thông báo</p>
                    <h3 className="text-2xl font-semibold text-primary mt-1">1</h3>
                </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-white/80 backdrop-blur-md p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-primary mb-4">
                    Hành động nhanh
                </h3>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <a
                        href="/patient/appointments"
                        className="rounded-xl border border-primary/20 p-4 hover:bg-primary/5 transition"
                    >
                        <p className="font-medium">Đặt lịch khám</p>
                        <p className="text-sm text-gray-500">
                            Đặt lịch với bác sĩ nhanh chóng
                        </p>
                    </a>

                    <a
                        href="/patient/medical-records"
                        className="rounded-xl border border-primary/20 p-4 hover:bg-primary/5 transition"
                    >
                        <p className="font-medium">Xem bệnh án</p>
                        <p className="text-sm text-gray-500">
                            Theo dõi lịch sử khám bệnh
                        </p>
                    </a>

                    <a
                        href="/patient/prescriptions"
                        className="rounded-xl border border-primary/20 p-4 hover:bg-primary/5 transition"
                    >
                        <p className="font-medium">Đơn thuốc</p>
                        <p className="text-sm text-gray-500">
                            Kiểm tra thuốc đã kê
                        </p>
                    </a>

                    <a
                        href="/patient/forum"
                        className="rounded-xl border border-primary/20 p-4 hover:bg-primary/5 transition"
                    >
                        <p className="font-medium">Diễn đàn</p>
                        <p className="text-sm text-gray-500">
                            Hỏi đáp và chia sẻ kinh nghiệm
                        </p>
                    </a>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Appointment */}
                <div className="rounded-2xl border border-primary/15 bg-white/80 backdrop-blur-md p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                        Lịch hẹn gần nhất
                    </h3>

                    <div className="flex flex-col gap-3">
                        <div className="border rounded-xl p-4">
                            <p className="font-medium">Dr. Nguyễn Văn A</p>
                            <p className="text-sm text-gray-500">
                                10:00 - 12/04/2026
                            </p>
                            <p className="text-sm text-gray-500">
                                Khám tổng quát
                            </p>
                        </div>

                        <a
                            href="/patient/appointments"
                            className="text-sm text-primary hover:underline"
                        >
                            Xem tất cả lịch hẹn →
                        </a>
                    </div>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-white/80 backdrop-blur-md p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                        Tổng quan sức khỏe
                    </h3>

                    <div className="flex flex-col gap-3 text-sm text-gray-600">
                        <p>• Nhịp tim: 72 bpm</p>
                        <p>• Huyết áp: 120/80 mmHg</p>
                        <p>• BMI: 22.5 (Bình thường)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboardPage;