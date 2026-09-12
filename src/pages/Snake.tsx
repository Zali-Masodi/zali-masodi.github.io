import React, { useEffect, useRef, useState } from "react";
import "./snake.css";

/* -------------------------------------------------------------------- */
/*  DATA                                                                  */
/* -------------------------------------------------------------------- */

type Category = "all" | "python" | "milk" | "corn";

interface SnakeItem {
  id: number;
  category: Exclude<Category, "all">;
  species: string;
  year: string;
  morph: string;
  gradient: string;
  emoji: string;
}

const SNAKES: SnakeItem[] = [
  { id: 1, category: "python", species: "Python regius", year: "2023", morph: "1,0 Confusion Pastel Vanilla", gradient: "linear-gradient(135deg,#f5d97a,#e0a92b)", emoji: "🐍" },
  { id: 2, category: "python", species: "Python regius", year: "2024", morph: "1,0 Leopard Lesser Pastel Spotnose Clown", gradient: "linear-gradient(135deg,#d8c48a,#8a6a3c)", emoji: "🐍" },
  { id: 3, category: "python", species: "Python regius", year: "2026", morph: "0,1 Pinstripe Orange Dream Piebald · #2", gradient: "linear-gradient(135deg,#ffb27a,#f2f2f2)", emoji: "🐍" },
  { id: 4, category: "python", species: "Python regius", year: "2026", morph: "0,1 Orange Dream Piebald · #1", gradient: "linear-gradient(135deg,#ff9d5c,#ffffff)", emoji: "🐍" },
  { id: 5, category: "python", species: "Python regius", year: "2026", morph: "0,1 Orange Dream Piebald · #2", gradient: "linear-gradient(135deg,#ff9d5c,#ffffff)", emoji: "🐍" },
  { id: 6, category: "python", species: "Python regius", year: "2026", morph: "0,1 Orange Dream Piebald · #4", gradient: "linear-gradient(135deg,#ff9d5c,#ffffff)", emoji: "🐍" },
  { id: 7, category: "python", species: "Python regius", year: "2026", morph: "0,1 Blue Eyes Leucistic", gradient: "linear-gradient(135deg,#eaf6ff,#9cd3f5)", emoji: "🐍" },
  { id: 8, category: "python", species: "Python molurus bivittatus", year: "2024", morph: "0,1 Albino Hypo Labyrinth het. Caramel", gradient: "linear-gradient(135deg,#ffe08a,#ffb347)", emoji: "🐍" },
  { id: 9, category: "python", species: "Python molurus bivittatus", year: "2024", morph: "1,0 Caramel Hypo het. Albino Labyrinth", gradient: "linear-gradient(135deg,#e8b978,#a9702f)", emoji: "🐍" },
  { id: 10, category: "milk", species: "Lampropeltis triangulum nelsoni", year: "Chovný pár", morph: "Samec albino × samica T+ albino", gradient: "linear-gradient(135deg,#ff6b6b,#2b2b2b)", emoji: "🐍" },
  { id: 11, category: "milk", species: "Lampropeltis t. nelsoni", year: "2023", morph: "1,1 Hypoerytristic Albino pár", gradient: "linear-gradient(135deg,#ff8787,#fff3cd)", emoji: "🐍" },
  { id: 12, category: "milk", species: "Lampropeltis triangulum nelsoni", year: "2025 – 2026", morph: "0,1 T+ Albino (aj samce aj samice)", gradient: "linear-gradient(135deg,#ffcf7a,#ff6b6b)", emoji: "🐍" },
  { id: 13, category: "milk", species: "Lampropeltis mexicana", year: "2025", morph: "1,1 Pastel King Orange", gradient: "linear-gradient(135deg,#ff9f43,#5c3a21)", emoji: "🐍" },
  { id: 14, category: "milk", species: "Lampropeltis t. hondurensis", year: "2025", morph: "0,2 Hypo Tangerine", gradient: "linear-gradient(135deg,#ff7f50,#3a1f10)", emoji: "🐍" },
  { id: 15, category: "milk", species: "Lampropeltis t. campbelli", year: "2026", morph: "Samce aj samice", gradient: "linear-gradient(135deg,#ff5757,#232323)", emoji: "🐍" },
  { id: 16, category: "milk", species: "Lampropeltis ruthveni", year: "2026", morph: "Albino, samice", gradient: "linear-gradient(135deg,#ffb3b3,#fff6e0)", emoji: "🐍" },
  { id: 17, category: "corn", species: "Pantherophis guttatus", year: "2026", morph: "Miami Okeetee, samce", gradient: "linear-gradient(135deg,#ff7b39,#c23616)", emoji: "🐍" },
  { id: 18, category: "corn", species: "Pantherophis guttatus", year: "2026", morph: "Creamsicle Okeetee, samce aj samica", gradient: "linear-gradient(135deg,#ffd59e,#ff8a3d)", emoji: "🐍" },
  { id: 19, category: "corn", species: "Pantherophis obsoletus lindheimeri", year: "2026", morph: "Leucistic, samce aj samice", gradient: "linear-gradient(135deg,#f5f5f5,#c9c9c9)", emoji: "🐍" },
  { id: 20, category: "corn", species: "Euprepiophis mandarinus", year: "2026", morph: "Samce aj samica", gradient: "linear-gradient(135deg,#ffd166,#06923e)", emoji: "🐍" },
  { id: 21, category: "corn", species: "Phylodrias baroni", year: "2026", morph: "Samce aj samice", gradient: "linear-gradient(135deg,#8bc34a,#33691e)", emoji: "🐍" },
];

