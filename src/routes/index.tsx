import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowDown, ArrowLeft, ArrowRight, Check, Copy, Instagram, Loader2, Menu, MessageCircle, X } from "lucide-react";
import { z } from "zod";

import heroAsset from "@/assets/cutco-hero.jpg.asset.json";
const heroImage = heroAsset.url;
import style1Asset from "@/assets/cutco-style-1.jpg.asset.json";
const style1 = style1Asset.url;
import style2Asset from "@/assets/cutco-style-2.jpg.asset.json";
const style2 = style2Asset.url;
import style3Asset from "@/assets/cutco-style-3.jpg.asset.json";
const style3 = style3Asset.url;
import style4Asset from "@/assets/cutco-style-4.jpg.asset.json";
const style4 = style4Asset.url;
import style5Asset from "@/assets/cutco-style-5.jpg.asset.json";
const style5 = style5Asset.url;
import style6Asset from "@/assets/cutco-style-6.jpg.asset.json";
const style6 = style6Asset.url;
import beforeAfterAsset from "@/assets/cutco-before-after.jpg.asset.json";
const beforeAfterImage = beforeAfterAsset.url;
import barbersAsset from "@/assets/cutco-barbers.jpg.asset.json";
const barbersSheet = barbersAsset.url;
import aboutAsset from "@/assets/cutco-about.jpg.asset.json";
const aboutImage = aboutAsset.url;
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CUT & CO. — Potongan Rapi, Gaya Sendiri." },
      { name: "description", content: "Temukan gaya rambutmu, kenali barber kami, dan buat janji di CUT & CO." },
      { property: "og:title", content: "CUT & CO. — Potongan Rapi, Gaya Sendiri." },
      { property: "og:description", content: "Potongan pas, styling tepat, dan barber yang paham gayamu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CutAndCo,
});

const services = [
  { name: "Signature Cut", description: "Potongan sesuai bentuk dan gaya rambutmu.", duration: "45 menit", price: "Rp50K" },
  { name: "Cut & Wash", description: "Potong, keramas, dan styling.", duration: "60 menit", price: "Rp70K" },
  { name: "Beard Trim", description: "Rapikan janggut hingga detail akhir.", duration: "30 menit", price: "Rp35K" },
  { name: "Full Grooming", description: "Potong, keramas, rapikan janggut, dan styling.", duration: "90 menit", price: "Rp100K" },
];

const styles = [
  { category: "Classic", name: "SIDE PART", copy: "Belahan klasik, rapi tanpa banyak usaha.", duration: "50 MENIT", image: style4 },
  { category: "Fade", name: "LOW TAPER", copy: "Sisi rapi, bagian atas tetap natural.", duration: "45 MENIT", image: style1 },
  { category: "Textured", name: "TEXTURED CROP", copy: "Tekstur hidup dengan hasil akhir halus.", duration: "45 MENIT", image: style2 },
  { category: "Long", name: "LONG LAYERS", copy: "Lebih berbentuk tanpa kehilangan panjang.", duration: "60 MENIT", image: style3 },
  { category: "Clean", name: "CLEAN FADE", copy: "Gradasi tegas dengan hasil akhir bersih.", duration: "45 MENIT", image: style6 },
];

const barbers = [
  { name: "RAKA", role: "Senior Barber", specialties: "Fade, tekstur, potongan modern", meta: "8 tahun · 4.9 / 5", position: "0%" },
  { name: "DIMAS", role: "Barber", specialties: "Classic, potong gunting", meta: "6 tahun · 4.8 / 5", position: "33.333%" },
  { name: "ARDI", role: "Barber", specialties: "Fade, janggut", meta: "5 tahun · 4.9 / 5", position: "66.666%" },
  { name: "NIKO", role: "Barber", specialties: "Rambut panjang, styling", meta: "7 tahun · 4.8 / 5", position: "100%" },
];

const paymentMethods = [
  { id: "qris", name: "QRIS", detail: "Scan dan bayar lewat e-wallet" },
  { id: "gopay", name: "GoPay / OVO / Dana", detail: "Bayar dari saldo e-wallet" },
  { id: "transfer", name: "Bank Transfer", detail: "Virtual account BCA" },
  { id: "cash", name: "Bayar di tempat", detail: "Bayar tunai saat datang" },
];

const stats = [
  { value: 1200, suffix: "+", label: "POTONGAN", note: "sejak hari pertama" },
  { value: 4.9, suffix: "/5", label: "RATING RATA-RATA", note: "dari ulasan pelanggan", decimals: 1 },
  { value: 98, suffix: "%", label: "PELANGGAN KEMBALI", note: "datang lagi untuk potong rambut" },
  { value: 26, suffix: " THN", label: "PENGALAMAN TIM", note: "dari empat barber" },
];

const bookingSteps = ["Layanan", "Barber", "Tanggal", "Jam", "Data diri", "Tinjau", "Bayar", "Selesai"];
const slots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
const unavailable = new Set(["11:00", "13:00", "15:30", "17:30", "19:00"]);
const testimonials = [
  { quote: "AKHIRNYA KETEMU BARBER YANG PAHAM MAU SAYA.", name: "RIZKY A.", service: "SIGNATURE CUT", rating: "4.9" },
  { quote: "HASILNYA RAPI, TIDAK TERBURU-BURU, SARANNYA JUGA PAS.", name: "BIMA P.", service: "CUT & WASH", rating: "4.9" },
  { quote: "BARU KALI INI SAYA BENAR-BENAR PAHAM RAMBUT SENDIRI.", name: "ARGA N.", service: "FULL GROOMING", rating: "5.0" },
];

