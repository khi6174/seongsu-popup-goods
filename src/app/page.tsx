// S1 홈 — 성수동 팝업 큐레이션.
import { getAllPopups } from "@/lib/queries";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { PopupCard } from "@/components/PopupCard";

export default async function HomePage() {
  const [popups, locale] = await Promise.all([getAllPopups(), getLocale()]);

  return (
    <div>
      {/* 히어로 (지원: 첫 화면에서 팝업의 두근거림) */}
      <section className="mb-8 overflow-hidden rounded-lg bg-gradient-to-br from-peach via-lavender to-sky p-8 sm:p-10">
        <span className="inline-block rounded-full bg-white/80 px-3 py-1 font-display text-xs font-bold text-coral-deep">
          🎪 SEONGSU POP-UP
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-4xl">
          {translate(locale, "home.heading")}
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          {translate(locale, "home.sub")}
        </p>
      </section>

      <section id="popups">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popups.map((p, i) => (
            <PopupCard key={p.id} popup={p} locale={locale} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