const EXHIBITIONS = [
  { name: "Faunia Bratislava", date: "2026" },
  { name: "Faunia Nitra", date: "2026" },
  { name: "Akva Tera Trnava", date: "4. 10. 2026" },
  { name: "Svet exotiky Martin", date: "19. 9. 2026" },
  { name: "Akva Tera Trenčín", date: "18. 10. 2026" },
  { name: "Fauna Trhy Ostrava", date: "27. 9. / 25. 10. / 15. 11. 2026" },
  { name: "Živá exotika Praha", date: "17. 10. / 21. 11. 2026" },
];

const RACKS = [
  { title: "Rack systém na 20 IKEA boxov", size: "192 × 118 × 82 cm", note: "8T termostat Danitech + 2 termostaty spodných 8 boxov", price: "1200 €" },
  { title: "Rack systém na 22 boxov", size: "192 × 82 × 61 cm", note: "5× termostat, kompletné vyhrievanie", price: "800 €" },
  { title: "Rack systém na 39 boxov V70", size: "198 × 140 × 88 cm", note: "10T termostat Danitech, boxy Made in USA", price: "2000 €" },
  { title: "Rack systém na 112 boxov V18", size: "187 × 128 × 55 cm", note: "10T termostat Danitech", price: "2000 €" },
  { title: "Rack systém na 224 boxov (2l a 32× 5l)", size: "185 × 300 × 33 cm", note: "kompletné vyhrievanie, len v celku", price: "1000 €" },
  { title: "Tera stena s 10 teráriami", size: "50 × 55 × 58 cm / box", note: "výhrevná fólia + plastová vanička v každom", price: "60 € / ks" },
];

const ACCESSORIES = [
  { name: "Digitálny vlhkomer / teplomer", icon: "🌡️" },
  { name: "Digitálny vlhkomer / teplomer s čidlom", icon: "💧" },
  { name: "Digitálny teplomer s čidlom", icon: "🌡️" },
  { name: "Zámok na terárium", icon: "🔒" },
  { name: "Pinzeta 30 cm rovná", icon: "🥢" },
  { name: "Teleskopický hák (malý / veľký)", icon: "🪝" },
];

const SHIPPING = [
  { title: "Leto", detail: "Krabica bez zateplenia", price: "4 € / CZ 8 €" },
  { title: "Jar / Jeseň", detail: "Krabica + zateplenie polystyrénom", price: "5 € / CZ 9 €" },
  { title: "Zima", detail: "Krabica zateplená + výhrevný sáčok", price: "7 € / CZ neposielam" },
];

