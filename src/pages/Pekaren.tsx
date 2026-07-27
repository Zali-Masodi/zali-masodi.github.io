import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import type { ReactNode, ReactElement, FormEvent } from 'react';
import './Pekaren.css';

/* ==================================================================
   1. i18n — types, dictionaries, provider, hook
   ================================================================== */

type IconKey = 'wheat' | 'croissant' | 'cake' | 'cookie' | 'pretzel';

interface CategoryItem {
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
    categories: string;
    pricing: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaMenu: string;
    ctaOrder: string;
    badgeCircleText: string;
    badgeCenter: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraph: string;
    values: ValueItem[];
  };
  categories: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: CategoryItem[];
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
  meta: { title: 'Pekáreň — Rodinná pekáreň' },
  nav: {
    home: 'Domov',
    about: 'Náš príbeh',
    categories: 'Ponuka',
    pricing: 'Cenník',
    contact: 'Kontakt',
    openMenu: 'Otvoriť menu',
    closeMenu: 'Zavrieť menu',
  },
  hero: {
    eyebrow: 'Rodinná pekáreň v Malackách',
    title: 'Chlieb, ako ho piekla stará mama.',
    subtitle:
      'Každé ráno od štvrtej pečieme kváskový chlieb, čerstvé pečivo a koláče z múky od miestnych mlynárov. Bez zbytočností — len poctivé suroviny a čas.',
    ctaMenu: 'Pozrieť ponuku',
    ctaOrder: 'Napísať nám',
    badgeCircleText: 'RODINNÁ PEKÁREŇ • OD ROKU 1998 • ČERSTVO KAŽDÉ RÁNO • ',
    badgeCenter: 'EST. 1998',
  },
  about: {
    eyebrow: 'Náš príbeh',
    title: 'Tri generácie v jednej pekárni',
    paragraph:
      'Pekáreň založili v roku 1998 starí rodičia Anna a Jozef vo dvore rodinného domu. Dnes ju vedie ich dcéra Mária spolu so svojimi deťmi — recept na kvások sa však za tie roky nezmenil ani o gram.',
    values: [
      {
        title: 'Kváskové cesto',
        text: 'Náš kváskový základ má viac ako 20 rokov a kŕmime ho každý jeden deň.',
      },
      {
        title: 'Miestne suroviny',
        text: 'Múku, vajcia aj maslo nakupujeme od farmárov z okolia Malaciek.',
      },
      {
        title: 'Bez zbytočností',
        text: 'Žiadne zlepšovadlá ani umelé arómy — len múka, voda, soľ a čas.',
      },
    ],
  },
  categories: {
    eyebrow: 'Naša ponuka',
    title: 'Čo nájdete na pulte',
    subtitle: 'Pečieme v malých dávkach niekoľkokrát denne, aby bolo pečivo vždy čerstvé.',
    items: [
      { icon: 'wheat', name: 'Chlieb', desc: 'Kváskový, ražný, špaldový aj bezlepkový.' },
      { icon: 'croissant', name: 'Pečivo', desc: 'Croissanty, žemle, sladké slimáky.' },
      { icon: 'cake', name: 'Koláče a torty', desc: 'Tradičné koláče aj torty na objednávku.' },
      { icon: 'cookie', name: 'Sušienky', desc: 'Maslové, linecké, ovsené s medom.' },
      {
        icon: 'pretzel',
        name: 'Sezónne špeciality',
        desc: 'Vianočka, mazance a veľkonočné korbáče podľa sezóny.',
      },
    ],
  },
  pricing: {
    eyebrow: 'Cenník',
    title: 'Ceny pečiva',
    subtitle: 'Orientačný cenník — aktuálnu ponuku nájdete priamo v pekárni.',
    note: 'Torty na mieru cenujeme individuálne podľa veľkosti a náplne — stačí napísať.',
    categories: [
      {
        id: 'bread',
        label: 'Chlieb',
        items: [
          { name: 'Kváskový chlieb 800 g', price: '3,20 €' },
          { name: 'Ražný chlieb 500 g', price: '2,60 €' },
          { name: 'Špaldový chlieb 600 g', price: '3,80 €' },
          { name: 'Bezlepkový chlieb 400 g', price: '4,20 €' },
        ],
      },
      {
        id: 'pastries',
        label: 'Pečivo',
        items: [
          { name: 'Croissant maslový', price: '1,60 €' },
          { name: 'Žemľa', price: '0,45 €' },
          { name: 'Slimák s makom', price: '1,20 €' },
          { name: 'Slimák s orechmi', price: '1,20 €' },
        ],
      },
      {
        id: 'cakes',
        label: 'Koláče',
        items: [
          { name: 'Tvarohový koláč (kus)', price: '1,80 €' },
          { name: 'Makový koláč (kus)', price: '1,80 €' },
          { name: 'Jablkový štrúdľa (kus)', price: '2,10 €' },
          { name: 'Torta na objednávku', price: 'od 25,00 €' },
        ],
      },
      {
        id: 'cookies',
        label: 'Sušienky',
        items: [
          { name: 'Linecké pečivo (10 ks)', price: '4,50 €' },
          { name: 'Ovsené sušienky s medom (10 ks)', price: '4,00 €' },
          { name: 'Maslové keksy (10 ks)', price: '4,20 €' },
        ],
      },
    ],
  },
  testimonials: {
    eyebrow: 'Čo hovoria zákazníci',
    title: 'Chuť, na ktorú sa dá spoľahnúť',
    items: [
      {
        quote:
          'Chlieb tu kupujem už desať rokov a chuť je stále rovnaká — presne taká, akú si pamätám od babky.',
        author: 'Jana K.',
        role: 'Stála zákazníčka',
      },
      {
        quote:
          'Torta na svadbu bola nielen krásna, ale aj naozaj chutná. Odporúčam každému, kto hľadá niečo výnimočné.',
        author: 'Peter M.',
        role: 'Svadobný hosť',
      },
      {
        quote: 'Najlepšie croissanty v meste, bod. Chodíme sem každú nedeľu ráno.',
        author: 'Zuzana a Tomáš',
        role: 'Susedia z Hlavnej ulice',
      },
    ],
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Zastavte sa alebo nám napíšte',
    subtitle: 'Radi zodpovieme otázky ohľadom objednávok, alergénov aj veľkých osláv.',
    formName: 'Meno',
    formEmail: 'Váš e-mail',
    formSubject: 'Predmet',
    formMessage: 'Správa',
    formSubmit: 'Otvoriť v e-mailovej aplikácii',
    formNote:
      'Po odoslaní sa otvorí vaša e-mailová aplikácia s predvyplnenou správou — nič neposielame za vás.',
    infoTitle: 'Kontaktné údaje',
    address: 'Hlavná 25, 901 01 Malacky',
    phone: '+421 905 123 456',
    email: 'info@pekaren.sk',
    hoursTitle: 'Otváracie hodiny',
    hours: [
      { day: 'Pondelok – Piatok', time: '6:00 – 18:00' },
      { day: 'Sobota', time: '7:00 – 12:00' },
      { day: 'Nedeľa', time: 'Zatvorené' },
    ],
    socialTitle: 'Sledujte nás',
  },
  map: {
    eyebrow: 'Kde nás nájdete',
    title: 'Pekáreň v centre Malaciek',
    directions: 'Otvoriť trasu v Google Maps',
  },
  footer: {
    tagline: 'Poctivý chlieb od roku 1998.',
    quickLinksTitle: 'Rýchle odkazy',
    contactTitle: 'Kontakt',
    hoursTitle: 'Otváracie hodiny',
    rights: 'Všetky práva vyhradené.',
  },
};

