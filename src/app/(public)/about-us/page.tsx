"use client";

import { useEffect, useRef, useState } from "react";

const TEAM = [
    {
        name: "Trần Xuân Bảo",
        id: "22110113",
        role: "Full-stack Developer",
        avatar: "TXB",
        color: "from-teal-400 to-cyan-600",
    },
    {
        name: "Bùi Bảo Châu",
        id: "22110114",
        role: "Full-stack Developer",
        avatar: "BBC",
        color: "from-blue-400 to-indigo-600",
    },
    {
        name: "Nguyễn Ngô Ngọc Vân",
        id: "22110265",
        role: "Full-stack Developer",
        avatar: "NNV",
        color: "from-violet-400 to-purple-600",
    },
];

const FEATURES = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
        title: "Đặt lịch khám bệnh",
        desc: "Đặt lịch trực tuyến với bác sĩ chuyên khoa, chọn ca khám linh hoạt theo thời gian biểu thực tế của phòng khám. Nhận xác nhận và nhắc nhở tự động qua hệ thống thông báo real-time.",
        accent: "text-primary",
        border: "border-primary/10 hover:border-primary/30",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        title: "Theo dõi sức khỏe",
        desc: "Lưu trữ lịch sử khám bệnh, đơn thuốc và kết quả xét nghiệm theo thời gian. Bệnh nhân có thể xem lại tiến trình điều trị và nhận nhắc nhở uống thuốc từ hệ thống quản lý đơn thuốc tích hợp.",
        accent: "text-rose-400",
        border: "border-rose-400/20 hover:border-rose-400/60",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
        ),
        title: "Tích hợp AI",
        desc: "Trợ lý AI chạy cục bộ (Ollama) hỗ trợ gợi ý triệu chứng, giải đáp thắc mắc y tế cơ bản và hỗ trợ bác sĩ soạn thảo đơn thuốc. Đảm bảo quyền riêng tư với mô hình xử lý hoàn toàn trên máy chủ nội bộ.",
        accent: "text-amber-400",
        border: "border-amber-400/20 hover:border-amber-400/60",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
            </svg>
        ),
        title: "Giao diện trực quan",
        desc: "Thiết kế responsive tối ưu trên mọi thiết bị. Luồng thao tác đơn giản, phân quyền rõ ràng cho từng vai trò: Bệnh nhân, Bác sĩ, Nhân viên, Chủ phòng khám và Quản trị viên hệ thống.",
        accent: "text-cyan-400",
        border: "border-cyan-400/20 hover:border-cyan-400/60",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
        ),
        title: "Thông báo real-time",
        desc: "Hệ thống WebSocket với STOMP protocol gửi thông báo tức thời khi lịch hẹn được xác nhận, nhắc nhở trước giờ khám, và cập nhật trạng thái đơn thuốc — không cần tải lại trang.",
        accent: "text-green-400",
        border: "border-green-400/20 hover:border-green-400/60",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
        ),
        title: "Quản lý phòng khám",
        desc: "Công cụ toàn diện cho chủ phòng khám: quản lý danh mục thuốc, lịch làm việc bác sĩ, phân công ca trực và theo dõi hoạt động qua dashboard thống kê chi tiết.",
        accent: "text-indigo-400",
        border: "border-indigo-400/20 hover:border-indigo-400/60",
    },
];

const STATS = [
    { value: "5+", label: "Vai trò người dùng" },
    { value: "AI", label: "Tích hợp Ollama LLM" },
    { value: "WS", label: "WebSocket real-time" },
    { value: "JWT", label: "Bảo mật xác thực" },
];

const STACK = [
    { name: "Spring Boot", cat: "Backend" },
    { name: "React / Next.js", cat: "Frontend" },
    { name: "MySQL + JPA", cat: "Database" },
    { name: "Ollama LLM", cat: "AI Engine" },
    { name: "WebSocket / STOMP", cat: "Real-time" },
    { name: "TypeScript", cat: "Language" },
];