const NAV_LINKS = [
  { id: "hero", label: "Domov" },
  { id: "exhibitions", label: "Výstavy" },
  { id: "shipping", label: "Zasielanie" },
  { id: "gallery", label: "Odchovy" },
  { id: "equipment", label: "Vybavenie" },
  { id: "contact", label: "Kontakt" },
];

/* -------------------------------------------------------------------- */
/*  HOOKS                                                                 */
/* -------------------------------------------------------------------- */

/** Adds `.is-visible` to any element with `data-reveal` once it scrolls into view */
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* -------------------------------------------------------------------- */
/*  APP                                                                   */
/* -------------------------------------------------------------------- */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [filter, setFilter] = useState<Category>("all");
  const heroRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowTop(window.scrollY > 600);
      if (heroRef.current) {
        const y = window.scrollY;
        heroRef.current.style.transform = `translateY(${y * 0.25}px) scale(${1 + y * 0.0003})`;
        heroRef.current.style.opacity = String(Math.max(1 - y / 700, 0.15));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredSnakes = filter === "all" ? SNAKES : SNAKES.filter((s) => s.category === filter);

  return (
    <div className="site">
      {/* ---------------- HEADER ---------------- */}
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <div className="header__inner">
          <a className="brand" href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>
            <span className="brand__icon">🐍</span>
            <span className="brand__name">snakes.sk</span>
          </a>

          <nav className={`nav ${menuOpen ? "nav--open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <button key={link.id} className="nav__link" onClick={() => scrollTo(link.id)}>
                {link.label}
              </button>
            ))}
          </nav>

          <button
            className={`hamburger ${menuOpen ? "hamburger--open" : ""}`}
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section id="hero" className="hero">
        <div ref={heroRef} className="hero__bg" />
        <div className="hero__overlay" />
        <div className="hero__floaters" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className={`floater floater--${i}`}>🐍</span>
          ))}
        </div>
        <div className="hero__content">
          <p className="hero__eyebrow" data-reveal>Chov exotických hadov na Slovensku</p>
          <h1 className="hero__title" data-reveal>
            Ponuka vlastných odchovov <span>exotických a farebných mutácii hadov</span>
          </h1>
          <div className="hero__cta" data-reveal>
            <button className="btn btn--primary" onClick={() => scrollTo("gallery")}>
              Pozrieť odchovy
            </button>
            <button className="btn btn--ghost" onClick={() => scrollTo("contact")}>
              Kontaktovať
            </button>
          </div>
        </div>
        <button className="scroll-cue" onClick={() => scrollTo("exhibitions")} aria-label="Scroll down">
          <span />
        </button>
      </section>

      {/* ---------------- EXHIBITIONS (marquee) ---------------- */}
      <section id="exhibitions" className="section section--dark">
        <div className="container">
          <h2 className="section__title" data-reveal>Výstavy 2026, kde nás nájdete</h2>
          <p className="section__subtitle" data-reveal>Príďte sa pozrieť osobne — vždy radi poradíme.</p>
        </div>
        <div className="marquee" data-reveal>
          <div className="marquee__track">
            {[...EXHIBITIONS, ...EXHIBITIONS].map((ex, i) => (
              <div className="marquee__item" key={i}>
                <span className="marquee__dot">📅</span>
                <strong>{ex.name}</strong>
                <span className="marquee__date">{ex.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SHIPPING ---------------- */}
      <section id="shipping" className="section">
        <div className="container">
          <h2 className="section__title" data-reveal>Bezpečné zasielanie SK a CZ</h2>
          <p className="section__text" data-reveal>
            Po dohode vieme mláďatá poslať bezpečne aj v zimných mesiacoch. Platba vopred na účet, posielame
            pondelok – streda (do CZ len v pondelok) večer poštou 1. triedou. Zásielku si viete sledovať podľa
            podacieho čísla, ktoré vždy zašleme.
          </p>
          <div className="grid grid--3">
            {SHIPPING.map((s, i) => (
              <div className="card card--shipping" data-reveal style={{ transitionDelay: `${i * 80}ms` }} key={s.title}>
                <div className="card--shipping__icon">📦</div>
                <h3>{s.title}</h3>
                <p>{s.detail}</p>
                <span className="price">{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <section id="gallery" className="section section--tint">
        <div className="container">
          <h2 className="section__title" data-reveal>Aktuálne odchovy</h2>
          <p className="section__subtitle" data-reveal>Vyberte si druh a preskúmajte dostupné mutácie.</p>

          <div className="filters" data-reveal>
            {(["all", "python", "milk", "corn"] as Category[]).map((c) => (
              <button
                key={c}
                className={`filter-btn ${filter === c ? "filter-btn--active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c === "all" ? "Všetky" : c === "python" ? "Krajty" : c === "milk" ? "Korálovky" : "Užovky"}
              </button>
            ))}
          </div>

          <div className="grid grid--cards">
            {filteredSnakes.map((s, i) => (
              <article
                className="snake-card"
                key={s.id}
                data-reveal
                style={{ transitionDelay: `${(i % 6) * 60}ms` }}
              >
                <div className="snake-card__media" style={{ background: s.gradient }}>
                  <span className="snake-card__emoji">{s.emoji}</span>
                  <span className="snake-card__year">{s.year}</span>
                </div>
                <div className="snake-card__body">
                  <h3>{s.species}</h3>
                  <p>{s.morph}</p>
                </div>
                <div className="snake-card__hover">
                  <a href="mailto:nicesnakes@pobox.sk" className="btn btn--small">Mám záujem</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- EQUIPMENT ---------------- */}
      <section id="equipment" className="section">
        <div className="container">
          <h2 className="section__title" data-reveal>Chovné zariadenia na predaj</h2>
          <p className="section__subtitle" data-reveal>Rack systémy a terárne steny — voľné po dohode.</p>

          <div className="grid grid--3">
            {RACKS.map((r, i) => (
              <div className="card card--rack" data-reveal style={{ transitionDelay: `${i * 70}ms` }} key={r.title}>
                <div className="card--rack__icon">🗄️</div>
                <h3>{r.title}</h3>
                <p className="muted">{r.size}</p>
                <p>{r.note}</p>
                <span className="price price--lg">{r.price}</span>
              </div>
            ))}
          </div>

          <h3 className="section__subheading" data-reveal>Príslušenstvo</h3>
          <div className="grid grid--accessories">
            {ACCESSORIES.map((a, i) => (
              <div className="chip" data-reveal style={{ transitionDelay: `${i * 50}ms` }} key={a.name}>
                <span className="chip__icon">{a.icon}</span>
                <span>{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="section section--dark section--contact">
        <div className="container">
          <h2 className="section__title" data-reveal>Máte otázku alebo záujem?</h2>
          <p className="section__subtitle" data-reveal>Ozvite sa — radi poradíme s výberom aj s prepravou.</p>

          <div className="contact-grid" data-reveal>
            <a className="contact-card" href="mailto:nicesnakes@pobox.sk">
              <span className="contact-card__icon">✉️</span>
              <span>nicesnakes@pobox.sk</span>
            </a>
            <a className="contact-card" href="tel:+421903867725">
              <span className="contact-card__icon">📞</span>
              <span>+421 903 867 725</span>
            </a>
            <a className="contact-card" href="https://wa.me/421903867725" target="_blank" rel="noreferrer">
              <span className="contact-card__icon">💬</span>
              <span>WhatsApp</span>
            </a>
            <a className="contact-card" href="https://www.facebook.com/marian.schveizer/" target="_blank" rel="noreferrer">
              <span className="contact-card__icon">📘</span>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="brand brand--footer">
            <span className="brand__icon">🐍</span>
            <span className="brand__name">snakes.sk</span>
          </div>
          <p>© {new Date().getFullYear()} snakes.sk — všetky práva vyhradené.</p>
        </div>
      </footer>

      {/* ---------------- BACK TO TOP ---------------- */}
      <button
        className={`to-top ${showTop ? "to-top--visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Späť na začiatok"
      >
        ↑
      </button>
    </div>
  );
}