const en: Translations = {
  meta: { title: 'Pekáreň — Family Bakery' },
  nav: {
    home: 'Home',
    about: 'Our story',
    categories: 'Menu',
    pricing: 'Prices',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    eyebrow: 'Family bakery in Malacky',
    title: 'Bread the way grandma baked it.',
    subtitle:
      'Every morning from 4am we bake sourdough bread, fresh pastries and cakes with flour from local mills. No shortcuts — just honest ingredients and time.',
    ctaMenu: 'See what we bake',
    ctaOrder: 'Write to us',
    badgeCircleText: 'FAMILY BAKERY • SINCE 1998 • FRESH EVERY MORNING • ',
    badgeCenter: 'EST. 1998',
  },
  about: {
    eyebrow: 'Our story',
    title: 'Three generations, one bakery',
    paragraph:
      'Pekáreň was founded in 1998 by grandparents Anna and Jozef in the yard of the family house. Today it is run by their daughter Mária and her children — the sourdough recipe hasn\u2019t changed by a single gram.',
    values: [
      {
        title: 'Sourdough starter',
        text: 'Our starter is over 20 years old and we feed it every single day.',
      },
      {
        title: 'Local ingredients',
        text: 'Flour, eggs and butter all come from farmers around Malacky.',
      },
      {
        title: 'Nothing extra',
        text: 'No improvers, no artificial flavourings — just flour, water, salt and time.',
      },
    ],
  },
  categories: {
    eyebrow: 'What we bake',
    title: 'What you\u2019ll find on the counter',
    subtitle: 'Baked in small batches several times a day, so it\u2019s always fresh.',
    items: [
      { icon: 'wheat', name: 'Bread', desc: 'Sourdough, rye, spelt and gluten-free loaves.' },
      { icon: 'croissant', name: 'Pastries', desc: 'Croissants, rolls, sweet swirl buns.' },
      { icon: 'cake', name: 'Cakes', desc: 'Traditional cakes and made-to-order celebration cakes.' },
      { icon: 'cookie', name: 'Cookies', desc: 'Butter, linzer and honey-oat cookies.' },
      {
        icon: 'pretzel',
        name: 'Seasonal specials',
        desc: 'Christmas braids, Easter breads and treats made for the season.',
      },
    ],
  },
  pricing: {
    eyebrow: 'Price list',
    title: 'What things cost',
    subtitle: 'A guide price list — see the full daily selection in store.',
    note: 'Custom cakes are priced individually by size and filling — just get in touch.',
    categories: [
      {
        id: 'bread',
        label: 'Bread',
        items: [
          { name: 'Sourdough loaf 800 g', price: '€3.20' },
          { name: 'Rye loaf 500 g', price: '€2.60' },
          { name: 'Spelt loaf 600 g', price: '€3.80' },
          { name: 'Gluten-free loaf 400 g', price: '€4.20' },
        ],
      },
      {
        id: 'pastries',
        label: 'Pastries',
        items: [
          { name: 'Butter croissant', price: '€1.60' },
          { name: 'Plain roll', price: '€0.45' },
          { name: 'Poppy seed swirl', price: '€1.20' },
          { name: 'Walnut swirl', price: '€1.20' },
        ],
      },
      {
        id: 'cakes',
        label: 'Cakes',
        items: [
          { name: 'Curd cheese cake (slice)', price: '€1.80' },
          { name: 'Poppy seed cake (slice)', price: '€1.80' },
          { name: 'Apple strudel (slice)', price: '€2.10' },
          { name: 'Custom celebration cake', price: 'from €25.00' },
        ],
      },
      {
        id: 'cookies',
        label: 'Cookies',
        items: [
          { name: 'Linzer cookies (10 pcs)', price: '€4.50' },
          { name: 'Honey-oat cookies (10 pcs)', price: '€4.00' },
          { name: 'Butter biscuits (10 pcs)', price: '€4.20' },
        ],
      },
    ],
  },
  testimonials: {
    eyebrow: 'What people say',
    title: 'A taste you can rely on',
    items: [
      {
        quote:
          'I\u2019ve been buying bread here for ten years and it still tastes exactly like I remember from my grandmother\u2019s kitchen.',
        author: 'Jana K.',
        role: 'Regular customer',
      },
      {
        quote:
          'Our wedding cake was beautiful and genuinely delicious. I\u2019d recommend them to anyone looking for something special.',
        author: 'Peter M.',
        role: 'Wedding guest',
      },
      {
        quote: 'Best croissants in town, full stop. We come every Sunday morning.',
        author: 'Zuzana & Tomáš',
        role: 'Neighbours from Hlavná street',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Stop by or send us a note',
    subtitle: 'Happy to help with orders, allergens or planning a bigger celebration.',
    formName: 'Name',
    formEmail: 'Your email',
    formSubject: 'Subject',
    formMessage: 'Message',
    formSubmit: 'Open in email app',
    formNote:
      'Sending this opens your own email app with the message pre-filled — we never send anything for you.',
    infoTitle: 'Contact details',
    address: 'Hlavná 25, 901 01 Malacky, Slovakia',
    phone: '+421 905 123 456',
    email: 'info@pekaren.sk',
    hoursTitle: 'Opening hours',
    hours: [
      { day: 'Monday – Friday', time: '6:00 – 18:00' },
      { day: 'Saturday', time: '7:00 – 12:00' },
      { day: 'Sunday', time: 'Closed' },
    ],
    socialTitle: 'Follow us',
  },
  map: {
    eyebrow: 'Find us',
    title: 'A bakery in the heart of Malacky',
    directions: 'Open directions in Google Maps',
  },
  footer: {
    tagline: 'Honest bread since 1998.',
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
const STORAGE_KEY = 'pekaren-lang';

interface LanguageContextValue {
  language: string;
  setLanguage: (code: string) => void;
  t: Translations;
  languages: { code: string; label: string }[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && dictionaries[stored]) return stored;
    const browserLang = window.navigator.language.slice(0, 2);
    return dictionaries[browserLang] ? browserLang : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

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

const NAV_ITEMS: { key: 'about' | 'categories' | 'pricing' | 'contact'; href: string }[] = [
  { key: 'about', href: '#about' },
  { key: 'categories', href: '#categories' },
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

function BreadIllustration() {
  return (
    <svg viewBox="0 0 420 360" className="hero-bread" aria-hidden="true">
      <ellipse cx="210" cy="300" rx="150" ry="26" className="hero-bread__shadow" />
      <path
        className="hero-bread__loaf"
        d="M55 230c-6-70 34-140 155-140s161 70 155 140c4 26-14 46-42 50-70 12-158 12-228 0-26-4-44-24-40-50Z"
      />
      <g className="hero-bread__slashes">
        <path d="M120 118c14 32 14 66 2 96" />
        <path d="M200 104c10 34 10 72 0 104" />
        <path d="M282 118c-14 32-14 66-2 96" />
      </g>
      <g className="hero-bread__dust">
        <circle cx="90" cy="90" r="4" />
        <circle cx="330" cy="100" r="3" />
        <circle cx="350" cy="170" r="5" />
        <circle cx="60" cy="170" r="3" />
      </g>
    </svg>
  );
}

function StampBadge({ circleText, center }: { circleText: string; center: string }) {
  return (
    <svg viewBox="0 0 160 160" className="stamp-badge" aria-hidden="true">
      <circle cx="80" cy="80" r="76" className="stamp-badge__ring" />
      <circle cx="80" cy="80" r="64" className="stamp-badge__ring-inner" />
      <path id="stampCirclePath" d="M80,16 a64,64 0 1,1 -0.1,0" fill="none" />
      <text className="stamp-badge__text">
        <textPath href="#stampCirclePath" startOffset="0%">
          {circleText.repeat(2)}
        </textPath>
      </text>
      <text x="80" y="86" textAnchor="middle" className="stamp-badge__center">
        {center}
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
            <a href="#pricing" className="btn btn--primary">
              {t.hero.ctaMenu}
            </a>
            <a href="#contact" className="btn btn--ghost">
              {t.hero.ctaOrder}
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <PhotoPlaceholder label="Fotka: pekáreň / čerstvý chlieb" className="hero__photo" />
          <BreadIllustration />
          <div className="hero__stamp-wrap">
            <StampBadge circleText={t.hero.badgeCircleText} center={t.hero.badgeCenter} />
          </div>
        </div>
      </div>

      <div className="scallop-divider" aria-hidden="true" />
    </section>
  );
}

/* ==================================================================
   4. About
   ================================================================== */

function DoughIllustration() {
  return (
    <svg viewBox="0 0 320 320" className="about-illustration" aria-hidden="true">
      <circle cx="160" cy="160" r="150" className="about-illustration__ring" />
      <ellipse cx="160" cy="195" rx="110" ry="60" className="about-illustration__board" />
      <path
        className="about-illustration__pin-handle"
        d="M60 120c0-10 8-18 18-18s18 8 18 18-8 18-18 18-18-8-18-18Z"
      />
      <rect x="90" y="112" width="150" height="16" rx="8" className="about-illustration__pin" />
      <path
        className="about-illustration__pin-handle"
        d="M232 120c0-10 8-18 18-18s18 8 18 18-8 18-18 18-18-8-18-18Z"
      />
      <g className="about-illustration__dust">
        <circle cx="120" cy="150" r="3" />
        <circle cx="200" cy="145" r="2.5" />
        <circle cx="160" cy="160" r="2" />
        <circle cx="140" cy="170" r="2.5" />
        <circle cx="185" cy="168" r="2" />
      </g>
    </svg>
  );
}

function ValueIcon() {
  return (
    <svg viewBox="0 0 24 24" className="value-card__icon" aria-hidden="true">
      <path
        d="M4 12c2-5 6-8 8-8s6 3 8 8c-2 5-6 8-8 8s-6-3-8-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="about">
      <div className="about__inner">
        <div className="about__visual">
          <PhotoPlaceholder label="Fotka: rodina pri práci v pekárni" className="about__photo" />
          <DoughIllustration />
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
   5. Categories
   ================================================================== */

const CATEGORY_ICONS: Record<IconKey, ReactElement> = {
  wheat: (
    <path d="M12 21V6M12 6c-2 1.6-4.6 1.6-6.6 0M12 6c2 1.6 4.6 1.6 6.6 0M12 10.6c-2 1.6-4.6 1.6-6.6 0M12 10.6c2 1.6 4.6 1.6 6.6 0M12 15.2c-2 1.6-4.6 1.6-6.6 0M12 15.2c2 1.6 4.6 1.6 6.6 0" />
  ),
  croissant: (
    <path d="M3 15c1-5 5-9 9-9 3 0 5 1.4 5 3.4 0 1.3-1 2-2.1 2.6 1.7.3 3.1 1.4 3.1 3 0 2.6-3.6 4-7 4-3.8 0-8-1.3-8-4Z" />
  ),
  cake: (
    <path d="M4 20v-6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6H4Zm3-9V8m5 3V6m5 5V8M9 8c0-1.1.9-2.5 2-3M15 8c0-1.1-.9-2.5-2-3" />
  ),
  cookie: (
    <path d="M12 3a9 9 0 1 0 9 9c-1.7 0-3-1.3-3-3a3 3 0 0 1 .3-1.3A3 3 0 0 1 15 6a3 3 0 0 1-3-3ZM9 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm2 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
  ),
  pretzel: (
    <path d="M8 6c-3 0-5 2.5-5 5.5S5 17 8 17c2 0 3-1.2 4-3 1 1.8 2 3 4 3 3 0 5-2.5 5-5.5S19 6 16 6c-2.2 0-3.6 2-4 4-.4-2-1.8-4-4-4Z" />
  ),
};

function Categories() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="categories">
      <div className="categories__inner">
        <div className="categories__heading">
          <span className="eyebrow">{t.categories.eyebrow}</span>
          <h2 className="section-title">{t.categories.title}</h2>
          <p className="section-subtitle">{t.categories.subtitle}</p>
        </div>

        <div className="categories__grid">
          {t.categories.items.map((item) => (
            <article key={item.name} className="category-card">
              <PhotoPlaceholder label={`Fotka: ${item.name}`} className="category-card__photo" />
              <svg viewBox="0 0 24 24" className="category-card__icon" aria-hidden="true">
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {CATEGORY_ICONS[item.icon]}
                </g>
              </svg>
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

  const activeCategory =
    t.pricing.categories.find((c) => c.id === active) ?? t.pricing.categories[0];

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

const BAKERY_EMAIL = 'info@pekaren.sk';

function SocialIcon({ kind }: { kind: 'facebook' | 'instagram' }) {
  if (kind === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M13.8 8.4h1.4V6.2h-1.7c-1.7 0-2.8 1-2.8 2.8v1.3H9.3v2.3h1.4V18h2.3v-5.4h1.6l.3-2.3h-1.9V9.4c0-.6.2-1 .8-1Z"
          fill="currentColor"
        />
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
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const bodyLines = [
      `${t.contact.formName}: ${name}`,
      `${t.contact.formEmail}: ${email}`,
      '',
      message,
    ];

    const mailto =
      `mailto:${BAKERY_EMAIL}` +
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
            <label>
              <span>{t.contact.formName}</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label>
              <span>{t.contact.formEmail}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            <label>
              <span>{t.contact.formSubject}</span>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
            <label>
              <span>{t.contact.formMessage}</span>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn--primary">
              {t.contact.formSubmit}
            </button>
            <p className="contact-form__note">{t.contact.formNote}</p>
          </form>

          <div className="contact-info">
            <h3>{t.contact.infoTitle}</h3>
            <ul className="contact-info__list">
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <circle cx="12" cy="9.5" r="2.4" fill="currentColor" />
                </svg>
                <span>{t.contact.address}</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 4h3l1.5 4-2 1.5a11 11 0 0 0 6 6L16 13.5 20 15v3a2 2 0 0 1-2 2C11.3 20 4 12.7 4 6a2 2 0 0 1 2-2Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
                <a href={`tel:${t.contact.phone.replace(/\s+/g, '')}`}>{t.contact.phone}</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M4 6.5 12 13l8-6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <a href={`mailto:${BAKERY_EMAIL}`}>{t.contact.email}</a>
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
              <a href="#" aria-label="Facebook" className="social-row__link">
                <SocialIcon kind="facebook" />
              </a>
              <a href="#" aria-label="Instagram" className="social-row__link">
                <SocialIcon kind="instagram" />
              </a>
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

const MAP_LAT = 48.4353;
const MAP_LON = 17.0173;
const MAP_BBOX = '17.001,48.424,17.034,48.447';

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
          <iframe
            title={t.map.title}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--ghost map-section__cta"
        >
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
          <span className="site-footer__logo">Pekáreň</span>
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
            <li>
              <a href="#about">{t.nav.about}</a>
            </li>
            <li>
              <a href="#categories">{t.nav.categories}</a>
            </li>
            <li>
              <a href="#pricing">{t.nav.pricing}</a>
            </li>
            <li>
              <a href="#contact">{t.nav.contact}</a>
            </li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>{t.footer.contactTitle}</h4>
          <ul>
            <li>{t.contact.address}</li>
            <li>
              <a href={`tel:${t.contact.phone.replace(/\s+/g, '')}`}>{t.contact.phone}</a>
            </li>
            <li>
              <a href="mailto:info@pekaren.sk">info@pekaren.sk</a>
            </li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>{t.footer.hoursTitle}</h4>
          <ul>
            {t.contact.hours.map((row) => (
              <li key={row.day}>
                {row.day}: {row.time}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© {year} Pekáreň. {t.footer.rights}</span>
      </div>
    </footer>
  );
}

/* ==================================================================
   11. Page composition / App
   ================================================================== */

function PageContent() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t.meta.title;
  }, [t]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Categories />
        <Pricing />
        <Testimonials />
        <Contact />
        <MapSection />
      </main>
      <Footer />
    </>
  );
}

export default function Pekaren() {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
}