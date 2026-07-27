import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import type { ReactNode, ReactElement, FormEvent } from 'react';
import './Dodavka.css';

/* ==================================================================
   1. i18n — types, dictionaries, provider, hook
   ================================================================== */

type IconKey = 'box' | 'wrench' | 'van' | 'skip' | 'clear';

interface ServiceItem {
  icon: IconKey;
  name: string;
  desc: string;
}

interface ValueItem {
  title: string;
  text: string;
}

interface PricingLine {
  name: string;
  price: string;
}

interface PricingCategory {
  id: string;
  label: string;
  items: PricingLine[];
}

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

interface HoursRow {
  day: string;
  time: string;
}

interface Translations {
  meta: {
    title: string;
  };
  nav: {
    home: string;
    about: string;
    services: string;
    pricing: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaServices: string;
    ctaContact: string;
    tagEyebrow: string;
    tagMain: string;
    tagSub: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraph: string;
    values: ValueItem[];
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    note: string;
    categories: PricingCategory[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: TestimonialItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    formName: string;
    formEmail: string;
    formPhone: string;
    formSubject: string;
    formMessage: string;
    formSubmit: string;
    formNote: string;
    infoTitle: string;
    address: string;
    phone: string;
    email: string;
    hoursTitle: string;
    hours: HoursRow[];
    socialTitle: string;
  };
  map: {
    eyebrow: string;
    title: string;
    directions: string;
  };
  footer: {
    tagline: string;
    quickLinksTitle: string;
    contactTitle: string;
    hoursTitle: string;
    rights: string;
  };
}

const sk: Translations = {
  meta: { title: 'Moving Company — Sťahovanie Senec' },
  nav: {
    home: 'Domov',
    about: 'O nás',
    services: 'Služby',
    pricing: 'Cenník',
    contact: 'Kontakt',
    openMenu: 'Otvoriť menu',
    closeMenu: 'Zavrieť menu',
  },
  hero: {
    eyebrow: 'Sťahovacia spoločnosť • Senec a okolie',
    title: 'Sťahovanie bez stresu, od prvej škatule po poslednú skrutku.',
    subtitle:
      'Sťahujeme byty, domy aj kancelárie, montujeme nábytok priamo na mieste a odvezieme všetko, čo sa už domov nezmestí — starý nábytok, stavebnú sutinu aj objemný odpad. Vlastný vozový park, poistená preprava, jeden telefonát stačí na termín.',
    ctaServices: 'Pozrieť služby',
    ctaContact: 'Nezáväzná ponuka',
    tagEyebrow: 'Moving Co.',
    tagMain: 'Senec',
    tagSub: 'Nosnosť 3,5 t',
  },
  about: {
    eyebrow: 'O nás',
    title: 'Jeden tím, jedna dodávka, žiadne prekvapenia',
    paragraph:
      'Sťahujeme domácnosti aj firmy v Senci a okolí Bratislavy. Každú zákazku si vopred obhliadneme alebo prekonzultujeme telefonicky, takže vopred viete, koľko to bude stáť a koľko ľudí príde. Nábytok chránime, vieme ho rozobrať aj znova zložiť na novom mieste.',
    values: [
      { title: 'Vlastné vybavenie', text: 'Sťahovacie pásy, prikrývky, plošinové vozíky aj náradie na montáž máme vždy so sebou.' },
      { title: 'Poistená preprava', text: 'Každá zákazka je krytá poistením zodpovednosti za spôsobenú škodu.' },
      { title: 'Presné termíny', text: 'Dohodnutý čas dodržíme — vieme, že si na sťahovanie berete voľno.' },
    ],
  },
  services: {
    eyebrow: 'Naše služby',
    title: 'Čo pre vás prevezieme',
    subtitle: 'Od jednej skrine po celý byt — vlastníme dodávky aj náradie na všetko, čo si sťahovanie vyžaduje.',
    items: [
      { icon: 'box', name: 'Sťahovanie nábytku', desc: 'Byty, domy aj kancelárie — vynesieme, odvezieme, dovezieme a uložíme na miesto.' },
      { icon: 'wrench', name: 'Montáž nábytku', desc: 'Rozloženie a opätovné zloženie skríň, postelí aj kuchynských liniek priamo u vás.' },
      { icon: 'van', name: 'Preprava veľkých predmetov', desc: 'Klavíry, trezory, biele techniky a iné neskladné kusy prevezieme bezpečne.' },
      { icon: 'skip', name: 'Odvoz odpadu a sute', desc: 'Vypraceme starý nábytok, stavebnú sutinu aj objemný odpad na zberný dvor.' },
      { icon: 'clear', name: 'Vypratávanie priestorov', desc: 'Vyprázdnime byty, pivnice, garáže aj kancelárie pred sťahovaním či rekonštrukciou.' },
    ],
  },
  pricing: {
    eyebrow: 'Cenník',
    title: 'Koľko to stojí',
    subtitle: 'Orientačný cenník — presnú sumu vieme určiť po obhliadke alebo telefonickom rozhovore.',
    note: 'Presnú cenu vieme určiť po telefonickej alebo osobnej obhliadke — kontaktujte nás pre nezáväznú kalkuláciu.',
    categories: [
      {
        id: 'moving', label: 'Sťahovanie',
        items: [
          { name: 'Malý byt (1-izbový)', price: 'od 120 €' },
          { name: 'Väčší byt (3-izbový)', price: 'od 220 €' },
          { name: 'Rodinný dom', price: 'od 350 €' },
          { name: 'Príplatok za poschodie bez výťahu', price: '10 €/podlažie' },
        ],
      },
      {
        id: 'assembly', label: 'Montáž',
        items: [
          { name: 'Skriňa / šatník', price: 'od 25 €' },
          { name: 'Kuchynská linka', price: 'od 60 €' },
          { name: 'Posteľ s roštom', price: 'od 20 €' },
          { name: 'Nábytok IKEA (kus)', price: 'od 15 €' },
        ],
      },
      {
        id: 'transport', label: 'Preprava',
        items: [
          { name: 'Klavír / pianíno', price: 'od 90 €' },
          { name: 'Trezor do 300 kg', price: 'od 80 €' },
          { name: 'Chladnička / práčka', price: 'od 30 €' },
          { name: 'Preprava mimo Senca', price: '0,60 €/km' },
        ],
      },
      {
        id: 'waste', label: 'Odvoz odpadu',
        items: [
          { name: 'Objemný odpad (1 m³)', price: 'od 20 €' },
          { name: 'Stavebná sutina (1 m³)', price: 'od 25 €' },
          { name: 'Vypratanie pivnice / garáže', price: 'od 90 €' },
          { name: 'Poplatok za zberný dvor', price: 'podľa množstva' },
        ],
      },
    ],
  },
  testimonials: {
    eyebrow: 'Referencie',
    title: 'Sťahovanie, na ktoré sa dá spoľahnúť',
    items: [
      { quote: 'Sťahovali sme 3-izbový byt aj s klavírom a všetko prebehlo rýchlo a bez jednej škrabance.', author: 'Lucia P.', role: 'Sťahovanie bytu, Senec' },
      { quote: 'Prišli presne na dohodnutý čas, rozobrali skrine, previezli a znova zložili do hodiny.', author: 'Marek Š.', role: 'Montáž a sťahovanie, Bratislava' },
      { quote: 'Odviezli nám sutinu z rekonštrukcie kúpeľne v ten istý deň, keď sme volali.', author: 'Zuzana a Ivan', role: 'Odvoz odpadu, Senec' },
    ],
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Dohodnime si termín',
    subtitle: 'Napíšte nám, čo a kedy potrebujete presťahovať, a pošleme vám cenovú ponuku do 24 hodín.',
    formName: 'Meno',
    formEmail: 'Váš e-mail',
    formPhone: 'Telefón',
    formSubject: 'Predmet',
    formMessage: 'Správa',
    formSubmit: 'Otvoriť v e-mailovej aplikácii',
    formNote: 'Po odoslaní sa otvorí vaša e-mailová aplikácia s predvyplnenou správou — nič neposielame za vás.',
    infoTitle: 'Kontaktné údaje',
    address: 'Lichnerova 89, 903 01 Senec',
    phone: '+421 910 555 123',
    email: 'info@movingcompany.sk',
    hoursTitle: 'Otváracie hodiny',
    hours: [
      { day: 'Pondelok – Piatok', time: '7:00 – 19:00' },
      { day: 'Sobota', time: '8:00 – 14:00' },
      { day: 'Nedeľa', time: 'Len po dohode' },
    ],
    socialTitle: 'Sledujte nás',
  },
  map: {
    eyebrow: 'Kde nás nájdete',
    title: 'Sídlime v Senci, jazdíme po celom kraji',
    directions: 'Otvoriť trasu v Google Maps',
  },
  footer: {
    tagline: 'Sťahovanie a preprava, na ktoré sa dá spoľahnúť.',
    quickLinksTitle: 'Rýchle odkazy',
    contactTitle: 'Kontakt',
    hoursTitle: 'Otváracie hodiny',
    rights: 'Všetky práva vyhradené.',
  },
};

const en: Translations = {
  meta: { title: 'Moving Company — Senec Movers' },
  nav: {
    home: 'Home',
    about: 'About us',
    services: 'Services',
    pricing: 'Pricing',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    eyebrow: 'Moving company • Senec & surroundings',
    title: 'Moving day, minus the stress — box one to the last screw.',
    subtitle:
      'We move flats, houses and offices, assemble furniture on site, and haul away anything that no longer fits — old furniture, construction debris, bulky waste. Our own van fleet, insured transport, one call books the date.',
    ctaServices: 'See our services',
    ctaContact: 'Get a free quote',
    tagEyebrow: 'Moving Co.',
    tagMain: 'Senec',
    tagSub: '3.5 t payload',
  },
  about: {
    eyebrow: 'About us',
    title: 'One crew, one van, no surprises',
    paragraph:
      'We move homes and businesses in Senec and around Bratislava. Every job gets a walkthrough or a phone consultation first, so you know the cost and crew size upfront. We protect your furniture, and can take it apart and rebuild it at the new place.',
    values: [
      { title: 'Our own gear', text: 'Moving straps, blankets, dollies and assembly tools always come with us.' },
      { title: 'Insured transport', text: 'Every job is covered by liability insurance for damages.' },
      { title: 'On-time, every time', text: 'We keep the agreed slot — we know you took time off work for this.' },
    ],
  },
  services: {
    eyebrow: 'Our services',
    title: "What we'll haul for you",
    subtitle: 'From a single wardrobe to a whole flat — we bring the vans and tools for whatever the move needs.',
    items: [
      { icon: 'box', name: 'Furniture moving', desc: 'Flats, houses and offices — we carry it out, drive it over, and set it in place.' },
      { icon: 'wrench', name: 'Furniture assembly', desc: 'We disassemble and rebuild wardrobes, beds and kitchen units right on site.' },
      { icon: 'van', name: 'Large item transport', desc: 'Pianos, safes, appliances and other oversized pieces, moved safely.' },
      { icon: 'skip', name: 'Waste & debris removal', desc: 'We clear old furniture, construction debris and bulky waste to the disposal site.' },
      { icon: 'clear', name: 'Clearing spaces', desc: 'We empty flats, cellars, garages and offices before a move or renovation.' },
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'What it costs',
    subtitle: 'A guide price list — the exact quote follows a walkthrough or a phone call.',
    note: "We'll confirm the exact price after a phone or in-person walkthrough — get in touch for a free quote.",
    categories: [
      {
        id: 'moving', label: 'Moving',
        items: [
          { name: 'Small flat (1-bedroom)', price: 'from €120' },
          { name: 'Larger flat (3-bedroom)', price: 'from €220' },
          { name: 'Family house', price: 'from €350' },
          { name: 'No-lift surcharge', price: '€10/floor' },
        ],
      },
      {
        id: 'assembly', label: 'Assembly',
        items: [
          { name: 'Wardrobe / closet', price: 'from €25' },
          { name: 'Kitchen unit', price: 'from €60' },
          { name: 'Bed with frame', price: 'from €20' },
          { name: 'IKEA furniture (each)', price: 'from €15' },
        ],
      },
      {
        id: 'transport', label: 'Transport',
        items: [
          { name: 'Piano', price: 'from €90' },
          { name: 'Safe up to 300 kg', price: 'from €80' },
          { name: 'Fridge / washing machine', price: 'from €30' },
          { name: 'Transport outside Senec', price: '€0.60/km' },
        ],
      },
      {
        id: 'waste', label: 'Waste removal',
        items: [
          { name: 'Bulky waste (1 m³)', price: 'from €20' },
          { name: 'Construction debris (1 m³)', price: 'from €25' },
          { name: 'Cellar / garage clearance', price: 'from €90' },
          { name: 'Disposal site fee', price: 'depends on volume' },
        ],
      },
    ],
  },
  testimonials: {
    eyebrow: 'Reviews',
    title: 'Moving you can count on',
    items: [
      { quote: 'We moved a 3-bedroom flat, piano included, and everything went fast without a single scratch.', author: 'Lucia P.', role: 'Flat move, Senec' },
      { quote: 'They showed up right on time, took the wardrobes apart, moved them, and rebuilt everything within the hour.', author: 'Marek Š.', role: 'Assembly & move, Bratislava' },
      { quote: 'They hauled away our bathroom renovation debris the same day we called.', author: 'Zuzana & Ivan', role: 'Waste removal, Senec' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: "Let's book your date",
    subtitle: "Tell us what and when you need moved, and we'll send a quote within 24 hours.",
    formName: 'Name',
    formEmail: 'Your email',
    formPhone: 'Phone',
    formSubject: 'Subject',
    formMessage: 'Message',
    formSubmit: 'Open in email app',
    formNote: 'Sending this opens your own email app with the message pre-filled — we never send anything for you.',
    infoTitle: 'Contact details',
    address: 'Lichnerova 89, 903 01 Senec, Slovakia',
    phone: '+421 910 555 123',
    email: 'info@movingcompany.sk',
    hoursTitle: 'Opening hours',
    hours: [
      { day: 'Monday – Friday', time: '7:00 – 19:00' },
      { day: 'Saturday', time: '8:00 – 14:00' },
      { day: 'Sunday', time: 'By arrangement' },
    ],
    socialTitle: 'Follow us',
  },
  map: {
    eyebrow: 'Find us',
    title: 'Based in Senec, on the road across the region',
    directions: 'Open directions in Google Maps',
  },
  footer: {
    tagline: 'Moving and transport you can rely on.',
    quickLinksTitle: 'Quick links',
    contactTitle: 'Contact',
    hoursTitle: 'Opening hours',
    rights: 'All rights reserved.',
  },
};

const languages: { code: string; label: string }[] = [
  { code: 'sk', label: 'SK' },
  { code: 'en', label: 'EN' },
];

const dictionaries: Record<string, Translations> = { sk, en };
const DEFAULT_LANGUAGE = 'sk';

interface LanguageContextValue {
  language: string;
  setLanguage: (code: string) => void;
  t: Translations;
  languages: { code: string; label: string }[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(DEFAULT_LANGUAGE);

  const setLanguage = (code: string) => {
    if (dictionaries[code]) setLanguageState(code);
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: dictionaries[language] ?? dictionaries[DEFAULT_LANGUAGE],
      languages,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}

/* ==================================================================
   2. Header
   ================================================================== */

const NAV_ITEMS: { key: 'about' | 'services' | 'pricing' | 'contact'; href: string }[] = [
  { key: 'about', href: '#about' },
  { key: 'services', href: '#services' },
  { key: 'pricing', href: '#pricing' },
  { key: 'contact', href: '#contact' },
];

function Header() {
  const { t, language, setLanguage, languages } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <a href="#top" className="brand">
          <strong>MOVING CO.</strong>
          <span>Senec</span>
        </a>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Hlavná navigácia">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <a href={item.href} onClick={() => setMenuOpen(false)}>
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="lang-switch" role="group" aria-label="Jazyk / Language">
            {languages.map((lng) => (
              <button
                key={lng.code}
                type="button"
                className={lng.code === language ? 'is-active' : ''}
                onClick={() => setLanguage(lng.code)}
              >
                {lng.label}
              </button>
            ))}
          </div>
        </nav>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

/* ==================================================================
   3. Hero
   ================================================================== */

function VanIllustration() {
  return (
    <svg viewBox="0 0 420 300" className="hero-van" aria-hidden="true">
      <ellipse cx="210" cy="248" rx="160" ry="18" className="hero-van__shadow" />
      <path
        className="hero-van__body"
        d="M40 200V110c0-8 6-14 14-14h150v104H40Z"
      />
      <path
        className="hero-van__body"
        d="M204 96h74l52 46v58h-126V96Z"
      />
      <rect x="228" y="112" width="46" height="34" rx="4" className="hero-van__window" />
      <rect x="54" y="112" width="86" height="60" rx="4" className="hero-van__window" />
      <rect x="40" y="176" width="286" height="16" className="hero-van__stripe" />
      <g>
        <circle cx="104" cy="204" r="26" className="hero-van__wheel-rim" />
        <circle cx="104" cy="204" r="11" className="hero-van__wheel-hub" />
        <g className="hero-van__spokes">
          <line x1="104" y1="192" x2="104" y2="216" />
          <line x1="92" y1="204" x2="116" y2="204" />
        </g>
      </g>
      <g>
        <circle cx="288" cy="204" r="26" className="hero-van__wheel-rim" />
        <circle cx="288" cy="204" r="11" className="hero-van__wheel-hub" />
        <g className="hero-van__spokes">
          <line x1="288" y1="192" x2="288" y2="216" />
          <line x1="276" y1="204" x2="300" y2="204" />
        </g>
      </g>
    </svg>
  );
}

function CargoTag({ eyebrow, main, sub }: { eyebrow: string; main: string; sub: string }) {
  return (
    <svg viewBox="0 0 160 190" className="cargo-tag" aria-hidden="true">
      <line x1="80" y1="0" x2="80" y2="26" className="cargo-tag__string" />
      <path
        className="cargo-tag__body"
        d="M20 34h120a6 6 0 0 1 6 6v120a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6Z"
      />
      <circle cx="80" cy="18" r="10" className="cargo-tag__hole" />
      <text x="80" y="72" textAnchor="middle" className="cargo-tag__eyebrow">
        {eyebrow}
      </text>
      <text x="80" y="104" textAnchor="middle" className="cargo-tag__main">
        {main}
      </text>
      <line x1="36" y1="122" x2="124" y2="122" stroke="#4a4f54" strokeWidth="1" />
      <text x="80" y="144" textAnchor="middle" className="cargo-tag__sub">
        {sub}
      </text>
    </svg>
  );
}

function PhotoPlaceholder({
  label,
  className = '',
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={`photo-placeholder ${className}`} role="img" aria-label={label}>
      <svg viewBox="0 0 24 24" className="photo-placeholder__icon" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8.5" cy="10" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 16.5 9 12l3.2 3 3-2.6L20 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="photo-placeholder__label">{label}</span>
    </div>
  );
}

function Hero() {
  const { t } = useLanguage();

  return (
    <section id="top" className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <h1 className="hero__title">{t.hero.title}</h1>
          <p className="hero__subtitle">{t.hero.subtitle}</p>
          <div className="hero__cta-row">
            <a href="#services" className="btn btn--primary">{t.hero.ctaServices}</a>
            <a href="#contact" className="btn btn--ghost">{t.hero.ctaContact}</a>
          </div>
        </div>

        <div className="hero__visual">
          <PhotoPlaceholder label="Fotka: sťahovacia dodávka v Senci" className="hero__photo" />
          <VanIllustration />
          <div className="hero__tag-wrap">
            <CargoTag eyebrow={t.hero.tagEyebrow} main={t.hero.tagMain} sub={t.hero.tagSub} />
          </div>
        </div>
      </div>
      <div className="road-divider" aria-hidden="true" />
    </section>
  );
}

/* ==================================================================
   4. About
   ================================================================== */

function CrateIllustration() {
  return (
    <svg viewBox="0 0 320 300" className="crate-illustration" aria-hidden="true">
      <circle cx="160" cy="150" r="140" className="crate-illustration__ring" />
      <rect x="70" y="110" width="180" height="130" rx="6" className="crate-illustration__box" />
      <line x1="160" y1="110" x2="160" y2="240" className="crate-illustration__tape" />
      <line x1="70" y1="175" x2="250" y2="175" className="crate-illustration__tape" />
      <path d="M40 150c10-8 20-8 30 0M250 150c10-8 20-8 30 0" className="crate-illustration__strap" />
      <rect x="95" y="80" width="130" height="34" rx="4" className="crate-illustration__box" />
    </svg>
  );
}

function ValueIcon() {
  return (
    <svg viewBox="0 0 24 24" className="value-card__icon" aria-hidden="true">
      <path d="M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6l-9-4Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M8.5 12.3 11 15l5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="about">
      <div className="about__inner">
        <div className="about__visual">
          <PhotoPlaceholder label="Fotka: tím pri nakladaní nábytku" className="about__photo" />
          <CrateIllustration />
        </div>

        <div className="about__content">
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="section-title">{t.about.title}</h2>
          <p className="about__paragraph">{t.about.paragraph}</p>

          <ul className="value-list">
            {t.about.values.map((value) => (
              <li key={value.title} className="value-card">
                <ValueIcon />
                <div>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   5. Services
   ================================================================== */

const SERVICE_ICONS: Record<IconKey, ReactElement> = {
  box: <path d="M3 7 12 3l9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10" />,
  wrench: <path d="M21 7a4 4 0 0 1-5.3 3.8L9 17.5a2 2 0 1 1-2.8-2.8l6.7-6.7A4 4 0 1 1 21 7Z" />,
  van: <path d="M3 16V7a1 1 0 0 1 1-1h8v10H3Zm9-7h4.5L21 13v3h-2M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  skip: <path d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M10 11v6M14 11v6" />,
  clear: <path d="M4 5h16v5H4V5Zm2 5v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9M10 14h4" />,
};

function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="services">
      <div className="services__inner">
        <div className="services__heading">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="section-title">{t.services.title}</h2>
          <p className="section-subtitle">{t.services.subtitle}</p>
        </div>

        <div className="services__grid">
          {t.services.items.map((item) => (
            <article key={item.name} className="service-card">
              <PhotoPlaceholder label={`Fotka: ${item.name}`} className="service-card__photo" />
              <div className="service-card__icon-wrap">
                <svg viewBox="0 0 24 24" className="service-card__icon" aria-hidden="true">
                  <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {SERVICE_ICONS[item.icon]}
                  </g>
                </svg>
              </div>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   6. Pricing
   ================================================================== */

function Pricing() {
  const { t } = useLanguage();
  const [active, setActive] = useState(t.pricing.categories[0]?.id);

  useEffect(() => {
    setActive(t.pricing.categories[0]?.id);
  }, [t]);

  const activeCategory = t.pricing.categories.find((c) => c.id === active) ?? t.pricing.categories[0];

  return (
    <section id="pricing" className="pricing">
      <div className="pricing__inner">
        <div className="pricing__heading">
          <span className="eyebrow">{t.pricing.eyebrow}</span>
          <h2 className="section-title">{t.pricing.title}</h2>
          <p className="section-subtitle">{t.pricing.subtitle}</p>
        </div>

        <div className="pricing__tabs" role="tablist" aria-label={t.pricing.title}>
          {t.pricing.categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              type="button"
              aria-selected={cat.id === activeCategory?.id}
              className={`pricing__tab ${cat.id === activeCategory?.id ? 'is-active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="price-tag-grid">
          {activeCategory?.items.map((item) => (
            <div className="price-tag" key={item.name}>
              <span className="price-tag__hole" />
              <span className="price-tag__name">{item.name}</span>
              <span className="price-tag__price">{item.price}</span>
            </div>
          ))}
        </div>

        <p className="pricing__note">{t.pricing.note}</p>
      </div>
    </section>
  );
}

/* ==================================================================
   7. Testimonials
   ================================================================== */

function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="testimonials" aria-label={t.testimonials.title}>
      <div className="testimonials__inner">
        <div className="testimonials__heading">
          <span className="eyebrow">{t.testimonials.eyebrow}</span>
          <h2 className="section-title">{t.testimonials.title}</h2>
        </div>

        <div className="testimonials__track">
          {t.testimonials.items.map((item) => (
            <figure className="testimonial-card" key={item.author}>
              <PhotoPlaceholder label={`Fotka: ${item.author}`} className="testimonial-card__photo" />
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption>
                <span className="testimonial-card__author">{item.author}</span>
                <span className="testimonial-card__role">{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   8. Contact
   ================================================================== */

const COMPANY_EMAIL = 'info@movingcompany.sk';

function SocialIcon({ kind }: { kind: 'facebook' | 'instagram' }) {
  if (kind === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13.8 8.4h1.4V6.2h-1.7c-1.7 0-2.8 1-2.8 2.8v1.3H9.3v2.3h1.4V18h2.3v-5.4h1.6l.3-2.3h-1.9V9.4c0-.6.2-1 .8-1Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const bodyLines = [
      `${t.contact.formName}: ${name}`,
      `${t.contact.formEmail}: ${email}`,
      `${t.contact.formPhone}: ${phone}`,
      '',
      message,
    ];

    const mailto =
      `mailto:${COMPANY_EMAIL}` +
      `?subject=${encodeURIComponent(subject || t.contact.title)}` +
      `&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailto;
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__inner">
        <div className="contact__heading">
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </div>

        <div className="contact__grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <label>
                <span>{t.contact.formName}</span>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </label>
              <label>
                <span>{t.contact.formPhone}</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              </label>
            </div>
            <label>
              <span>{t.contact.formEmail}</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label>
              <span>{t.contact.formSubject}</span>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
            <label>
              <span>{t.contact.formMessage}</span>
              <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>
            <button type="submit" className="btn btn--primary">{t.contact.formSubmit}</button>
            <p className="contact-form__note">{t.contact.formNote}</p>
          </form>

          <div className="contact-info">
            <h3>{t.contact.infoTitle}</h3>
            <ul className="contact-info__list">
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="12" cy="9.5" r="2.4" fill="currentColor" />
                </svg>
                <span>{t.contact.address}</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 4h3l1.5 4-2 1.5a11 11 0 0 0 6 6L16 13.5 20 15v3a2 2 0 0 1-2 2C11.3 20 4 12.7 4 6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <a href={`tel:${t.contact.phone.replace(/\s+/g, '')}`}>{t.contact.phone}</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M4 6.5 12 13l8-6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <a href={`mailto:${COMPANY_EMAIL}`}>{t.contact.email}</a>
              </li>
            </ul>

            <h3>{t.contact.hoursTitle}</h3>
            <table className="hours-table">
              <tbody>
                {t.contact.hours.map((row) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>{t.contact.socialTitle}</h3>
            <div className="social-row">
              <a href="#" aria-label="Facebook" className="social-row__link"><SocialIcon kind="facebook" /></a>
              <a href="#" aria-label="Instagram" className="social-row__link"><SocialIcon kind="instagram" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   9. Map
   ================================================================== */

const MAP_LAT = 48.2181;
const MAP_LON = 17.4000;
const MAP_BBOX = '17.383,48.206,17.417,48.230';

function MapSection() {
  const { t } = useLanguage();

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik&marker=${MAP_LAT},${MAP_LON}`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${MAP_LAT},${MAP_LON}`;

  return (
    <section className="map-section" aria-label={t.map.title}>
      <div className="map-section__inner">
        <div className="map-section__heading">
          <span className="eyebrow">{t.map.eyebrow}</span>
          <h2 className="section-title">{t.map.title}</h2>
        </div>

        <div className="map-section__frame">
          <iframe title={t.map.title} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>

        <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="btn btn--ghost map-section__cta">
          {t.map.directions}
        </a>
      </div>
    </section>
  );
}

/* ==================================================================
   10. Footer
   ================================================================== */

function Footer() {
  const { t, language, setLanguage, languages } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__logo">Moving<span>Co.</span></span>
          <p>{t.footer.tagline}</p>
          <div className="lang-switch lang-switch--footer" role="group" aria-label="Jazyk / Language">
            {languages.map((lng) => (
              <button
                key={lng.code}
                type="button"
                className={lng.code === language ? 'is-active' : ''}
                onClick={() => setLanguage(lng.code)}
              >
                {lng.label}
              </button>
            ))}
          </div>
        </div>

        <div className="site-footer__col">
          <h4>{t.footer.quickLinksTitle}</h4>
          <ul>
            <li><a href="#about">{t.nav.about}</a></li>
            <li><a href="#services">{t.nav.services}</a></li>
            <li><a href="#pricing">{t.nav.pricing}</a></li>
            <li><a href="#contact">{t.nav.contact}</a></li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>{t.footer.contactTitle}</h4>
          <ul>
            <li>{t.contact.address}</li>
            <li><a href={`tel:${t.contact.phone.replace(/\s+/g, '')}`}>{t.contact.phone}</a></li>
            <li><a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a></li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>{t.footer.hoursTitle}</h4>
          <ul>
            {t.contact.hours.map((row) => (
              <li key={row.day}>{row.day}: {row.time}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© {year} Moving Co. {t.footer.rights}</span>
      </div>
    </footer>
  );
}

/* ==================================================================
   11. Page composition / App
   ================================================================== */

function PageContent() {
  return (
    <div className="moving-site">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Testimonials />
        <Contact />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}

export default function MovingCompany() {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
}