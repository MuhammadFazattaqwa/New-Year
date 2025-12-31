"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Copy, Heart, Share2, Sparkles } from "lucide-react";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
  year: number;
};
type NewYear2026LoveProps = { initialNow: number };

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const THEME_TARGET_UTC_MS = Date.UTC(2025, 11, 31, 17, 0, 0);
const DEFAULT_WISHLIST = [
  "Liburan bareng",
  "Nonton konser impian",
  "Rumah kecil hangat",
  "Karier naik level",
  "Tabungan bertambah",
  "Sehat keluarga",
  "Petualangan baru",
  "Kulineran kota baru",
  "Belajar hal baru",
  "Upgrade skill bareng",
  "Beli hadiah kecil",
  "Foto bareng di tempat impian",
  "Weekend staycation",
  "Jalan pagi bareng",
  "Kencan sederhana",
  "Makan malam spesial",
];

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTargetYear(nowMs: number) {
  const wibNow = new Date(nowMs + WIB_OFFSET_MS);
  return wibNow.getUTCFullYear() + 1;
}

function getTargetUtcMs(year: number) {
  return Date.UTC(year, 0, 1, 0, 0, 0) - WIB_OFFSET_MS;
}

function getCountdown(nowMs: number): Countdown {
  const targetYear = getTargetYear(nowMs);
  const diff = getTargetUtcMs(targetYear) - nowMs;
  const total = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(total / (3600 * 24));
  const hours = Math.floor((total % (3600 * 24)) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const done = nowMs >= THEME_TARGET_UTC_MS;
  return { days, hours, minutes, seconds, done, year: targetYear };
}

function fireworks(ms = 4200) {
  const end = Date.now() + ms;
  const colors = ["#f7d774", "#ff6b9a", "#8fd3ff", "#7be495", "#c9a3ff"];
  const defaults = {
    startVelocity: 42,
    spread: 80,
    ticks: 200,
    gravity: 1.05,
    scalar: 0.95,
    colors,
  };

  const frame = () => {
    const timeLeft = end - Date.now();
    const particleBase = Math.max(14, Math.floor(180 * (timeLeft / ms)));

    confetti({
      ...defaults,
      particleCount: Math.floor(particleBase * 0.35),
      angle: 60,
      origin: { x: 0, y: 0.78 },
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(particleBase * 0.35),
      angle: 120,
      origin: { x: 1, y: 0.78 },
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(particleBase * 0.3),
      angle: 90,
      spread: 140,
      startVelocity: 34,
      gravity: 0.9,
      origin: { x: 0.5, y: 0.18 },
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-ny backdrop-blur sm:px-5 sm:py-4">
      <div className="text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-[11px]">
        {label}
      </div>
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
}

type TimelineItem = { tag: string; title: string; desc: string };
type HopeCard = { title: string; hint: string; accent: string };

export default function NewYear2026Love({ initialNow }: NewYear2026LoveProps) {
  const [now, setNow] = useState(initialNow);
  const cd = useMemo(() => getCountdown(now), [now]);
  const stars = useMemo(() => {
    const rng = mulberry32(20260101);
    return Array.from({ length: 7 }).map(() => ({
      top: 5 + rng() * 45,
      left: -10 + rng() * 40,
      duration: 2 + rng() * 6,
      delay: rng() * 2.5,
    }));
  }, []);

  const [entered, setEntered] = useState(false);
  const [toName] = useState("Nataya Rachmawati");
  const [fromName] = useState("Muhammad Fazattaqwa");
  const [letter, setLetter] = useState(
    "Terima kasih sudah hadir dan bikin hariku lebih hangat.\nDi 2026 ini, semoga kita makin saling jaga, makin sayang, dan makin bahagia.\n\nAku pilih kamu — hari ini, besok, dan seterusnya. ❤️"
  );

  const [wishlist, setWishlist] = useState<string[]>(DEFAULT_WISHLIST);
  const [wishInput, setWishInput] = useState("");

  const [copied, setCopied] = useState(false);

  const timeline: TimelineItem[] = [
    { tag: "CHAPTER 01", title: "First Hello", desc: "Awal yang sederhana, tapi bikin deg-degan." },
    { tag: "CHAPTER 02", title: "Small Moments", desc: "Hal kecil yang ternyata paling ngena." },
    { tag: "CHAPTER 03", title: "Learning Love", desc: "Belajar ngerti, sabar, dan saling dengerin." },
    { tag: "CHAPTER 04", title: "New Connection", desc: "Nyaman pelan-pelan jadi rumah." },
    { tag: "CHAPTER 05", title: "Breakthrough", desc: "Berani pilih ‘kita’." },
    { tag: "CHAPTER 06", title: "Gratitude", desc: "Aku bersyukur—kamu ada." },
    { tag: "CHAPTER 07", title: "Grand Finale", desc: "Menutup 2025 dengan senyum & harapan." },
  ];

  const hopes: HopeCard[] = [
    { title: "LOVE", hint: "Makin sayang & makin dewasa.", accent: "text-pink-300" },
    { title: "HEALTH", hint: "Sehat bareng, panjang umur bareng.", accent: "text-emerald-300" },
    { title: "CAREER", hint: "Rezeki lancar, kerjaan berkah.", accent: "text-sky-300" },
    { title: "ADVENTURE", hint: "Lebih banyak jalan & cerita.", accent: "text-amber-300" },
    { title: "PEACE", hint: "Hati tenang, rumah hangat.", accent: "text-violet-300" },
    { title: "FAMILY", hint: "Hangat bareng keluarga.", accent: "text-rose-300" },
    { title: "FINANCE", hint: "Tabungan aman, rezeki lancar.", accent: "text-lime-300" },
    { title: "HOME", hint: "Rumah nyaman, hati tenang.", accent: "text-teal-300" },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ny-wishlist");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const cleaned = parsed
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean);
        if (cleaned.length) setWishlist(cleaned);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("ny-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (cd.done) fireworks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cd.done]);

  function enter() {
    setEntered(true);
    fireworks(1400);
    setTimeout(() => scrollToId("hero"), 120);
  }

  function shareWA() {
    const url = window.location.href;
    const text = cd.done
      ? `Happy New Year 2026, ${toName}! ❤️\n\nDari ${fromName}:\n${letter}\n\n${url}`
      : `Aku bikinin website Tahun Baru 2026 buat kamu, ${toName} ❤️\n\nDari ${fromName}:\n${letter}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {}
  }

  function addWish() {
    const cleaned = wishInput.trim();
    if (!cleaned) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => item.toLowerCase() === cleaned.toLowerCase());
      return exists ? prev : [cleaned, ...prev];
    });
    setWishInput("");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND (Tailwind-only via bg-[...] + overlay layers) */}
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:120px_120px]" />

      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_30%,rgba(255,183,77,0.10),transparent_55%),radial-gradient(circle_at_10%_80%,rgba(236,72,153,0.08),transparent_55%),radial-gradient(circle_at_90%_80%,rgba(139,92,246,0.08),transparent_55%),radial-gradient(circle_at_50%_50%,transparent_55%,rgba(0,0,0,0.88)_100%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(236,72,153,0.65)_1px,transparent_1px),radial-gradient(rgba(34,197,94,0.55)_1px,transparent_1px),radial-gradient(rgba(168,85,247,0.55)_1px,transparent_1px)] [background-size:380px_380px,520px_520px,640px_640px] [background-position:20px_60px,120px_180px,260px_40px]" />

      {/* Shooting stars (animasi dari tailwind.config.ts) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[180px] rotate-[12deg] bg-gradient-to-r from-white/0 via-amber-200/70 to-white/0 opacity-35 blur-[0.2px] animate-nyStar"
            style={
              {
                top: `${star.top}%`,
                left: `${star.left}%`,
                ["--d" as any]: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* SECTION 1: COUNTDOWN + ENTER */}
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-14">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs backdrop-blur sm:px-4 sm:text-sm">
          <Sparkles className="h-4 w-4 text-amber-200" />
          <span className="text-sm text-white/80">Happy New Year | Natasya Rachmawati</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-xs sm:tracking-[0.25em]">
            Countdown to 1 Jan {cd.year} • WIB
          </div>

          {/* Angka besar ala video */}
          <div className="flex flex-wrap items-end justify-center gap-3">
            <div className="text-[clamp(32px,10vw,64px)] font-bold tracking-[-0.04em] text-white/90">
              {pad(cd.days)}
            </div>
            <div className="translate-y-[-6px] text-[clamp(18px,6vw,44px)] text-white/35">:</div>
            <div className="text-[clamp(32px,10vw,64px)] font-bold tracking-[-0.04em] text-white/90">
              {pad(cd.hours)}
            </div>
            <div className="translate-y-[-6px] text-[clamp(18px,6vw,44px)] text-white/35">:</div>
            <div className="text-[clamp(32px,10vw,64px)] font-bold tracking-[-0.04em] text-white/90">
              {pad(cd.minutes)}
            </div>
            <div className="translate-y-[-6px] text-[clamp(18px,6vw,44px)] text-white/35">:</div>
            <div className="text-[clamp(32px,10vw,64px)] font-bold tracking-[-0.04em] text-white/90">
              {pad(cd.seconds)}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/45 sm:gap-6 sm:text-[11px] sm:tracking-[0.25em]">
            <span>Days</span>
            <span>Hours</span>
            <span>Minutes</span>
            <span>Seconds</span>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={enter}
              className="rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-white/5 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition hover:bg-white/10 sm:px-6 sm:text-xs"
            >
              ENTER 2026
            </button>
            <div className="text-[11px] text-white/55 sm:text-xs">
              with <span className="text-pink-200">love</span> — untuk{" "}
              <span className="font-semibold text-white">{toName}</span>
            </div>
          </div>
        </motion.div>

        {/* Mini input */}
        <div className="mt-10 grid w-full max-w-2xl gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-[11px] sm:tracking-[0.22em]">
              Untuk
            </label>
            <input
              className="h-11 rounded-2xl border border-white/10 bg-black/25 px-4 text-white/90 outline-none focus:border-white/25"
              value={toName}
              readOnly
              placeholder="Nama dia"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-[11px] sm:tracking-[0.22em]">
              Dari
            </label>
            <input
              className="h-11 rounded-2xl border border-white/10 bg-black/25 px-4 text-white/90 outline-none focus:border-white/25"
              value={fromName}
              readOnly
              placeholder="Nama kamu"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: HERO 2026 + globe */}
      <section id="hero" className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-ny backdrop-blur sm:rounded-[32px] sm:p-8 md:p-12">
          {/* globe / wireframe (pakai Tailwind + inline background) */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 opacity-60 sm:h-[520px] sm:w-[520px] md:h-[640px] md:w-[640px] animate-nyPulse"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06), transparent 60%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0 1px, transparent 12px 26px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 18px 34px)",
            }}
          />

          <div className="relative z-10 text-center">
            <div className="text-[clamp(48px,14vw,120px)] font-extrabold tracking-[-0.06em] text-white/20">
              2026
            </div>
            <div className="mt-2 text-xl font-semibold text-amber-200/95 drop-shadow sm:text-2xl md:text-3xl">
              Happy New Year
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
              Semoga 2026 lebih manis — lebih banyak tawa, lebih sedikit lelah, dan lebih banyak “kita”.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 sm:px-4 sm:text-sm"
                onClick={() => scrollToId("letter")}
              >
                Buka Surat 💌
              </button>
              <button
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 sm:px-4 sm:text-sm"
                onClick={() => scrollToId("journey")}
              >
                Lihat Journey
              </button>
              <button
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 sm:px-4 sm:text-sm"
                onClick={() => scrollToId("hopes")}
              >
                Hopes for 2026
              </button>
            </div>
          </div>
        </div>

        {/* Quick stats (opsional, biar makin “premium”) */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Hari" value={String(cd.days)} />
          <StatCard label="Jam" value={pad(cd.hours)} />
          <StatCard label="Menit" value={pad(cd.minutes)} />
          <StatCard label="Detik" value={pad(cd.seconds)} />
        </div>
      </section>

      {/* SECTION 3: LETTER (circle look) */}
      <section id="letter" className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 shadow-ny backdrop-blur sm:p-6 md:p-8">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-200" />
              <h2 className="text-lg font-semibold sm:text-xl">Surat Tahun Baru</h2>
            </div>

            <label className="text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-[11px] sm:tracking-[0.22em]">
              Isi pesan
            </label>
            <textarea
              className="mt-2 min-h-[180px] w-full resize-none rounded-2xl border border-white/10 bg-black/25 p-4 text-white/90 outline-none focus:border-white/25 sm:min-h-[200px]"
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                onClick={shareWA}
              >
                <Share2 className="h-4 w-4" />
                Share WA
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                onClick={copyLink}
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy link"}
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => fireworks(1600)}
              >
                <Sparkles className="h-4 w-4 text-amber-200" />
                Sparkle
              </button>
            </div>
          </div>

          {/* Circle display */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center sm:max-w-[520px]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-full shadow-ny">
              <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 backdrop-blur" />
              <div className="absolute inset-0 opacity-90 [background:radial-gradient(circle_at_30%_30%,rgba(255,205,120,0.12),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.10),transparent_55%)]" />
              <div className="relative z-10 p-6 text-center sm:p-10">
                <div className="text-xl font-semibold text-amber-200/95 drop-shadow sm:text-2xl">
                  Happy New Year
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/50">
                  special message
                </div>

                <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                  {letter}
                </div>

                <div className="mt-6 text-xs text-white/55">
                  — <span className="font-semibold text-white">{fromName}</span> untuk{" "}
                  <span className="font-semibold text-white">{toName}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: JOURNEY timeline */}
      <section id="journey" className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-20">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-[11px] sm:tracking-[0.25em]">
            2025 Journey (our story)
          </div>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl md:text-4xl">
            Perjalanan kecil yang berarti
          </h2>
        </div>

        <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-[1fr,40px,1fr]">
          <div className="hidden md:block" />

          {/* spine */}
          <div className="relative mx-auto w-[40px]">
            <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-amber-200/0 via-amber-200/40 to-amber-200/0" />
          </div>

          <div className="grid gap-6">
            {timeline.map((it, idx) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, x: 18, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.2) }}
                className="relative"
              >
                {/* node */}
                <div className="absolute -left-[54px] top-6 hidden md:block">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-200/35 bg-black/30">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-200/85 shadow-[0_0_16px_rgba(255,205,120,0.22)]" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-ny backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-amber-200/80">{it.tag}</div>
                  <div className="mt-1 text-lg font-semibold">{it.title}</div>
                  <div className="mt-2 text-sm text-white/70">{it.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOPES deck */}
      <section id="hopes" className="relative mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 md:pb-28 md:pt-14">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-[11px] sm:tracking-[0.25em]">
            Hopes for 2026
          </div>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl md:text-4xl">
            Harapan yang pengin kita wujudkan
          </h2>
        </div>

        <div className="mt-8 grid w-full gap-6 sm:mt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hopes.map((c, i) => (
              <motion.div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-ny backdrop-blur"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.04 * i }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-xs font-semibold tracking-[0.28em] ${c.accent}`}>{c.title}</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">2026</div>
                </div>
                <div className="mt-4 text-base font-semibold text-white sm:text-lg">Wish Card</div>
                <div className="mt-2 text-sm text-white/70">{c.hint}</div>
                <div className="mt-6 text-xs text-white/50">
                  Dari {fromName} untuk {toName}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-ny backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/80">
                Wishlist
              </div>
              <div className="text-[10px] text-white/45 sm:text-[11px]">Tersimpan otomatis</div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                className="h-11 flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 text-white/90 outline-none focus:border-white/25"
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addWish();
                }}
                placeholder="Tambah wishlist baru"
              />
              <button
                className="h-11 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold uppercase tracking-[0.14em] hover:bg-white/10"
                onClick={addWish}
              >
                Tambah
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.length === 0 ? (
                <div className="text-sm text-white/55">Belum ada wishlist.</div>
              ) : (
                wishlist.map((item, idx) => (
                  <div
                    key={`${item}-${idx}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                      #{String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-1 font-medium text-white/90">{item}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              onClick={() => fireworks(1600)}
            >
              <Sparkles className="h-4 w-4 text-amber-200" />
              Celebrate
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              onClick={shareWA}
            >
              <Share2 className="h-4 w-4" />
              Share WA
            </button>
          </div>

          <div className="mt-6 text-center text-[10px] text-white/35 sm:text-[11px]">
            Target: 1 Jan {cd.year} 00:00 WIB 
          </div>
        </div>
      </section>

      {/* Badge setelah ENTER */}
      <AnimatePresence>
        {entered && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
          >
            🎉 Kamu sudah masuk ke 2026 dengan penuh cinta! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