function CutAndCo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [styleIndex, setStyleIndex] = useState(1);
  const [slider, setSlider] = useState(50);
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [service, setService] = useState("");
  const [barber, setBarber] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({ name: "", phone: "", email: "", note: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const selectedService = services.find((item) => item.name === service);
  const activeStyle = styles[styleIndex] ?? styles[0];
  if (!activeStyle) return null;
  const activeTestimonial = testimonials[testimonialIndex] ?? testimonials[0];

  const goBook = (nextService?: string, nextBarber?: string) => {
    if (nextService) setService(nextService);
    if (nextBarber) setBarber(nextBarber);
    setBookingStep(nextService ? 1 : 0);
    setBookingOpen(true);
  };

  return (
    <div className="bg-background text-foreground">
      <Header compact={compact} menuOpen={menuOpen} setMenuOpen={setMenuOpen} goBook={goBook} />

      <section id="top" className="relative min-h-[92svh] overflow-hidden bg-dark text-dark-foreground lg:min-h-[105svh]">
        <img src={heroImage} width={1920} height={1200} alt="Barber merapikan potongan textured crop" className="image-breathe absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-t from-dark/90 via-dark/35 to-dark/10" />
        <div className="relative mx-auto flex min-h-[92svh] max-w-[1600px] flex-col justify-end px-5 pb-8 pt-28 sm:px-8 lg:min-h-[105svh] lg:px-12 lg:pb-12">
          <div className="grid grid-cols-12 items-end gap-4 lg:gap-8">
            <div className="col-span-12 lg:col-span-9">
              <p className="hero-fade mono-label mb-5 text-dark-foreground/80" style={{ "--d": "80ms" } as React.CSSProperties}>JAKARTA · EST. 2026</p>
              <h1 className="editorial-display max-w-[1100px]">
                <span className="hero-mask"><span className="hero-rise" style={{ "--d": "160ms" } as React.CSSProperties}>LOOK GOOD.</span></span>
                <span className="hero-mask"><span className="hero-rise" style={{ "--d": "320ms" } as React.CSSProperties}>FEEL SHARP.</span></span>
              </h1>
            </div>
            <div className="hero-fade col-span-12 mt-7 lg:col-span-3 lg:mt-0" style={{ "--d": "500ms" } as React.CSSProperties}>
              <p className="max-w-sm text-base leading-relaxed text-dark-foreground/85">Potongan pas, styling tepat, dan barber yang paham gayamu.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="lime" size="lg" onClick={() => goBook()}>Booking sekarang</Button>
                <Button asChild variant="inverse" size="lg"><a href="#styles">Lihat gaya</a></Button>
              </div>
            </div>
          </div>
          <div className="mt-10 flex items-end justify-between border-t border-dark-foreground/35 pt-4">
            <p className="mono-label"><span className="mr-2 inline-block size-2 bg-highlight" /> Buka hari ini<br /><span className="ml-4 text-dark-foreground/65">10:00 — 21:00</span></p>
            <ArrowDown className="size-5" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-8">
          <div className="flex flex-col lg:py-3">
            <div className="max-w-xl">
              <p className="mono-label mb-8">01 / ABOUT US</p>
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">CERITA DI BALIK<br />SETIAP POTONGAN.</h2>
              <p className="mt-6 text-lg leading-relaxed">Bagi kami, potongan yang tepat bukan soal tren. Semuanya dimulai dari mendengar apa yang kamu mau, lalu mengerjakannya dengan detail.</p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Berawal dari Jakarta, kami membuat ruang untuk datang, duduk, dan pulang dengan gaya yang terasa pas.</p>
              <div className="mt-9 flex items-baseline gap-3 border-t border-foreground/30 pt-6">
                <strong className="text-4xl font-extrabold">4</strong>
                <span className="mono-label">Barber berpengalaman</span>
              </div>
            </div>
            <div className="mt-8 aspect-[4/3] w-full overflow-hidden sm:max-w-[82%] lg:mt-10 lg:max-w-[88%]">
              <div className="size-full bg-no-repeat" role="img" aria-label="Barber CUT & CO. sedang bekerja" style={{ backgroundImage: `url(${barbersSheet})`, backgroundSize: "400% auto", backgroundPosition: "66.666% center" }} />
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[720px]">
            <img src={aboutImage} width={1024} height={1280} loading="lazy" alt="Barber CUT & CO. sedang memotong rambut pelanggan" className="size-full object-cover object-center" />
          </div>
        </div>
      </section>




      <section className="section-pad bg-dark text-dark-foreground">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="page-grid items-end">
            <div className="col-span-12 lg:col-span-8"><p className="mono-label mb-5">02 / THE PROOF</p><h2 className="section-title">ANGKA YANG<br />BICARA.</h2></div>
            <p className="col-span-12 mt-4 text-lg text-dark-foreground/70 lg:col-span-3 lg:col-start-10 lg:mt-0">Kepercayaan tumbuh dari satu potongan ke potongan berikutnya.</p>
          </div>
          <div className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5">
            {stats.map((stat, index) => <Reveal key={stat.label} delay={index * 100}><StatCard stat={stat} index={index} /></Reveal>)}
          </div>
        </div>
      </section>

      <section id="styles" className="scroll-mt-20 section-pad bg-background text-foreground">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="page-grid items-end">
            <div className="col-span-12 lg:col-span-7"><p className="mono-label mb-5">03 / DISCOVER</p><h2 className="section-title">TEMUKAN<br />GAYAMU.</h2></div>
            <p className="col-span-12 mt-4 text-lg text-muted-foreground lg:col-span-3 lg:col-start-10 lg:mt-0">Belum tahu mau potong seperti apa? Mulai dari gaya yang kamu suka.</p>
          </div>
          <div className="mt-12 flex gap-7 overflow-x-auto border-b border-foreground/30 pb-4" role="tablist" aria-label="Kategori gaya rambut">
            {styles.map((item, index) => <button key={item.category} role="tab" aria-selected={styleIndex === index} onClick={() => setStyleIndex(index)} className={cn("min-h-11 shrink-0 text-lg font-medium transition-colors", styleIndex === index ? "border-b-2 border-foreground text-foreground" : "border-b-2 border-transparent text-muted-foreground hover:text-foreground")}>{item.category}</button>)}
          </div>
          <div className="page-grid mt-8 items-end">
            <img src={activeStyle.image} alt={`Potongan rambut ${activeStyle.name}`} className="col-span-12 min-h-[460px] w-full object-cover sm:min-h-[600px] lg:col-span-8" />
            <div className="col-span-12 border-t border-foreground/35 pt-6 lg:col-span-3 lg:col-start-10">
              <p className="mono-label text-muted-foreground">{activeStyle.duration}</p>
              <h3 className="mt-5 text-3xl font-extrabold">{activeStyle.name}</h3>
              <p className="mt-4 text-muted-foreground">{activeStyle.copy}</p>
              <Button variant="default" className="mt-8 w-full" onClick={() => goBook("Signature Cut")}>Pilih gaya ini <ArrowRight /></Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 section-pad mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
         <div className="page-grid items-end"><div className="col-span-12 lg:col-span-8"><p className="mono-label mb-5">04 / SERVICES</p><h2 className="section-title">POTONGAN PAS.<br />HASIL BERKELAS.</h2></div><p className="col-span-12 mt-4 text-lg text-muted-foreground lg:col-span-3 lg:col-start-10 lg:mt-0">Pilihan perawatan yang sesuai dengan gaya keseharianmu.</p></div>
        <div className="mt-10 sm:mt-16 sm:border-t sm:border-foreground/50">
          {services.map((item, index) => <Reveal key={item.name} delay={index * 90}><article className="sm:grid sm:grid-cols-12 sm:items-center sm:gap-6 sm:border-b sm:border-foreground/40 sm:py-9">
            <button type="button" onClick={() => goBook(item.name)} className={cn("group mb-4 block w-full border border-foreground/20 px-6 py-7 text-left transition-transform active:scale-[0.99] sm:hidden", index === 3 ? "bg-dark text-dark-foreground" : "bg-background")}>
               <span className={cn("mono-label flex items-center justify-between", index === 3 ? "text-dark-foreground/60" : "text-muted-foreground")}><span>0{index + 1} / {item.duration}</span>{index === 3 && <span className="bg-highlight px-2 py-0.5 text-highlight-foreground">FAVORITE</span>}</span>
              <span className="mt-6 block text-2xl font-extrabold leading-tight">{item.name.toUpperCase()}</span>
              <span className={cn("mt-3 block leading-relaxed", index === 3 ? "text-dark-foreground/65" : "text-muted-foreground")}>{item.description}</span>
              <span className={cn("mt-8 flex items-center justify-between border-t pt-5", index === 3 ? "border-dark-foreground/20" : "border-foreground/15")}><span className="text-3xl font-extrabold leading-none">{item.price}</span><span className="flex items-center gap-3 text-sm font-semibold uppercase">Pesan<span className="grid size-11 place-items-center bg-highlight text-highlight-foreground transition-transform group-active:translate-x-1"><ArrowRight className="size-4" /></span></span></span>
            </button>
            <p className="mono-label hidden text-muted-foreground sm:col-span-1 sm:block">0{index + 1}</p><div className="hidden min-w-0 sm:col-span-5 sm:block"><h3 className="text-2xl font-extrabold leading-tight">{item.name.toUpperCase()}</h3><p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">{item.description}</p></div><div className="hidden shrink-0 sm:col-span-2 sm:block sm:text-left"><p className="mono-label">{item.duration}</p><p className="mt-1 text-lg font-bold">{item.price}</p></div><div className="hidden sm:col-span-4 sm:block sm:justify-self-end"><Button variant="outline" onClick={() => goBook(item.name)}>Pesan layanan <ArrowRight /></Button></div>
          </article></Reveal>)}
        </div>
      </section>

      <section className="section-pad bg-taupe">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
           <div className="page-grid items-end"><div className="col-span-12 lg:col-span-8"><p className="mono-label mb-5">05 / OUR WAY</p><h2 className="section-title">BUKAN ASAL<br />POTONG.</h2></div><p className="col-span-12 mt-4 text-lg lg:col-span-3 lg:col-start-10 lg:mt-0">Tiga hal yang selalu ada di setiap potongan.</p></div>
          <article className="mt-12">
             <div className="mb-7 grid gap-4 border-t border-foreground/50 pt-6 sm:grid-cols-12 sm:items-end sm:gap-6"><div className="sm:col-span-7"><p className="mono-label text-muted-foreground">01 / REAL RESULTS</p><h3 className="mt-3 text-3xl font-extrabold sm:text-4xl">LIHAT HASILNYA.<br />LIHAT BEDANYA.</h3></div><p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:col-span-4 sm:col-start-9">Geser untuk bandingkan sebelum dan sesudah. Detail rapi, hasilnya nyata.</p></div>
            <div className="relative aspect-square max-h-[820px] w-full overflow-hidden bg-dark sm:aspect-[2/1]">
              <div className="absolute inset-0 bg-no-repeat" style={{ backgroundImage: `url(${beforeAfterImage})`, backgroundSize: "200% auto", backgroundPosition: "left center" }} />
              <div className="absolute inset-0 bg-no-repeat" style={{ backgroundImage: `url(${beforeAfterImage})`, backgroundSize: "200% auto", backgroundPosition: "right center", clipPath: `inset(0 0 0 ${slider}%)` }} />
              <div className="pointer-events-none absolute inset-y-0 w-px bg-dark-foreground" style={{ left: `${slider}%` }}><span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center bg-highlight text-highlight-foreground">↔</span></div>
              <span className="mono-label absolute left-4 top-4 bg-dark px-3 py-2 text-dark-foreground">Sebelum</span><span className="mono-label absolute right-4 top-4 bg-dark px-3 py-2 text-dark-foreground">Sesudah</span>
              <input aria-label="Geser untuk membandingkan sebelum dan sesudah" type="range" min="10" max="90" value={slider} onChange={(event) => setSlider(Number(event.target.value))} className="absolute inset-0 size-full cursor-ew-resize opacity-0" />
            </div>
          </article>
          <div className="mt-16 grid gap-x-5 gap-y-12 sm:grid-cols-2">
             <article className="group"><div className="border-t border-foreground/50 pt-5"><p className="mono-label text-muted-foreground">02 / PERSONAL TOUCH</p><h3 className="mt-3 text-3xl font-extrabold sm:text-4xl">DENGAR DULU.<br />BARU POTONG.</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Kami dengarkan maumu, lalu sesuaikan potongan dengan wajah, rambut, dan keseharianmu.</p></div><div className="mt-6 aspect-[5/4] overflow-hidden bg-dark sm:aspect-[16/11]"><img src={style5} alt="Barber berkonsultasi dengan pelanggan sebelum potong rambut" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" /></div></article>
             <article className="group"><div className="border-t border-foreground/50 pt-5"><p className="mono-label text-muted-foreground">03 / MADE TO LAST</p><h3 className="mt-3 text-3xl font-extrabold sm:text-4xl">RAPI HARI INI.<br />TETAP PAS NANTI.</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Potongan yang mudah ditata dan tetap enak dilihat saat rambut tumbuh.</p></div><div className="mt-6 aspect-[5/4] overflow-hidden bg-dark sm:aspect-[16/11]"><img src={style6} alt="Detail hasil potongan rambut yang rapi" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" /></div></article>
          </div>
        </div>
      </section>

      <section id="barbers" className="scroll-mt-20 section-pad mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
         <div className="page-grid items-end"><div className="col-span-12 lg:col-span-8"><p className="mono-label mb-5">06 / OUR BARBERS</p><h2 className="section-title">KENALI PARA<br />BARBER KAMI.</h2></div><p className="col-span-12 mt-4 text-lg text-muted-foreground lg:col-span-3 lg:col-start-10 lg:mt-0">Empat barber, satu standar kerja yang sama.</p></div>
        <div className="mt-14 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((person, index) => <Reveal key={person.name} delay={index * 120}><article><div className="aspect-[3/4] bg-no-repeat" style={{ backgroundImage: `url(${barbersSheet})`, backgroundSize: "400% auto", backgroundPosition: `${person.position} center` }} role="img" aria-label={`Potret ${person.name}, ${person.role}`} /><div className="mt-5 border-t border-foreground/45 pt-4"><div className="flex justify-between gap-3"><h3 className="text-2xl font-extrabold">{person.name}</h3><p className="mono-label text-right">{person.meta}</p></div><p className="mt-1 text-sm text-muted-foreground">{person.role}</p><p className="mt-5 text-sm">{person.specialties}</p><Button variant="outline" className="mt-6 w-full" onClick={() => goBook(undefined, person.name[0] + person.name.slice(1).toLowerCase())}>Pilih {person.name[0] + person.name.slice(1).toLowerCase()}</Button></div></article></Reveal>)}
        </div>
      </section>

      <section className="section-pad border-y border-foreground/30 bg-muted">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="page-grid">
            <div className="col-span-12 flex flex-col justify-between lg:col-span-5">
              <div>
                <p className="mono-label mb-5">07 / BARBER MATCH</p>
                <h2 className="text-3xl font-extrabold leading-[0.95] sm:text-5xl lg:text-[2.6rem] xl:text-5xl">BINGUNG PILIH<br />BARBER?</h2>
                <p className="mt-6 max-w-sm text-lg">Jawab lima pertanyaan singkat. Kami bantu pilih barber dan potongan yang cocok.</p>
               </div>
            </div>
            <div className="col-span-12 mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0">
              <BarberMatch goBook={goBook} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
         <div className="page-grid"><p className="mono-label col-span-12 lg:col-span-2">08 / TESTIMONIALS</p><div className="col-span-12 lg:col-span-8 lg:col-start-4"><blockquote key={testimonialIndex} className="rise-in"><p className="min-h-[7.8em] text-4xl font-bold leading-tight sm:min-h-[4.8em] sm:text-6xl">“{activeTestimonial?.quote}”</p><footer className="mt-8 flex items-end justify-between border-t border-foreground/40 pt-5"><p className="mono-label">{activeTestimonial?.name}<br />{activeTestimonial?.service}</p><p className="text-3xl font-bold">{activeTestimonial?.rating} <span className="text-base font-normal">/ 5</span></p></footer></blockquote><div className="mt-7 flex items-center justify-between"><p className="mono-label text-muted-foreground">0{testimonialIndex + 1} / 0{testimonials.length}</p><div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Ulasan sebelumnya" onClick={() => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length)}><ArrowLeft /></Button><Button variant="outline" size="icon" aria-label="Ulasan berikutnya" onClick={() => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)}><ArrowRight /></Button></div></div></div></div>
      </section>

      <GalleryAndJournal />

      

      <BookingFlow open={bookingOpen} onOpen={() => goBook()} onClose={() => setBookingOpen(false)} step={bookingStep} setStep={setBookingStep} service={service} setService={setService} barber={barber} setBarber={setBarber} date={date} setDate={setDate} time={time} setTime={setTime} details={details} setDetails={setDetails} errors={errors} setErrors={setErrors} selectedService={selectedService} />

      <footer className="bg-dark px-5 pb-10 pt-16 text-dark-foreground sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1600px]">

          {/* Main footer grid */}
          <div className="grid gap-12 border-t border-dark-foreground/30 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:pt-16">
            <div>
              <p className="text-3xl font-extrabold">CUT & CO.</p>
              <p className="mt-4 text-sm text-dark-foreground/60">Gaya yang pas.<br />Potongan yang tepat.</p>
            </div>
            <div>
               <p className="mono-label mb-4">VISIT</p>
              <p className="text-sm leading-7">Jl. Senopati No. 12<br />Jakarta Selatan<br />Buka setiap hari · 10:00—21:00</p>
              <p className="mono-label mt-5 text-highlight">SEGERA HADIR</p>
              <p className="mt-2 text-sm leading-7 text-dark-foreground/60">Kemangan — segera dibuka</p>
            </div>
            <div>
               <p className="mono-label mb-4">EXPLORE</p>
              <div className="flex flex-col items-start gap-3 text-sm">
                <a href="#styles">Gaya</a>
                <a href="#services">Layanan</a>
                <a href="#barbers">Barber</a>
                <a href="#journal">Journal</a>
              </div>
            </div>
            <div>
               <p className="mono-label mb-4">FOLLOW</p>
              <div className="flex gap-3">
                <a href="https://instagram.com/cutandco" target="_blank" rel="noreferrer" aria-label="Instagram @cutandco" className="grid size-11 place-items-center border border-current/30 transition-colors hover:bg-highlight hover:text-highlight-foreground"><Instagram className="size-5" /></a>
                <a href="https://tiktok.com/@cutandco" target="_blank" rel="noreferrer" aria-label="TikTok @cutandco" className="grid size-11 place-items-center border border-current/30 transition-colors hover:bg-highlight hover:text-highlight-foreground"><svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.77.12V9.77a5.7 5.7 0 0 0-.77-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.25-1.48Z" /></svg></a>
              </div>
            </div>
          </div>

          {/* Giant editorial wordmark */}
          <div className="mt-14 overflow-hidden border-t border-dark-foreground/30 pt-8 lg:mt-20">
            <p className="whitespace-nowrap text-[13.5vw] font-extrabold leading-none sm:text-[15vw] lg:text-[13vw]">CUT & CO.</p>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col gap-3 border-t border-dark-foreground/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="mono-label text-dark-foreground/50">© 2026 CUT & CO. — Potongan penuh perhatian.</p>
            <div className="mono-label flex flex-wrap gap-x-6 gap-y-2 text-dark-foreground/50">
              <a href="#" className="hover:text-dark-foreground">Instagram</a>
              <a href="#" className="hover:text-dark-foreground">Ketentuan</a>
              <a href="#" className="hover:text-dark-foreground">Privasi</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

function StatCard({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(stat.value * eased);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [stat.value]);

  const formatted = stat.decimals ? display.toFixed(stat.decimals) : Math.round(display).toLocaleString("en-US");

  return (
    <div ref={ref} className="border-t border-dark-foreground/40 pt-5">
      <p className="mono-label text-dark-foreground/65">0{index + 1} / {stat.label}</p>
      <p className="mt-6 text-6xl font-extrabold leading-none tracking-tight sm:text-7xl">
        {formatted}
        <span className="text-highlight">{stat.suffix}</span>
      </p>
      <p className="mt-4 text-sm text-dark-foreground/65">{stat.note}</p>
    </div>
  );
}

function Header({ compact, menuOpen, setMenuOpen, goBook }: { compact: boolean; menuOpen: boolean; setMenuOpen: (value: boolean) => void; goBook: () => void }) {
   return <header className={cn("fixed inset-x-0 top-0 z-50 border-b transition-all", compact || menuOpen ? "border-foreground/15 bg-background/95 py-3 text-foreground backdrop-blur-md" : "border-dark-foreground/20 bg-dark/20 py-5 text-dark-foreground")}><nav aria-label="Navigasi utama" className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-12"><a href="#top" className="truncate text-xl font-extrabold">CUT & CO.</a><div className="hidden gap-8 text-sm font-medium lg:flex"><a href="#styles">Gaya</a><a href="#services">Layanan</a><a href="#barbers">Barber</a><a href="#journal">Journal</a></div><div className="flex shrink-0 items-center justify-end gap-2"><Button variant={compact || menuOpen ? "default" : "inverse"} className="hidden sm:inline-flex" onClick={() => goBook()}>Booking sekarang</Button><Button variant="ghost" size="icon" className="lg:hidden" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div></nav>{menuOpen && <div className="border-t border-foreground/20 bg-background px-5 pb-6 pt-4 text-foreground lg:hidden"><div className="flex flex-col text-2xl font-bold"><a className="border-b border-foreground/25 py-4" href="#styles" onClick={() => setMenuOpen(false)}>Gaya</a><a className="border-b border-foreground/25 py-4" href="#services" onClick={() => setMenuOpen(false)}>Layanan</a><a className="border-b border-foreground/25 py-4" href="#barbers" onClick={() => setMenuOpen(false)}>Barber</a><a className="border-b border-foreground/25 py-4" href="#journal" onClick={() => setMenuOpen(false)}>Journal</a><Button className="mt-5 w-full" size="lg" onClick={() => { setMenuOpen(false); goBook(); }}>Booking sekarang <ArrowRight /></Button></div></div>}</header>;
}

type MatchOption = { label: string; weights: Record<string, number>; style?: string; service?: string };
type MatchQuiz = { id: string; label: string; options: MatchOption[] };

const matchQuiz: MatchQuiz[] = [
  {
    id: "style",
    label: "Gaya seperti apa yang kamu mau?",
    options: [
      { label: "Classic", weights: { DIMAS: 3, NIKO: 1 }, style: "SIDE PART" },
      { label: "Fade", weights: { ARDI: 3, RAKA: 2 }, style: "CLEAN FADE" },
      { label: "Textured", weights: { RAKA: 3, DIMAS: 1 }, style: "TEXTURED CROP" },
      { label: "Panjangkan rambut", weights: { NIKO: 3 }, style: "LONG LAYERS" },
    ],
  },
  {
    id: "hair",
    label: "Seperti apa rambutmu?",
    options: [
      { label: "Lurus", weights: { DIMAS: 2, ARDI: 1 } },
      { label: "Bergelombang", weights: { RAKA: 2, NIKO: 1 } },
      { label: "Keriting", weights: { RAKA: 2, ARDI: 1 } },
      { label: "Mulai menipis", weights: { DIMAS: 2, ARDI: 2 } },
    ],
  },
  {
    id: "maintenance",
    label: "Seberapa sering kamu menata rambut?",
    options: [
      { label: "Sesimpel mungkin", weights: { ARDI: 2, DIMAS: 1 }, style: "LOW TAPER" },
      { label: "Beberapa menit tiap hari", weights: { RAKA: 2, NIKO: 1 } },
      { label: "Suka menata rambut", weights: { NIKO: 2, RAKA: 1 } },
    ],
  },
  {
    id: "beard",
    label: "Ingin rapikan janggut juga?",
    options: [
      { label: "Ya, rapikan", weights: { ARDI: 3 }, service: "Beard Trim" },
      { label: "Rambut saja", weights: { RAKA: 1, DIMAS: 1, NIKO: 1 } },
    ],
  },
  {
    id: "time",
    label: "Berapa waktu yang kamu punya?",
    options: [
      { label: "30–45 menit", weights: { ARDI: 1 }, service: "Signature Cut" },
      { label: "Sekitar satu jam", weights: { DIMAS: 1, RAKA: 1 }, service: "Cut & Wash" },
      { label: "Sekalian lengkap", weights: { NIKO: 2, RAKA: 1 }, service: "Full Grooming" },
    ],
  },
];

const titleCase = (value: string) => value[0] + value.slice(1).toLowerCase();

function BarberMatch({ goBook }: { goBook: (service?: string, barber?: string) => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);

  const terjawab = matchQuiz.filter((question) => answers[question.id] !== undefined).length;
  const complete = terjawab === matchQuiz.length;

  const result = useMemo(() => {
    if (!complete) return null;
    const scores: Record<string, number> = { RAKA: 0, DIMAS: 0, ARDI: 0, NIKO: 0 };
    let style = "SIGNATURE CUT";
    let service = "Signature Cut";
    let total = 0;
    for (const question of matchQuiz) {
      const answer = answers[question.id];
      if (answer === undefined) continue;
      const option = question.options[answer];
      if (!option) continue;
      for (const [name, points] of Object.entries(option.weights)) scores[name] = (scores[name] ?? 0) + points;
      total += Math.max(...Object.values(option.weights));
      if (option.style) style = option.style;
      if (option.service) service = option.service;
    }
    const topMatch = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (!topMatch) return null;
    const [name, score] = topMatch;
    const barber = barbers.find((person) => person.name === name);
    if (!barber) return null;
    const percent = Math.min(98, Math.round(70 + 28 * (score / Math.max(total, 1))));
    return { barber, percent, style, service };
  }, [answers, complete]);

  const reset = () => {
    setAnswers({});
    setCurrent(0);
  };

  const question = matchQuiz[current] ?? matchQuiz[0];
  if (!question) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="mono-label text-muted-foreground">{complete ? "HASIL" : `PERTANYAAN 0${current + 1} / 0${matchQuiz.length}`}</p>
        <div className="flex gap-1.5">
          {matchQuiz.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ke pertanyaan ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={cn("h-1.5 w-8 transition-colors", answers[item.id] !== undefined ? "bg-foreground" : index === current && !complete ? "bg-foreground/55" : "bg-foreground/20")}
            />
          ))}
        </div>
      </div>

      {complete && result ? (
        <div className="rise-in mt-8 border-t border-foreground/50 pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div
              className="aspect-[3/4] w-36 shrink-0 bg-no-repeat"
              style={{ backgroundImage: `url(${barbersSheet})`, backgroundSize: "400% auto", backgroundPosition: `${result.barber.position} center` }}
              role="img"
              aria-label={`Portrait of ${result.barber.name}`}
            />
            <div className="min-w-0">
              <p className="mono-label text-muted-foreground">{result.percent}% COCOK</p>
              <h3 className="mt-2 text-4xl font-extrabold">{result.barber.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{result.barber.role} · {result.barber.meta}</p>
              <p className="mt-4 text-sm">Ahli dalam: {result.barber.specialties}</p>
              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-foreground/30 pt-5">
                <div><dt className="mono-label text-muted-foreground">Saran gaya</dt><dd className="mt-1 font-bold">{result.style}</dd></div>
                <div><dt className="mono-label text-muted-foreground">Saran layanan</dt><dd className="mt-1 font-bold">{result.service}</dd></div>
              </dl>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="lime" onClick={() => goBook(result.service, titleCase(result.barber.name))}>Pesan {result.service} bersama {titleCase(result.barber.name)}</Button>
            <Button variant="outline" onClick={reset}>Ulangi</Button>
          </div>
        </div>
      ) : (
        <fieldset className="mt-8 border-t border-foreground/50 pt-8">
          <legend className="sr-only">{question.label}</legend>
          <p className="text-2xl font-bold sm:text-3xl">{question.label}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {question.options.map((option, index) => {
              const selected = answers[question.id] === index;
              return (
                <Button
                  key={option.label}
                  type="button"
                  variant={selected ? "lime" : "outline"}
                  aria-pressed={selected}
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, [question.id]: index }));
                    const next = matchQuiz.findIndex((item, i) => i !== current && answers[item.id] === undefined && item.id !== question.id);
                    setCurrent(next === -1 ? current : next);
                  }}
                >
                  {selected && <Check />}
                  {option.label}
                </Button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Pertanyaan sebelumnya" disabled={current === 0} onClick={() => setCurrent(current - 1)}><ArrowLeft /></Button>
            <Button variant="ghost" size="icon" aria-label="Pertanyaan berikutnya" disabled={current === matchQuiz.length - 1} onClick={() => setCurrent(current + 1)}><ArrowRight /></Button>
            <p className="mono-label text-muted-foreground">{terjawab} / {matchQuiz.length} terjawab</p>
          </div>
        </fieldset>
      )}
    </div>
  );
}


