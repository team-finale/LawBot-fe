// src/sections/ConsultantsSection.tsx
import React, { useRef } from "react";

/**
 * 이로운(2lawon) — 노무사 소개 섹션
 * - 세련된 타이포 & 여백
 * - 가로 스크롤 + 스냅 + 엣지 페이드 + 화살표 네비
 * - 카드 간 여유 간격, 중앙정렬
 */
export default function ConsultantsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const consultants = [
    { img: "/images/expert1.png", name: "김민정 노무사", desc: "임금·보상 / 8년",  sub: "상생 관점의 임금·보상 전문가" },
    { img: "/images/expert3.png", name: "이재훈 노무사", desc: "계약·해고 / 12년", sub: "해고 분쟁·노동위 대리 풍부" },
    { img: "/images/expert2.png", name: "박현우 노무사", desc: "산업재해 / 5년",  sub: "산재·계약 분쟁 조정 경험 다수" },
    { img: "/images/expert4.png", name: "최윤석 노무사", desc: "비정규직 / 6년",  sub: "특고·비정규 보호 이슈 전문" },
    { img: "/images/expert5.png", name: "정해민 노무사", desc: "노사관계 / 9년",  sub: "단협·취규 자문 다수" },
  ];

  const scrollByCards = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = (dir === "left" ? -1 : 1) * el.clientWidth * 0.7; // 카드 2~3장 분량
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="relative py-[clamp(52px,10vw,120px)] bg-[#f7f8fa]">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px] font-[Pretendard,Inter,system-ui,sans-serif]">
        {/* 헤더 */}
        <header className="text-center mb-[clamp(36px,6vw,72px)]">
          <h2 className="text-[clamp(26px,3.6vw,40px)] font-black tracking-[-0.01em] text-[#0f172a]">
            이로운과 함께하는 노무사들
          </h2>
          <p className="mt-3 text-[clamp(15px,1.4vw,18px)] leading-relaxed text-[#475569]">
            전문가와 함께하는 이로운. 걱정마세요! <span className="hidden md:inline">옆으로 넘겨 더 만나보세요.</span>
          </p>
        </header>

        {/* 가로 스크롤 래퍼 */}
        <div className="relative">
          {/* 좌/우 엣지 페이드 (스크롤 힌트) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-12 bg-gradient-to-r from-[#f7f8fa] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-12 bg-gradient-to-l from-[#f7f8fa] to-transparent" />

          {/* 데스크톱 네비 */}
          <button
            onClick={() => scrollByCards("left")}
            aria-label="왼쪽으로 스크롤"
            className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2
                       h-10 w-10 rounded-full bg-white/90 border border-[#e5e7eb] shadow
                       hover:bg-white transition z-10"
          >
            ‹
          </button>
          <button
            onClick={() => scrollByCards("right")}
            aria-label="오른쪽으로 스크롤"
            className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2
                       h-10 w-10 rounded-full bg-white/90 border border-[#e5e7eb] shadow
                       hover:bg-white transition z-10"
          >
            ›
          </button>

          {/* 카드 트랙 */}
          <div
            ref={trackRef}
            className="flex gap-7 sm:gap-9 md:gap-12 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pr-2
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-center"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* 좌측 여백(스냅 보정) */}
            <div className="shrink-0 w-2 sm:w-3 md:w-4" aria-hidden />

            {consultants.map((c, i) => (
              <article
                key={i}
                className="shrink-0 snap-start text-center
                           w-[70vw] xs:w-[52vw] sm:w-[38vw] md:w-[26vw] lg:w-[21vw]
                           max-w-[250px] min-w-[190px]
                           bg-white rounded-[22px] p-6
                           border border-[#eef0f4]
                           shadow-[0_6px_18px_rgba(15,23,42,0.05)]
                           hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:-translate-y-[2px]
                           transition-all duration-300"
              >
                {/* 이미지 영역 */}
                <div className="aspect-square rounded-[18px] overflow-hidden mb-5
                                bg-[radial-gradient(65%_65%_at_50%_40%,#f3f4f6_0%,#ffffff_100%)]
                                ring-1 ring-[#eceff3]/80 flex items-center justify-center">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-[68%] object-contain drop-shadow"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* 이름 (강조) */}
               <h3 className="text-[17.5px] sm:text-[19px] font-extrabold text-[#111827] leading-tight tracking-tight drop-shadow-[0_0.4px_0.4px_rgba(0,0,0,0.1)] mb-1">
                  {c.name}
               </h3>
                {/* 간단 설명(조금 선명하게) */}
                <p className="text-[13.5px] font-semibold text-[#334155]">
                  {c.desc}
                </p>
                {/* 보조 설명 */}
                <p className="mt-1.5 text-[13px] text-[#475569] leading-relaxed">
                  {c.sub}
                </p>
              </article>
            ))}

            {/* 우측 여백(스냅 보정) */}
            <div className="shrink-0 w-2 sm:w-3 md:w-4" aria-hidden />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-[clamp(40px,5vw,68px)]">
          <a
            href="#consult"
            className="inline-block px-6 py-3 rounded-2xl bg-[#624E3E] text-white
                       text-[15px] sm:text-[16px] font-semibold tracking-tight
                       shadow-[0_6px_16px_rgba(98,78,62,0.18)]
                       hover:opacity-95 active:opacity-90 transition"
          >
            전문가 상담 시작하기
          </a>
        </div>
      </div>
    </section>
  );
}