// Heartbeat SVG path helper
function HeartbeatLine() {
    const pathRef = useRef<SVGPathElement>(null);
    useEffect(() => {
        const el = pathRef.current;
        if (!el) return;
        const len = el.getTotalLength();
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
        el.style.transition = "stroke-dashoffset 2s ease-in-out";
        setTimeout(() => {
            el.style.strokeDashoffset = "0";
        }, 400);
    }, []);

    return (
        <svg
            viewBox="0 0 900 120"
            className="w-full h-16 md:h-24 opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            <path
                ref={pathRef}
                d="M0,60 L100,60 L130,60 L145,20 L165,100 L185,10 L205,110 L225,60 L260,60 L800,60 L900,60"
                fill="none"
                stroke="#000a9c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref, threshold]);
    return visible;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useInView(ref as React.RefObject<Element>);
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default function AboutPage() {
    return (
        <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(29,63,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,#fafaff_0%,#f6f8ff_48%,#ffffff_100%)] text-foreground font-sans">
            {/* ── HERO ── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-1/4 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
                    <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-emerald-400/15 blur-[100px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-5xl rounded-[34px] border border-white/75 bg-white/75 px-6 py-10 shadow-[0_28px_90px_-48px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:px-10 md:py-14">
                    <p className="mb-6 inline-flex rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-sm">
                        Đồ án tốt nghiệp · Khoa Công nghệ Thông tin
                    </p>

                    <h1
                        className="mb-5 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl"
                    >
                        <span>Well</span>
                        <span className="text-primary">care</span>
                        <span>4u</span>
                    </h1>

                    <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-foreground/65 md:text-xl">
                        Hệ thống chăm sóc sức khỏe & đặt lịch khám bệnh trực tuyến,{" "}
                        <span className="font-semibold text-primary">tích hợp trí tuệ nhân tạo</span> để hỗ trợ cả bệnh nhân lẫn đội ngũ y tế.
                    </p>

                    <div className="mt-6">
                        <HeartbeatLine />
                    </div>

                    {/* Stats row */}
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {STATS.map((s) => (
                            <div key={s.label} className="rounded-2xl border border-white/80 bg-white/80 px-4 py-4 text-center shadow-sm backdrop-blur">
                                <div className="text-2xl font-bold text-primary md:text-3xl">{s.value}</div>
                                <div className="mt-1 text-xs font-medium tracking-wide text-foreground/45">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll cue */}
                <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-foreground/35">
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <div className="h-8 w-px bg-gradient-to-b from-primary/40 to-transparent" />
                </div>
            </section>

            {/* ── GIỚI THIỆU ── */}
            <section className="px-6 py-24">
                <div className="max-w-5xl mx-auto">
                    <FadeIn>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Về hệ thống</p>
                        <h2
                            className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                        >
                            Chăm sóc sức khỏe thế hệ mới
                        </h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <FadeIn delay={100}>
                            <p className="mb-5 text-base leading-relaxed text-foreground/65">
                                <strong className="text-foreground">Wellcare4u</strong> được xây dựng nhằm giải quyết những bất tiện trong quy trình
                                đặt khám bệnh truyền thống — chờ đợi lâu, hồ sơ rời rạc, thiếu kết nối giữa bệnh nhân và bác sĩ.
                            </p>
                            <p className="mb-5 text-base leading-relaxed text-foreground/65">
                                Ứng dụng hợp nhất toàn bộ hành trình y tế: từ khi đặt lịch, khám bệnh, nhận đơn thuốc, đến theo dõi sức khoẻ
                                lâu dài — trên một nền tảng duy nhất, bảo mật và dễ sử dụng.
                            </p>
                            <p className="text-base leading-relaxed text-foreground/65">
                                Điểm khác biệt nằm ở <span className="font-semibold text-primary">AI được chạy nội bộ</span> (Ollama), đảm bảo dữ liệu
                                nhạy cảm của người dùng không rời khỏi hệ thống, đồng thời vẫn cung cấp trợ lý thông minh hỗ trợ cả hai
                                phía.
                            </p>
                        </FadeIn>

                        <FadeIn delay={200}>
                            <div className="rounded-[30px] border border-white/75 bg-white/80 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.5)] backdrop-blur-xl">
                                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/45">Công nghệ sử dụng</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {STACK.map((t) => (
                                        <div
                                            key={t.name}
                                            className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm"
                                        >
                                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                            <div>
                                                <div className="text-sm font-semibold text-foreground">{t.name}</div>
                                                <div className="text-xs text-foreground/45">{t.cat}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ── TÍNH NĂNG ── */}
            <section className="border-y border-white/70 bg-white/40 px-6 py-24 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <FadeIn>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Tính năng chính</p>
                        <h2
                            className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                        >
                            Mọi thứ bạn cần, tất cả trong một
                        </h2>
                        <p className="mb-12 max-w-xl text-base text-foreground/50">
                            Thiết kế hướng đến từng vai trò cụ thể — từ bệnh nhân đến quản trị viên.
                        </p>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 80}>
                                <div
                                    className={`group h-full rounded-[28px] border bg-white/80 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 ${f.border}`}
                                >
                                    <div className={`${f.accent} mb-4`}>{f.icon}</div>
                                    <h3 className="mb-2 text-base font-bold text-foreground">{f.title}</h3>
                                    <p className="text-sm leading-relaxed text-foreground/60">{f.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── KIẾN TRÚC ── */}
            <section className="px-6 py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeIn>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Kiến trúc hệ thống</p>
                        <h2
                            className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                        >
                            Xây dựng để mở rộng
                        </h2>
                        <p className="mx-auto mb-14 max-w-lg text-base text-foreground/50">
                            Phân tách rõ ràng giữa các tầng giúp hệ thống dễ bảo trì và sẵn sàng nâng cấp.
                        </p>
                    </FadeIn>

                    <FadeIn delay={150}>
                        <div className="flex flex-col gap-4">
                            {[
                                {
                                    layer: "Presentation",
                                    tech: "React / Next.js + TypeScript",
                                    color: "border-cyan-400/40 bg-cyan-400/5",
                                    dot: "bg-cyan-400",
                                },
                                {
                                    layer: "API & Business Logic",
                                    tech: "Spring Boot + Spring Security (JWT)",
                                    color: "border-primary/20 bg-primary/5",
                                    dot: "bg-primary",
                                },
                                {
                                    layer: "Real-time Layer",
                                    tech: "WebSocket + STOMP",
                                    color: "border-green-400/40 bg-green-400/5",
                                    dot: "bg-green-400",
                                },
                                {
                                    layer: "AI Engine",
                                    tech: "Ollama (Local LLM) — dữ liệu không rời máy chủ",
                                    color: "border-amber-400/40 bg-amber-400/5",
                                    dot: "bg-amber-400",
                                },
                                {
                                    layer: "Data",
                                    tech: "MySQL + Spring Data JPA",
                                    color: "border-indigo-400/40 bg-indigo-400/5",
                                    dot: "bg-indigo-400",
                                },
                            ].map((l, i) => (
                                <div
                                    key={l.layer}
                                    className={`flex items-center gap-5 rounded-[24px] border px-6 py-4 text-left shadow-sm backdrop-blur ${l.color}`}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${l.dot}`} />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-bold text-foreground">{l.layer}</span>
                                        <span className="ml-3 text-sm text-foreground/55">{l.tech}</span>
                                    </div>
                                    <span className="text-xs font-semibold tabular-nums text-foreground/35">L{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── NHÓM THỰC HIỆN ── */}
            <section className="border-y border-white/70 bg-white/40 px-6 py-24 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto">
                    <FadeIn>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Nhóm thực hiện</p>
                        <h2
                            className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                        >
                            Con người đằng sau Wellcare4u
                        </h2>
                        <p className="mb-12 text-base text-foreground/50">
                            Sinh viên Khoa Công nghệ Thông tin — Đồ án tốt nghiệp 2025.
                        </p>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TEAM.map((m, i) => (
                            <FadeIn key={m.id} delay={i * 100}>
                                <div className="rounded-[30px] border border-white/75 bg-white/80 p-7 text-center shadow-[0_24px_70px_-48px_rgba(15,23,42,0.5)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white/90">
                                    {/* Avatar */}
                                    <div
                                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center mx-auto mb-5 text-white font-bold text-lg tracking-tight`}
                                    >
                                        {m.avatar}
                                    </div>
                                    <h3 className="mb-1 text-base font-bold text-foreground">{m.name}</h3>
                                    <p className="mb-3 font-mono text-xs text-foreground/45">{m.id}</p>
                                    <span className="inline-block rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                                        {m.role}
                                    </span>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MỤC TIÊU DỰ ÁN ── */}
            <section className="px-6 py-24">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Mục tiêu dự án</p>
                        <h2
                            className="mb-10 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                        >
                            Vì sao Wellcare4u ra đời?
                        </h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 gap-5">
                        {[
                            {
                                q: "Vấn đề thực tế",
                                a: "Quy trình đặt khám thủ công, hồ sơ bệnh án giấy rời rạc, thiếu kênh liên lạc trực tiếp giữa bệnh nhân và cơ sở y tế.",
                            },
                            {
                                q: "Giải pháp đề xuất",
                                a: "Số hóa toàn bộ quy trình trên một nền tảng web tích hợp, từ đặt lịch đến theo dõi điều trị.",
                            },
                            {
                                q: "Điểm khác biệt",
                                a: "AI chạy nội bộ (Ollama) đảm bảo dữ liệu y tế nhạy cảm không rời máy chủ, kết hợp thông báo real-time qua WebSocket.",
                            },
                            {
                                q: "Đối tượng hưởng lợi",
                                a: "Bệnh nhân cần tiện lợi — Bác sĩ cần công cụ quản lý — Phòng khám cần vận hành hiệu quả.",
                            },
                        ].map((item, i) => (
                            <FadeIn key={item.q} delay={i * 80}>
                                <div className="rounded-[28px] border border-white/75 bg-white/80 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.48)] backdrop-blur-xl">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{item.q}</p>
                                    <p className="text-sm leading-relaxed text-foreground/65">{item.a}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