const journal = [
  { title: "Cara Memilih Potongan Sesuai Bentuk Wajah", excerpt: "Kami mulai dari bentuk wajah, garis rambut, dan arah tumbuhnya. Dari situ, kami pilih panjang dan bentuk potongan yang terasa paling pas." },
  { title: "Low Taper atau Mid Fade, Apa Bedanya?", excerpt: "Keduanya merapikan sisi rambut. Low taper memberi gradasi halus dekat garis rambut, sedangkan mid fade dimulai lebih tinggi untuk kesan lebih tegas." },
  { title: "Biar Potongan Rambut Tetap Rapi Lebih Lama", excerpt: "Jangan terlalu sering keramas. Pakai kondisioner dan produk ringan yang mudah ditata ulang. Rapikan tiap empat minggu agar bentuknya tetap terjaga." },
  { title: "Seberapa Sering Sebaiknya Keramas?", excerpt: "Untuk kebanyakan rambut, dua hingga tiga kali seminggu sudah cukup. Terlalu sering keramas bisa mengurangi minyak alami; gunakan kondisioner ringan di sela-selanya." },
];

function GalleryAndJournal() {
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  return <section id="journal" className="scroll-mt-20 section-pad bg-muted"><div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12"><div className="page-grid items-end"><div className="col-span-12 lg:col-span-8"><p className="mono-label mb-5">08 / JOURNAL</p><h2 className="section-title">DARI KURSI<br />BARBER</h2></div><p className="col-span-12 mt-4 text-lg text-muted-foreground lg:col-span-3 lg:col-start-10 lg:mt-0">Catatan singkat soal potongan, perawatan, dan styling.</p></div><div className="mt-14 border-t border-foreground/40">{journal.map((item, index) => { const open = openArticle === item.title; return <article key={item.title} className="border-b border-foreground/40 py-7"><div className="grid grid-cols-12 items-start gap-x-3 sm:gap-x-6"><p className="mono-label col-span-2 sm:col-span-1">0{index + 1}</p><h3 className="col-span-8 min-w-0 text-xl font-bold sm:col-span-8 sm:text-3xl">{item.title}</h3><Button variant="ghost" size="icon" aria-label={open ? `Tutup ${item.title}` : `Baca ${item.title}`} aria-expanded={open} aria-controls={`journal-${index}`} onClick={() => setOpenArticle(open ? null : item.title)} className="col-span-2 justify-self-end sm:col-span-3"><ArrowRight className={cn("transition-transform", open && "rotate-90")} /></Button>{open && <p id={`journal-${index}`} className="rise-in col-span-10 col-start-3 mt-5 text-base leading-relaxed text-muted-foreground sm:col-span-11 sm:col-start-2">{item.excerpt}</p>}</div></article>; })}</div></div></section>;
}


