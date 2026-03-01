export default function Home() {
  return (
    <div className="w-full bg-background text-foreground">
      <section className="relative min-h-screen overflow-hidden px-6 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-left">
            <p
              className="animate-heroReveal mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary"
              style={{ animationDelay: "0.05s" }}
            >
              CARE4U - NỀN TẢNG Y TẾ SỐ
            </p>

            <h1
              className="animate-heroReveal mb-6 text-4xl font-extrabold leading-tight md:text-6xl"
              style={{ animationDelay: "0.15s" }}
            >
              Chăm sóc sức khỏe dễ dàng
              <br />
              <span className="text-primary">trong một ứng dụng</span>
            </h1>

            <p
              className="animate-heroReveal mb-9 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-xl"
              style={{ animationDelay: "0.25s" }}
            >
              Theo dõi sức khỏe, đặt lịch bác sĩ, nhận nhắc nhở dùng thuốc và quản lý hồ sơ cá nhân.
              Mọi tính năng cần thiết đều được tập trung trong một nền tảng để bạn sử dụng hằng ngày.
            </p>

            <div
              className="animate-heroReveal mb-10 flex flex-col gap-4 sm:flex-row"
              style={{ animationDelay: "0.35s" }}
            >
              <a className="rounded-xl bg-primary px-9 py-4 font-semibold text-white shadow-xl transition hover:scale-[1.02]"
              href="/login">
                Bắt đầu miễn phí
              </a>
              <a className="rounded-xl border-2 border-primary px-9 py-4 font-semibold text-primary transition hover:bg-primary hover:text-white">
                Xem tính năng
              </a>
            </div>

            <div
              className="animate-heroReveal flex flex-wrap items-center gap-5 text-sm font-medium text-foreground/65"
              style={{ animationDelay: "0.45s" }}
            >
              <div>Đặt lịch nhanh chóng</div>
              <div>Nhắc nhở thông minh</div>
              <div>Hồ sơ sức khỏe rõ ràng</div>
            </div>
          </div>

          <div className="animate-heroReveal relative" style={{ animationDelay: "0.3s" }}>
            <div className="animate-heroFloat rounded-3xl border border-primary/15 bg-white/90 p-6 shadow-[0_35px_80px_-35px_rgba(0,10,156,0.45)] backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/55">
                    Tổng quan hôm nay
                  </p>
                  <h3 className="text-xl font-bold text-foreground">
                    Bảng điều khiển người dùng
                  </h3>
                </div>
                <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
                  Ổn định
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-primary/10 bg-primary/6 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span className="text-foreground/75">Lịch hẹn đã xác nhận</span>
                    <span className="text-primary">3 lịch</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                    <div className="h-full w-[75%] rounded-full bg-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-secondary/20 bg-secondary/8 p-4">
                    <p className="text-xs font-semibold text-foreground/60">Nhắc uống thuốc</p>
                    <p className="mt-1 text-2xl font-bold text-secondary">2 lần</p>
                  </div>
                  <div className="rounded-2xl border border-primary/15 bg-primary/8 p-4">
                    <p className="text-xs font-semibold text-foreground/60">Chỉ số ổn định</p>
                    <p className="mt-1 text-2xl font-bold text-primary">98%</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="animate-heroFloat absolute -left-6 top-8 hidden rounded-xl border border-secondary/25 bg-white/90 px-4 py-3 shadow-lg md:block"
              style={{ animationDelay: "0.8s" }}
            >
              <p className="text-xs font-medium text-foreground/60">Trợ lý AI</p>
              <p className="text-sm font-bold text-secondary">Gợi ý trong 2 phút</p>
            </div>

            <div
              className="animate-heroFloat absolute -right-4 -bottom-4 rounded-xl border border-primary/20 bg-white/95 px-4 py-3 shadow-lg"
              style={{ animationDelay: "1.2s" }}
            >
              <p className="text-xs font-medium text-foreground/60">Lịch sắp tới</p>
              <p className="text-sm font-bold text-primary">09:30 - Khám tổng quát</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Những gì bạn có thể làm ngay</h2>
          <p className="mx-auto max-w-2xl text-foreground/70">
            Care4U tập trung vào các thao tác thực tế để bạn sử dụng mỗi ngày, đơn giản và hiệu quả.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-10 shadow-2xl transition hover:shadow-3xl">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">01</div>
            <h3 className="mb-4 text-2xl font-semibold">Đặt lịch khám</h3>
            <p className="leading-relaxed text-foreground/70">
              Chọn bác sĩ, xem khung giờ trống và đặt lịch chỉ trong vài bước.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-2xl transition hover:shadow-3xl">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-2xl text-secondary">02</div>
            <h3 className="mb-4 text-2xl font-semibold">Quản lý hồ sơ</h3>
            <p className="leading-relaxed text-foreground/70">
              Lưu kết quả khám, đơn thuốc và lịch sử sức khỏe để theo dõi lâu dài.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-2xl transition hover:shadow-3xl">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">03</div>
            <h3 className="mb-4 text-2xl font-semibold">Nhận nhắc nhở thông minh</h3>
            <p className="leading-relaxed text-foreground/70">
              Nhận thông báo lịch khám và lịch dùng thuốc đúng lúc, không bỏ sót.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-bold">Bắt đầu trong 3 bước đơn giản</h2>
            <p className="mb-6 leading-relaxed text-foreground/70">
              Đây là một nền tảng được thiết kế để sử dụng hằng ngày. Bạn không cần học phức tạp,
              chỉ cần bắt đầu và trải nghiệm.
            </p>

            <div className="space-y-4 text-foreground/80">
              <div className="rounded-xl border border-primary/10 bg-white/80 px-4 py-3">
                Tạo tài khoản và cập nhật thông tin cá nhân cơ bản.
              </div>
              <div className="rounded-xl border border-primary/10 bg-white/80 px-4 py-3">
                Chọn dịch vụ bạn cần: đặt lịch, theo dõi sức khỏe, nhắc nhở.
              </div>
              <div className="rounded-xl border border-primary/10 bg-white/80 px-4 py-3">
                Bắt đầu sử dụng ngay trên bảng điều khiển rõ ràng và trực quan.
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-12 text-center shadow-2xl">
            <div className="mb-4 text-5xl font-bold text-primary">10,000+</div>
            <div className="mb-6 text-foreground/70">Người dùng đang sử dụng Care4U</div>

            <div className="mb-4 text-5xl font-bold text-primary">500+</div>
            <div className="text-foreground/70">Lịch hẹn được tạo mới mỗi ngày</div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <h2 className="mb-6 text-4xl font-bold">Sẵn sàng quản lý sức khỏe tốt hơn?</h2>
        <p className="mx-auto mb-10 max-w-2xl text-foreground/70">
          Bắt đầu với Care4U hôm nay để theo dõi sức khỏe, đặt lịch nhanh chóng và nhận nhắc nhở đầy đủ.
        </p>

        <button className="rounded-2xl bg-primary px-12 py-5 text-lg font-semibold text-white shadow-2xl transition hover:scale-105">
          Tạo tài khoản miễn phí
        </button>
      </section>

      <footer className="bg-primary py-10 text-center text-white">
        <div className="mb-2 text-lg font-semibold">Care4U</div>
        <div className="text-sm opacity-80">
          © 2026 Care4U HealthTech Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}