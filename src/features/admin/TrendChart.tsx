import { useState, useEffect, useCallback } from "react";
import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { getTrendData } from "./adminService";


type Period = "WEEK" | "MONTH" | "YEAR";

interface TrendPoint {
    label: string;
    users: number;
    appointments: number;
}

interface TrendsResponse {
    periodLabel: string;
    hasPrev: boolean;
    hasNext: boolean;
    trends: TrendPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
        }}>
            <p style={{ margin: "0 0 6px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                {label}
            </p>
            {payload.map((p: any) => (
                <div key={p.dataKey} style={{
                    display: "flex", alignItems: "center", gap: 8, marginBottom: 3
                }}>
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: p.color, flexShrink: 0
                    }} />
                    <span style={{ color: "var(--color-text-secondary)" }}>{p.name}:</span>
                    <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>
                        {p.value.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function TrendsChart() {
    const [period, setPeriod]     = useState<Period>("WEEK");
    const [offset, setOffset]     = useState(0);
    const [data, setData]         = useState<TrendsResponse | null>(null);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState<string | null>(null);

    const fetchTrends = useCallback(async (p: Period, o: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getTrendData(p, o);

            setData(res);
        } catch (e: any) {
            setError(e.message ?? "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrends(period, offset);
    }, [period, offset, fetchTrends]);

    // Reset offset when period changes
    const handlePeriodChange = (p: Period) => {
        setPeriod(p);
        setOffset(0);
    };

    const handlePrev = () => setOffset(o => o + 1);
    const handleNext = () => setOffset(o => Math.max(0, o - 1));

    const PERIODS: { key: Period; label: string }[] = [
        { key: "WEEK",  label: "Tuần" },
        { key: "MONTH", label: "Tháng" },
        { key: "YEAR",  label: "Năm" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ── Controls bar ── */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
            }}>

                {/* Period toggle */}
                <div style={{
                    display: "flex",
                    background: "var(--color-background-secondary)",
                    borderRadius: 8,
                    padding: 3,
                    gap: 2,
                }}>
                    {PERIODS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => handlePeriodChange(key)}
                            style={{
                                padding: "5px 16px",
                                border: "none",
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: period === key ? 500 : 400,
                                cursor: "pointer",
                                transition: "all 0.15s",
                                background: period === key
                                    ? "var(--color-background-primary)"
                                    : "transparent",
                                color: period === key
                                    ? "var(--color-text-primary)"
                                    : "var(--color-text-secondary)",
                                boxShadow: period === key
                                    ? "0 1px 3px rgba(0,0,0,0.08)"
                                    : "none",
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Navigator: < period label > */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <NavButton
                        onClick={handlePrev}
                        disabled={loading}
                        title="Kỳ trước"
                    >
                        ‹
                    </NavButton>

                    <span style={{
                        minWidth: 160,
                        textAlign: "center",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        padding: "5px 12px",
                        border: "0.5px solid var(--color-border-tertiary)",
                        borderRadius: 6,
                        background: "var(--color-background-primary)",
                    }}>
                        {loading
                            ? "Đang tải..."
                            : data?.periodLabel ?? "—"}
                    </span>

                    <NavButton
                        onClick={handleNext}
                        disabled={loading || !data?.hasNext}
                        title="Kỳ tiếp theo"
                    >
                        ›
                    </NavButton>

                    {/* Jump to current */}
                    {offset > 0 && (
                        <button
                            onClick={() => setOffset(0)}
                            title="Về kỳ hiện tại"
                            style={{
                                padding: "5px 10px",
                                fontSize: 11,
                                fontWeight: 500,
                                border: "0.5px solid var(--color-border-secondary)",
                                borderRadius: 6,
                                background: "transparent",
                                color: "var(--color-text-secondary)",
                                cursor: "pointer",
                                letterSpacing: "0.02em",
                            }}
                        >
                            Hiện tại
                        </button>
                    )}
                </div>
            </div>

            {/* ── Chart ── */}
            <div style={{ position: "relative", minHeight: 360 }}>
                {loading && (
                    <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "var(--color-background-primary)",
                        borderRadius: 8,
                        zIndex: 10,
                        opacity: 0.8,
                        fontSize: 14,
                        color: "var(--color-text-secondary)",
                    }}>
                        Đang tải dữ liệu...
                    </div>
                )}

                {error && !loading && (
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        height: 360, fontSize: 14,
                        color: "var(--color-text-danger)",
                    }}>
                        {error}
                    </div>
                )}

                {!error && (
                    <ResponsiveContainer width="100%" height={360}>
                        <LineChart
                            data={data?.trends ?? []}
                            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--color-border-tertiary)"
                            />

                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
                                axisLine={false}
                                tickLine={false}
                                interval={period === "MONTH" ? 3 : 0}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
                                axisLine={false}
                                tickLine={false}
                                width={36}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Legend
                                wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="users"
                                name="Người dùng mới"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                dot={period === "YEAR"
                                    ? { r: 4 }
                                    : { r: 3 }}
                                activeDot={{ r: 5 }}
                                animationDuration={400}
                            />

                            <Line
                                type="monotone"
                                dataKey="appointments"
                                name="Lịch hẹn"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                dot={period === "YEAR"
                                    ? { r: 4 }
                                    : { r: 3 }}
                                activeDot={{ r: 5 }}
                                animationDuration={400}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}


function NavButton({
    children, onClick, disabled, title,
}: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    title?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            style={{
                width: 30, height: 30,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "0.5px solid var(--color-border-secondary)",
                borderRadius: 6,
                background: "transparent",
                color: disabled
                    ? "var(--color-text-tertiary)"
                    : "var(--color-text-secondary)",
                cursor: disabled ? "not-allowed" : "pointer",
                fontSize: 18,
                lineHeight: 1,
                transition: "all 0.15s",
            }}
        >
            {children}
        </button>
    );
}