const detailsSchema = z.object({ name: z.string().trim().min(2, "Isi nama lengkap").max(100), phone: z.string().trim().min(8, "Isi nomor telepon yang valid").max(20), email: z.string().trim().email("Isi email yang valid").max(255), note: z.string().trim().max(500, "Catatan maksimal 500 karakter") });

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "note", string>>;

type BookingProps = { open: boolean; onOpen: () => void; onClose: () => void; step: number; setStep: (step: number) => void; service: string; setService: (v: string) => void; barber: string; setBarber: (v: string) => void; date: Date | undefined; setDate: (v?: Date) => void; time: string; setTime: (v: string) => void; details: { name: string; phone: string; email: string; note: string }; setDetails: (v: { name: string; phone: string; email: string; note: string }) => void; errors: FieldErrors; setErrors: (v: FieldErrors) => void; selectedService: (typeof services)[number] | undefined };

function BookingFlow(props: BookingProps) {
  const { open, onOpen, onClose, step, setStep, service, setService, barber, setBarber, date, setDate, time, setTime, details, setDetails, errors, setErrors, selectedService } = props;
  const canContinue = [Boolean(service), Boolean(barber), Boolean(date), Boolean(time), true, true, true, true][step];
  const continueFlow = (event?: FormEvent) => {
    event?.preventDefault();
    if (step === 4) {
      const result = detailsSchema.safeParse(details);
      if (!result.success) { setErrors(Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message])) as FieldErrors); return; }
      setErrors({});
    }
    setStep(Math.min(step + 1, 7));
  };
  const [paying, setPaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [method, setMethod] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const createPaymentCode = () => {
    const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return `CUT-${part()}-${part()}`;
  };
  const selectPaymentMethod = (id: string) => {
    setMethod(id);
    if (!paymentCode) setPaymentCode(createPaymentCode());
  };
  const copyCode = async () => {
    try { await navigator.clipboard.writeText(paymentCode); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const simulatePayment = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setStep(7); }, 1600);
  };
  const field = (key: keyof typeof details, value: string) => { setDetails({ ...details, [key]: value }); if (errors[key]) setErrors({ ...errors, [key]: "" }); };
  const calendarTime = /^\d{2}:\d{2}$/.test(time) ? time.replace(":", "") : "1000";
  const calendarUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${service || "Janji temu"} di CUT & CO.\nDTSTART:${date ? format(date, "yyyyMMdd") : format(new Date(), "yyyyMMdd")}T${calendarTime}00\nDURATION:PT${selectedService?.duration.split(" ")[0] ?? "45"}M\nEND:VEVENT\nEND:VCALENDAR`)}`;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape" && !paying) onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose, paying]);

  useEffect(() => {
    if (!open) return;
    setMethod("");
    setPaymentCode("");
    setCopied(false);
  }, [open]);

   return <><section id="booking" className="scroll-mt-20 bg-background px-5 py-16 sm:px-8 sm:py-24 lg:px-12"><div className="mx-auto max-w-[1600px] overflow-hidden border border-foreground bg-dark text-dark-foreground"><div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)]"><div className="flex flex-col justify-between p-7 sm:p-12 lg:p-16"><div><p className="mono-label text-highlight">09 / YOUR TURN</p><h2 className="mt-8 text-4xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">WAKTUMU.<br />GAYAMU.</h2><p className="mt-8 max-w-xl text-base leading-relaxed text-dark-foreground/70 sm:text-lg">Pilih layanan, barber, dan jam yang pas. Konfirmasi janji dalam beberapa langkah.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button variant="lime" size="lg" className="w-full sm:w-auto" onClick={onOpen}>Booking sekarang <ArrowRight /></Button><Button asChild variant="inverse" size="lg" className="w-full sm:w-auto"><a href="https://wa.me/?text=Halo%20CUT%20%26%20CO.%2C%20saya%20ingin%20konsultasi%20sebelum%20booking." target="_blank" rel="noreferrer">Konsultasi via WhatsApp <MessageCircle /></a></Button></div></div><div className="mt-14 grid gap-5 border-t border-dark-foreground/30 pt-5 text-dark-foreground/65 sm:grid-cols-3"><p className="mono-label">Pilih barber sendiri</p><p className="mono-label">Pilih jam tersedia</p><p className="mono-label">Konfirmasi langsung</p></div></div><div className="relative min-h-[360px] border-t border-dark-foreground/25 lg:border-l lg:border-t-0"><img src={style5} alt="Barber CUT & CO. berkonsultasi sebelum memotong rambut" className="absolute inset-0 size-full object-cover grayscale" /><div className="absolute inset-0 bg-dark/20" /><p className="mono-label absolute bottom-6 right-6 border border-dark-foreground/50 bg-dark/70 px-3 py-2">POTONG DENGAN NIAT</p></div></div></div></section>
   {open && <div className="fixed inset-0 z-[80] bg-dark/85 p-0 backdrop-blur-sm sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !paying) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" className="mx-auto flex h-full max-w-[1400px] flex-col overflow-hidden border-foreground bg-highlight text-highlight-foreground sm:max-h-[calc(100svh-2.5rem)] sm:border-2"><div className="flex items-center justify-between border-b border-foreground/30 px-5 py-4 sm:px-8"><div><p id="booking-dialog-title" className="text-lg font-extrabold">CUT & CO.</p><p className="mono-label text-muted-foreground">BOOKING</p></div><Button type="button" variant="ghost" size="icon" aria-label="Tutup pemesanan" disabled={paying} onClick={onClose}><X /></Button></div><div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8 lg:p-12"><div className="grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-16"><aside aria-label="Progres pemesanan"><div className="grid grid-cols-8 gap-1.5" aria-hidden="true">{bookingSteps.map((label, index) => <span key={label} className={cn("h-1.5 transition-colors", index <= step ? "bg-foreground" : "bg-foreground/20")} />)}</div><p className="mono-label mt-3 flex items-center justify-between"><span>{bookingSteps[step]}</span><span className="text-muted-foreground">Progres pemesanan</span></p></aside>
       <div className="min-w-0"><div className="mb-8 hidden items-end justify-between border-b border-foreground/30 pb-4 lg:flex"><p className="mono-label">TAHAP INI</p><p className="mono-label text-muted-foreground">{bookingSteps[step]}</p></div>
        {step === 0 && <BookingChoice title="PILIH LAYANAN" options={services.map((item) => ({ value: item.name, title: item.name, meta: `${item.duration} · ${item.price}`, detail: item.description }))} value={service} onChange={setService} />}
        {step === 1 && <BookingChoice title="PILIH BARBER" options={[...barbers.map((item) => ({ value: item.name[0] + item.name.slice(1).toLowerCase(), title: item.name, meta: item.role, detail: item.specialties })), { value: "Any Available Barber", title: "BARBER YANG TERSEDIA", meta: "Jadwal terdekat", detail: "Kami pilihkan barber yang tersedia." }]} value={barber} onChange={setBarber} />}
        {step === 2 && <div><h2 className="text-4xl font-extrabold sm:text-6xl">PILIH TANGGAL</h2><div className="mt-9 max-w-xl border border-foreground/30 bg-background p-2 sm:p-6"><Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} className="pointer-events-auto w-full [--cell-size:clamp(2.5rem,8vw,3.5rem)]" /></div></div>}
        {step === 3 && <div><h2 className="text-4xl font-extrabold sm:text-6xl">PILIH JAM</h2><p className="mt-4 text-muted-foreground">Jam yang tidak tersedia tidak bisa dipilih.</p><div className="mt-9 grid grid-cols-3 gap-2 sm:grid-cols-5">{slots.map((slot) => { const off = unavailable.has(slot); return <Button key={slot} type="button" variant={time === slot ? "lime" : "outline"} disabled={off} aria-label={`${slot}${off ? ", tidak tersedia" : ", tersedia"}`} aria-pressed={time === slot} onClick={() => setTime(slot)} className="h-14">{slot}{off && <span className="sr-only">Tidak tersedia</span>}</Button>; })}</div></div>}
        {step === 4 && <form id="booking-details" onSubmit={continueFlow} noValidate><h2 className="text-4xl font-extrabold sm:text-6xl">DATA DIRIMU</h2><div className="mt-9 grid gap-6 sm:grid-cols-2"><FormField id="full-name" label="Nama lengkap" error={errors.name}><Input id="full-name" value={details.name} onChange={(e) => field("name", e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "full-name-error" : undefined} maxLength={100} autoComplete="name" /></FormField><FormField id="phone" label="Nomor telepon" error={errors.phone}><Input id="phone" type="tel" value={details.phone} onChange={(e) => field("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} maxLength={20} autoComplete="tel" /></FormField><FormField id="email" label="Email" error={errors.email}><Input id="email" type="email" value={details.email} onChange={(e) => field("email", e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} maxLength={255} autoComplete="email" /></FormField><FormField id="note" label="Catatan (opsional)" error={errors.note}><Textarea id="note" value={details.note} onChange={(e) => field("note", e.target.value)} aria-invalid={Boolean(errors.note)} aria-describedby={errors.note ? "note-error" : undefined} maxLength={500} /></FormField></div></form>}
        {step === 5 && <div><h2 className="text-4xl font-extrabold sm:text-6xl">CEK SEKALI LAGI.</h2><dl className="mt-10 border-t border-foreground/40">{[["Layanan", service], ["Barber", barber], ["Tanggal", date ? format(date, "EEEE, d MMMM yyyy", { locale: id }) : "—"], ["Jam", time], ["Durasi", selectedService?.duration ?? "—"], ["Harga", selectedService?.price ?? "—"]].map(([term, value]) => <div key={term} className="grid grid-cols-2 border-b border-foreground/30 py-5"><dt className="mono-label text-muted-foreground">{term}</dt><dd className="text-right font-bold">{value}</dd></div>)}</dl><p className="mono-label mt-5 text-muted-foreground">Belum ada pembayaran di tahap ini</p></div>}
        {step === 6 && <div><h2 className="text-4xl font-extrabold sm:text-6xl">PEMBAYARAN</h2><p className="mt-4 text-muted-foreground">Mode demo — tidak ada pembayaran sungguhan.</p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">{paymentMethods.map((option) => <Button type="button" variant="outline" key={option.id} aria-pressed={method === option.id} disabled={paying} onClick={() => selectPaymentMethod(option.id)} className={cn("grid h-auto min-h-24 grid-cols-[minmax(0,1fr)_2rem] items-center justify-stretch gap-3 whitespace-normal p-5 text-left", method === option.id && "bg-dark text-dark-foreground hover:bg-dark")}><span className="min-w-0"><span className="block text-lg font-bold">{option.name}</span><span className="mt-1 block text-sm text-muted-foreground">{option.detail}</span></span><span className="grid size-7 place-items-center border border-current">{method === option.id && <Check className="size-4" />}</span></Button>)}</div>
          <dl className="mt-10 border-t border-foreground/40">{method && paymentCode && <div className="rise-in grid gap-3 border-b border-foreground/30 py-5 sm:grid-cols-2 sm:items-center"><dt className="mono-label text-muted-foreground">Kode transaksi</dt><dd className="flex min-w-0 flex-wrap items-center justify-start gap-3 font-bold sm:justify-end"><span className="break-all">{paymentCode}</span><Button type="button" variant="outline" size="sm" onClick={copyCode}><Copy className="size-4" />{copied ? "Tersalin" : "Salin"}</Button></dd></div>}<div className="grid grid-cols-2 border-b border-foreground/30 py-5"><dt className="mono-label text-muted-foreground">Total</dt><dd className="text-right text-xl font-extrabold">{selectedService?.price ?? "-"}</dd></div></dl>
          <div className="mt-12 flex items-center justify-between gap-4 border-t border-foreground/30 py-4"><Button variant="ghost" disabled={paying} onClick={() => setStep(5)}>Kembali</Button><Button size="lg" disabled={!method || paying} onClick={simulatePayment}>{paying ? <>Memproses <Loader2 className="animate-spin" /></> : <>Bayar {selectedService?.price ?? ""} <ArrowRight /></>}</Button></div>
        </div>}
        {step === 7 && <div aria-live="polite" className="py-8"><span className="grid size-14 place-items-center bg-highlight"><Check className="size-7" /></span><p className="mono-label mt-10 text-muted-foreground">PEMBAYARAN DITERIMA · {paymentCode} · {paymentMethods.find((item) => item.id === method)?.name ?? "DEMO"}</p><h2 className="mt-3 text-5xl font-extrabold sm:text-7xl">JANJIMU SIAP.</h2><p className="mt-5 text-xl">{service}<br />bersama {barber}</p><p className="mt-8 text-2xl font-bold">{date ? format(date, "EEEE, d MMMM", { locale: id }) : ""}<br />{time}</p><p className="mt-2 text-muted-foreground">{selectedService?.duration}</p><div className="mt-10 flex flex-wrap gap-3"><Button asChild variant="outline"><a href={calendarUrl} download="cut-and-co-appointment.ics">Simpan ke kalender</a></Button><Button variant="outline" onClick={() => setStep(5)}>Lihat janji</Button><Button onClick={onClose}>Kembali ke beranda</Button></div></div>}
        {step < 6 && <div className="sticky bottom-0 mt-12 flex items-center justify-between gap-4 border-t border-foreground/30 bg-highlight py-4"><Button variant="ghost" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>Kembali</Button><Button type={step === 4 ? "submit" : "button"} form={step === 4 ? "booking-details" : undefined} size="lg" disabled={!canContinue} onClick={step === 4 ? undefined : () => continueFlow()}>{step === 5 ? "Konfirmasi janji" : "Lanjut"} <ArrowRight /></Button></div>}
      </div>
    </div></div></section></div>}</>;
}

function BookingChoice({ title, options, value, onChange }: { title: string; options: { value: string; title: string; meta: string; detail: string }[]; value: string; onChange: (value: string) => void }) {
  return <div><h2 className="text-4xl font-extrabold sm:text-6xl">{title}</h2><div className="mt-9 border-t border-foreground/40">{options.map((option) => <button type="button" key={option.value} aria-pressed={value === option.value} onClick={() => onChange(option.value)} className={cn("grid min-h-28 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-foreground/30 py-5 text-left transition-colors sm:grid-cols-[minmax(0,1fr)_10rem_3rem]", value === option.value ? "bg-dark px-4 text-dark-foreground" : "hover:bg-foreground/5")}><div className="min-w-0"><span className="text-xl font-bold">{option.title.toUpperCase()}</span><span className="mt-2 block text-sm text-muted-foreground">{option.detail}</span></div><span className="mono-label text-right sm:text-left">{option.meta}</span><span className="hidden size-8 place-items-center border border-foreground sm:grid">{value === option.value && <Check />}</span></button>)}</div></div>;
}

function FormField({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="mono-label mb-2 block">{label}</label>{children}{error && <p id={`${id}-error`} className="mt-2 text-sm text-destructive" role="alert">{error}</p>}</div>;
}
