import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  PiArrowRightLight,
  PiArrowUpRightLight,
  PiBreadLight,
  PiCakeLight,
  PiCookieLight,
  PiEnvelopeSimpleLight,
  PiFacebookLogoLight,
  PiGrainsLight,
  PiHandHeartLight,
  PiInstagramLogoLight,
  PiLeafLight,
  PiMapPinLight,
  PiPhoneLight,
  PiPlantLight,
  PiQuotesFill,
  PiSparkleLight,
  PiWarningCircleLight,
} from 'react-icons/pi';
import '@fontsource-variable/bricolage-grotesque/standard';
import { Photo, Reveal } from './shared/components';
import {
  EASE_OUT,
  scrollToId,
  scrollToTop,
  todayIndex,
  useDocumentTitle,
  useScrollLock,
  useScrolledPast,
  useSmoothScroll,
  useStoredLang,
} from './shared/kit';
import './Pekaren.css';

/* =========================================================
   Bakery details
   ========================================================= */
const BAKERY = {
  name: 'Pekáreň',
  email: 'info@pekaren.sk',
  phone: '+421 905 123 456',
  phoneHref: 'tel:+421905123456',
  /* Fill in real profile URLs to show the icons; empty ones stay hidden. */
  facebook: '',
  instagram: '',
};

const MAP = {
  lat: 48.4353,
  lon: 17.0173,
  bbox: '17.001,48.424,17.034,48.447',
};

/* Opening hours per weekday (Mon = 0) in minutes after midnight. */
const SCHEDULE: ([number, number] | null)[] = [
  [360, 1080],
  [360, 1080],
  [360, 1080],
  [360, 1080],
  [360, 1080],
  [420, 720],
  null,
];

/* Real photos: drop files into public/pekaren/ and fill in the paths,
   e.g. hero: '/pekaren/vitrina.jpg'. Empty slots show the indigo cloth. */
const PHOTOS: { hero?: string; about?: string; categories: (string | undefined)[] } = {
  categories: [],
};

/* =========================================================
   Content
   ========================================================= */
type Lang = 'sk' | 'en';
const LANGS = ['sk', 'en'] as const;

interface Content {
  meta: string;
  nav: { about: string; categories: string; pricing: string; contact: string; menu: string; close: string; skip: string };
  cta: string;
  status: { open: (until: string) => string; opensToday: (at: string) => string; opensTomorrow: (at: string) => string; opensOn: (day: number, at: string) => string };
  hero: { title: [string, string]; accent: string; subtitle: string; ctaMenu: string; stamp: string };
  marquee: string[];
  about: { title: string; paragraph: string; values: { icon: IconType; title: string; text: string }[] };
  categories: { title: string; subtitle: string; items: { icon: IconType; name: string; desc: string }[] };
  pricing: { title: string; subtitle: string; note: string; categories: { id: string; label: string; items: { name: string; price: string }[] }[] };
  testimonials: { title: string; prev: string; next: string; items: { quote: string; author: string; role: string }[] };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    optional: string;
    submit: string;
    note: string;
    opened: string;
    errName: string;
    errEmail: string;
    errMessage: string;
    infoTitle: string;
    address: string;
    hoursTitle: string;
    today: string;
    hours: { days: number[]; label: string; time: string }[];
    social: string;
  };
  map: { title: string; directions: string };
  footer: { tagline: string; links: string; contact: string; hours: string; rights: string; top: string };
}

const SK_DAYS_ON = ['v pondelok', 'v utorok', 'v stredu', 'vo štvrtok', 'v piatok', 'v sobotu', 'v nedeľu'];
const EN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const content: Record<Lang, Content> = {
  sk: {
    meta: 'Pekáreň | Rodinná pekáreň v Malackách od roku 1998',
    nav: { about: 'Náš príbeh', categories: 'Ponuka', pricing: 'Cenník', contact: 'Kontakt', menu: 'Otvoriť menu', close: 'Zavrieť menu', skip: 'Preskočiť na obsah' },
    cta: 'Napísať nám',
    status: {
      open: (until) => `Práve máme otvorené, do ${until}`,
      opensToday: (at) => `Teraz zatvorené, otvárame dnes o ${at}`,
      opensTomorrow: (at) => `Teraz zatvorené, otvárame zajtra o ${at}`,
      opensOn: (day, at) => `Teraz zatvorené, otvárame ${SK_DAYS_ON[day]} o ${at}`,
    },
    hero: {
      title: ['Chlieb, ako ho', 'piekla'],
      accent: 'stará mama.',
      subtitle: 'Každé ráno od štvrtej pečieme kváskový chlieb, pečivo a koláče z múky od miestnych mlynárov.',
      ctaMenu: 'Pozrieť ponuku',
      stamp: 'RODINNÁ PEKÁREŇ ✳ OD ROKU 1998 ✳ ČERSTVO KAŽDÉ RÁNO ✳ ',
    },
    marquee: ['Kváskový chlieb', 'Maslové croissanty', 'Makové slimáky', 'Tvarohové koláče', 'Ražný chlieb', 'Linecké pečivo'],
    about: {
      title: 'Tri generácie v jednej pekárni',
      paragraph:
        'Pekáreň založili v roku 1998 starí rodičia Anna a Jozef vo dvore rodinného domu. Dnes ju vedie ich dcéra Mária so svojimi deťmi. Recept na kvások sa za tie roky nezmenil ani o gram.',
      values: [
        { icon: PiPlantLight, title: 'Kváskové cesto', text: 'Náš kváskový základ má viac ako 20 rokov a kŕmime ho každý jeden deň.' },
        { icon: PiLeafLight, title: 'Miestne suroviny', text: 'Múku, vajcia aj maslo nakupujeme od farmárov z okolia Malaciek.' },
        { icon: PiHandHeartLight, title: 'Bez zbytočností', text: 'Žiadne zlepšovadlá ani umelé arómy. Len múka, voda, soľ a čas.' },
      ],
    },
    categories: {
      title: 'Čo nájdete na pulte',
      subtitle: 'Pečieme v malých dávkach niekoľkokrát denne, aby bolo pečivo vždy čerstvé.',
      items: [
        { icon: PiGrainsLight, name: 'Chlieb', desc: 'Kváskový, ražný, špaldový aj bezlepkový.' },
        { icon: PiBreadLight, name: 'Pečivo', desc: 'Croissanty, žemle a sladké slimáky.' },
        { icon: PiCakeLight, name: 'Koláče a torty', desc: 'Tradičné koláče aj torty na objednávku.' },
        { icon: PiCookieLight, name: 'Sušienky', desc: 'Maslové, linecké a ovsené s medom.' },
        { icon: PiSparkleLight, name: 'Sezónne špeciality', desc: 'Vianočka, mazance a veľkonočné dobroty podľa sezóny.' },
      ],
    },
    pricing: {
      title: 'Cenník',
      subtitle: 'Orientačné ceny. Aktuálnu ponuku nájdete priamo v pekárni.',
      note: 'Torty na mieru cenujeme podľa veľkosti a náplne. Stačí nám napísať.',
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
            { name: 'Jablková štrúdľa (kus)', price: '2,10 €' },
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
      title: 'Chuť, na ktorú sa dá spoľahnúť',
      prev: 'Predchádzajúca recenzia',
      next: 'Ďalšia recenzia',
      items: [
        { quote: 'Chlieb tu kupujem už desať rokov a chuť je stále rovnaká. Presne taká, akú si pamätám od babky.', author: 'Jana K.', role: 'Stála zákazníčka' },
        { quote: 'Torta na svadbu bola nielen krásna, ale aj naozaj chutná. Odporúčam každému, kto hľadá niečo výnimočné.', author: 'Peter M.', role: 'Svadobný hosť' },
        { quote: 'Najlepšie croissanty v meste, bodka. Chodíme sem každú nedeľu ráno.', author: 'Zuzana a Tomáš', role: 'Susedia z Hlavnej ulice' },
      ],
    },
    contact: {
      title: 'Zastavte sa alebo nám napíšte',
      subtitle: 'Radi zodpovieme otázky ohľadom objednávok, alergénov aj veľkých osláv.',
      name: 'Meno',
      email: 'Váš e-mail',
      subject: 'Predmet',
      message: 'Správa',
      optional: 'nepovinné',
      submit: 'Odoslať správu',
      note: 'Formulár otvorí váš e-mailový program s pripravenou správou. Nič neposielame za vás.',
      opened: 'Otvorili sme váš e-mailový program. Ak sa neotvoril, napíšte nám na',
      errName: 'Napíšte nám, ako vás oslovovať.',
      errEmail: 'Zadajte e-mail v tvare meno@domena.sk.',
      errMessage: 'Správa je zatiaľ prázdna.',
      infoTitle: 'Kontaktné údaje',
      address: 'Hlavná 25, 901 01 Malacky',
      hoursTitle: 'Otváracie hodiny',
      today: 'dnes',
      hours: [
        { days: [0, 1, 2, 3, 4], label: 'Pondelok-Piatok', time: '6:00-18:00' },
        { days: [5], label: 'Sobota', time: '7:00-12:00' },
        { days: [6], label: 'Nedeľa', time: 'Zatvorené' },
      ],
      social: 'Sledujte nás',
    },
    map: { title: 'Pekáreň v centre Malaciek', directions: 'Navigovať v Google Maps' },
    footer: { tagline: 'Poctivý chlieb od roku 1998.', links: 'Rýchle odkazy', contact: 'Kontakt', hours: 'Otváracie hodiny', rights: 'Všetky práva vyhradené.', top: 'Späť hore' },
  },
  en: {
    meta: 'Pekáreň | Family bakery in Malacky since 1998',
    nav: { about: 'Our story', categories: 'Menu', pricing: 'Prices', contact: 'Contact', menu: 'Open menu', close: 'Close menu', skip: 'Skip to content' },
    cta: 'Write to us',
    status: {
      open: (until) => `Open right now, until ${until}`,
      opensToday: (at) => `Closed now, opening today at ${at}`,
      opensTomorrow: (at) => `Closed now, opening tomorrow at ${at}`,
      opensOn: (day, at) => `Closed now, opening ${EN_DAYS[day]} at ${at}`,
    },
    hero: {
      title: ['Bread the way', ''],
      accent: 'grandma baked it.',
      subtitle: 'Every morning from 4am we bake sourdough, pastries and cakes with flour from local mills.',
      ctaMenu: 'See what we bake',
      stamp: 'FAMILY BAKERY ✳ SINCE 1998 ✳ FRESH EVERY MORNING ✳ ',
    },
    marquee: ['Sourdough loaves', 'Butter croissants', 'Poppy seed swirls', 'Curd cheese cake', 'Rye bread', 'Linzer cookies'],
    about: {
      title: 'Three generations, one bakery',
      paragraph:
        'Pekáreň was founded in 1998 by grandparents Anna and Jozef in the yard of the family house. Today their daughter Mária runs it with her children. The sourdough recipe hasn’t changed by a single gram.',
      values: [
        { icon: PiPlantLight, title: 'Sourdough starter', text: 'Our starter is over 20 years old and we feed it every single day.' },
        { icon: PiLeafLight, title: 'Local ingredients', text: 'Flour, eggs and butter all come from farmers around Malacky.' },
        { icon: PiHandHeartLight, title: 'Nothing extra', text: 'No improvers, no artificial flavourings. Just flour, water, salt and time.' },
      ],
    },
    categories: {
      title: 'What you’ll find on the counter',
      subtitle: 'Baked in small batches several times a day, so it’s always fresh.',
      items: [
        { icon: PiGrainsLight, name: 'Bread', desc: 'Sourdough, rye, spelt and gluten-free loaves.' },
        { icon: PiBreadLight, name: 'Pastries', desc: 'Croissants, rolls and sweet swirl buns.' },
        { icon: PiCakeLight, name: 'Cakes', desc: 'Traditional cakes and made-to-order celebration cakes.' },
        { icon: PiCookieLight, name: 'Cookies', desc: 'Butter, linzer and honey-oat cookies.' },
        { icon: PiSparkleLight, name: 'Seasonal specials', desc: 'Christmas braids, Easter breads and treats made for the season.' },
      ],
    },
    pricing: {
      title: 'Prices',
      subtitle: 'A guide price list. See the full daily selection in store.',
      note: 'Custom cakes are priced by size and filling. Just get in touch.',
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
      title: 'A taste you can rely on',
      prev: 'Previous review',
      next: 'Next review',
      items: [
        { quote: 'I’ve been buying bread here for ten years and it still tastes exactly like my grandmother’s.', author: 'Jana K.', role: 'Regular customer' },
        { quote: 'Our wedding cake was beautiful and genuinely delicious. I’d recommend them to anyone looking for something special.', author: 'Peter M.', role: 'Wedding guest' },
        { quote: 'Best croissants in town, full stop. We come every Sunday morning.', author: 'Zuzana & Tomáš', role: 'Neighbours from Hlavná street' },
      ],
    },
    contact: {
      title: 'Stop by or send us a note',
      subtitle: 'Happy to help with orders, allergens or planning a bigger celebration.',
      name: 'Name',
      email: 'Your email',
      subject: 'Subject',
      message: 'Message',
      optional: 'optional',
      submit: 'Send message',
      note: 'The form opens your own email app with the message ready. We never send anything for you.',
      opened: "We've opened your email app. If nothing happened, write to us at",
      errName: 'Tell us what to call you.',
      errEmail: 'Enter an email like name@domain.com.',
      errMessage: 'The message is still empty.',
      infoTitle: 'Contact details',
      address: 'Hlavná 25, 901 01 Malacky, Slovakia',
      hoursTitle: 'Opening hours',
      today: 'today',
      hours: [
        { days: [0, 1, 2, 3, 4], label: 'Monday-Friday', time: '6:00-18:00' },
        { days: [5], label: 'Saturday', time: '7:00-12:00' },
        { days: [6], label: 'Sunday', time: 'Closed' },
      ],
      social: 'Follow us',
    },
    map: { title: 'A bakery in the heart of Malacky', directions: 'Directions in Google Maps' },
    footer: { tagline: 'Honest bread since 1998.', links: 'Quick links', contact: 'Contact', hours: 'Opening hours', rights: 'All rights reserved.', top: 'Back to top' },
  },
};

type NavKey = 'about' | 'categories' | 'pricing' | 'contact';
const NAV: { id: string; key: NavKey }[] = [
  { id: 'about', key: 'about' },
  { id: 'categories', key: 'categories' },
  { id: 'pricing', key: 'pricing' },
  { id: 'contact', key: 'contact' },
];

/* =========================================================
   Helpers
   ========================================================= */
function go(id: string, after?: () => void) {
  return (e: MouseEvent) => {
    e.preventDefault();
    after?.();
    scrollToId(id, -96);
  };
}

const clock = (mins: number) => `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

/** Live open/closed line computed from SCHEDULE and the visitor's clock. */
function useOpenStatus(t: Content) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const day = (now.getDay() + 6) % 7;
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = SCHEDULE[day];
  if (today && mins >= today[0] && mins < today[1]) {
    return { open: true, text: t.status.open(clock(today[1])) };
  }
  if (today && mins < today[0]) {
    return { open: false, text: t.status.opensToday(clock(today[0])) };
  }
  for (let ahead = 1; ahead <= 7; ahead++) {
    const d = (day + ahead) % 7;
    const slot = SCHEDULE[d];
    if (slot) {
      const at = clock(slot[0]);
      return { open: false, text: ahead === 1 ? t.status.opensTomorrow(at) : t.status.opensOn(d, at) };
    }
  }
  return { open: false, text: '' };
}

function StatusLine({ t }: { t: Content }) {
  const status = useOpenStatus(t);
  return (
    <p className={`pk-status ${status.open ? 'is-open' : ''}`}>
      <span className="pk-status__dot" aria-hidden="true" />
      {status.text}
    </p>
  );
}

function Cloth({ className = '' }: { className?: string }) {
  return <div className={`pk-cloth ${className}`} />;
}

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="pk-lang" role="group" aria-label="Jazyk / Language">
      {LANGS.map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Button({ label, onClick, href, variant = 'solid' }: { label: string; onClick?: (e: MouseEvent) => void; href: string; variant?: 'solid' | 'ghost' }) {
  return (
    <a href={href} onClick={onClick} className={`pk-btn pk-btn--${variant}`}>
      <span>{label}</span>
      <span className="pk-btn__icon" aria-hidden="true">
        <PiArrowRightLight />
      </span>
    </a>
  );
}

function Socials({ label }: { label: string }) {
  const links = [
    { href: BAKERY.facebook, name: 'Facebook', Icon: PiFacebookLogoLight },
    { href: BAKERY.instagram, name: 'Instagram', Icon: PiInstagramLogoLight },
  ].filter((l) => l.href);
  if (!links.length) return null;
  return (
    <div className="pk-social" aria-label={label}>
      {links.map(({ href, name, Icon }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
          <Icon />
        </a>
      ))}
    </div>
  );
}

/* =========================================================
   Header
   ========================================================= */
function Header({ t, lang, setLang }: { t: Content; lang: Lang; setLang: (l: Lang) => void }) {
  const scrolled = useScrolledPast(20);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  useScrollLock(open);
  const close = () => setOpen(false);

  return (
    <>
      <header className={`pk-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="pk-header__pill">
          <a href="#top" className="pk-wordmark" onClick={go('top', close)}>
            Pekáreň
          </a>
          <nav className="pk-nav" aria-label="Hlavná navigácia">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={go(item.id)}>
                {t.nav[item.key]}
              </a>
            ))}
          </nav>
          <div className="pk-header__actions">
            <LangSwitch lang={lang} setLang={setLang} />
            <a href="#contact" className="pk-header__cta" onClick={go('contact', close)}>
              {t.cta}
            </a>
            <button
              type="button"
              className={`pk-burger ${open ? 'is-open' : ''}`}
              aria-label={open ? t.nav.close : t.nav.menu}
              aria-expanded={open}
              aria-controls="pk-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="pk-menu"
            className="pk-menu"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <nav className="pk-menu__nav" aria-label="Mobilná navigácia">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={go(item.id, close)}
                  initial={reduce ? false : { y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.08 + i * 0.06, ease: EASE_OUT }}
                >
                  {t.nav[item.key]}
                </motion.a>
              ))}
            </nav>
            <div className="pk-menu__foot">
              <StatusLine t={t} />
              <a href={BAKERY.phoneHref}>{BAKERY.phone}</a>
              <LangSwitch lang={lang} setLang={setLang} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================================
   Hero
   ========================================================= */
function Stamp({ text }: { text: string }) {
  return (
    <div className="pk-stamp" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="pk-stamp__ring">
        <defs>
          <path id="pk-stamp-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href="#pk-stamp-path" textLength="488">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="pk-stamp__center">
        <PiGrainsLight />
        <strong>1998</strong>
      </span>
    </div>
  );
}

function Hero({ t }: { t: Content }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const archY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const clothScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE_OUT },
        };

  return (
    <section className="pk-hero" id="top" ref={ref}>
      <div className="pk-wrap pk-hero__grid">
        <div className="pk-hero__copy">
          <motion.div {...rise(0)}>
            <StatusLine t={t} />
          </motion.div>
          <h1 className="pk-hero__title">
            {[t.hero.title[0], t.hero.title[1]].map((line, i) => (
              <span className="pk-hero__mask" key={i}>
                <motion.span
                  className="pk-hero__line"
                  initial={reduce ? false : { y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.12, ease: EASE_OUT }}
                >
                  {i === 0 ? (
                    line
                  ) : (
                    <>
                      {line && `${line} `}
                      <span className="is-accent">{t.hero.accent}</span>
                    </>
                  )}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="pk-hero__subtitle" {...rise(0.45)}>
            {t.hero.subtitle}
          </motion.p>
          <motion.div className="pk-hero__ctas" {...rise(0.55)}>
            <Button href="#categories" label={t.hero.ctaMenu} onClick={go('categories')} />
            <Button href="#contact" label={t.cta} onClick={go('contact')} variant="ghost" />
          </motion.div>
        </div>

        <div className="pk-hero__media">
          <motion.div
            className="pk-arch"
            initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 28px 28px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px 999px 28px 28px)' }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE_OUT }}
            style={reduce ? undefined : { y: archY }}
          >
            <div className="pk-arch__inner">
              <motion.div className="pk-arch__zoom" style={reduce ? undefined : { scale: clothScale }}>
                <Photo src={PHOTOS.hero} alt={`${t.hero.title.join(' ')} ${t.hero.accent}`} className="pk-arch__photo" fallback={<Cloth />} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="pk-hero__stamp"
            initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.9 }}
          >
            <Stamp text={t.hero.stamp} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Marquee
   ========================================================= */
function Marquee({ words }: { words: string[] }) {
  const row = (hidden: boolean) => (
    <div className="pk-marquee__row" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <span className="pk-marquee__item" key={w}>
          {w}
          <PiGrainsLight aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="pk-marquee">
      <div className="pk-marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* =========================================================
   About
   ========================================================= */
function About({ t }: { t: Content }) {
  return (
    <section className="pk-section pk-about" id="about">
      <div className="pk-wrap pk-about__grid">
        <Reveal className="pk-about__visual">
          <p className="pk-about__year" aria-hidden="true">
            1998
          </p>
          <div className="pk-about__frame">
            <Photo src={PHOTOS.about} alt={t.about.title} className="pk-about__photo" fallback={<Cloth className="pk-cloth--dots" />} />
          </div>
        </Reveal>

        <div className="pk-about__content">
          <Reveal>
            <h2 className="pk-h2">{t.about.title}</h2>
            <p className="pk-lead">{t.about.paragraph}</p>
          </Reveal>
          <ul className="pk-values">
            {t.about.values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal as="li" key={v.title} className="pk-value" delay={i * 0.08}>
                  <span className="pk-value__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Categories: expanding strips
   ========================================================= */
function Categories({ t }: { t: Content }) {
  const [active, setActive] = useState(0);

  return (
    <section className="pk-section pk-categories" id="categories">
      <div className="pk-wrap">
        <Reveal className="pk-categories__head">
          <h2 className="pk-h2">{t.categories.title}</h2>
          <p className="pk-lead">{t.categories.subtitle}</p>
        </Reveal>

        <Reveal className="pk-strips">
          {t.categories.items.map((item, i) => {
            const Icon = item.icon;
            const isActive = i === active;
            return (
              <article
                key={item.name}
                className={`pk-strip pk-strip--${i} ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                tabIndex={0}
              >
                <Photo
                  src={PHOTOS.categories[i]}
                  alt={item.name}
                  className="pk-strip__photo"
                  fallback={<Cloth className={i % 2 ? 'pk-cloth--dots' : ''} />}
                />
                <div className="pk-strip__body">
                  <span className="pk-strip__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   Pricing: menu board
   ========================================================= */
function Pricing({ t }: { t: Content }) {
  const [active, setActive] = useState(t.pricing.categories[0].id);
  const reduce = useReducedMotion();
  const category = t.pricing.categories.find((c) => c.id === active) ?? t.pricing.categories[0];

  return (
    <section className="pk-section pk-pricing" id="pricing">
      <div className="pk-wrap pk-pricing__grid">
        <Reveal className="pk-pricing__head">
          <h2 className="pk-h2">{t.pricing.title}</h2>
          <p className="pk-lead">{t.pricing.subtitle}</p>
          <p className="pk-pricing__note">{t.pricing.note}</p>
        </Reveal>

        <Reveal className="pk-board-shell" delay={0.1}>
          <div className="pk-board">
            <div className="pk-tabs" role="tablist" aria-label={t.pricing.title}>
              {t.pricing.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  id={`pk-tab-${c.id}`}
                  aria-selected={c.id === category.id}
                  aria-controls="pk-tabpanel"
                  onClick={() => setActive(c.id)}
                >
                  {c.id === category.id && (
                    <motion.span layoutId="pk-tab-pill" className="pk-tabs__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className="pk-tabs__label">{c.label}</span>
                </button>
              ))}
            </div>

            <div className="pk-menu-list" role="tabpanel" id="pk-tabpanel" aria-labelledby={`pk-tab-${category.id}`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={category.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  {category.items.map((item) => (
                    <li key={item.name} className="pk-menu-item">
                      <span className="pk-menu-item__name">{item.name}</span>
                      <span className="pk-menu-item__leader" aria-hidden="true" />
                      <span className="pk-menu-item__price">{item.price}</span>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   Testimonials: one voice at a time
   ========================================================= */
function Testimonials({ t }: { t: Content }) {
  const items = t.testimonials.items;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => window.clearTimeout(id);
  }, [index, paused, reduce, items.length]);

  const item = items[index];
  const initials = (name: string) =>
    name
      .split(/\s+/)
      .filter((w) => w.length > 1 && /^\p{L}/u.test(w))
      .slice(0, 2)
      .map((w) => w[0])
      .join('');

  return (
    <section
      className="pk-section pk-voices"
      aria-label={t.testimonials.title}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="pk-wrap pk-voices__grid">
        <Reveal className="pk-voices__head">
          <h2 className="pk-h2">{t.testimonials.title}</h2>
          <div className="pk-voices__people" role="group" aria-label={t.testimonials.title}>
            {items.map((it, i) => (
              <button key={it.author} type="button" aria-pressed={i === index} onClick={() => setIndex(i)} aria-label={it.author}>
                <span className="pk-voices__avatar">{initials(it.author)}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="pk-voices__stage" aria-live="polite">
          <PiQuotesFill className="pk-voices__mark" aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={item.author}
              initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduce ? undefined : { opacity: 0, y: -16, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.author}</strong>
                <span>{item.role}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Contact
   ========================================================= */
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

function Contact({ t }: { t: Content }) {
  const c = t.contact;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [opened, setOpened] = useState(false);
  const today = todayIndex();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const subject = String(data.get('subject') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const next: FieldErrors = {};
    if (!name) next.name = c.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = c.errEmail;
    if (!message) next.message = c.errMessage;
    setErrors(next);
    const firstError = Object.keys(next)[0];
    if (firstError) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    const body = [`${c.name}: ${name}`, `${c.email}: ${email}`, '', message].join('\n');
    window.location.href = `mailto:${BAKERY.email}?subject=${encodeURIComponent(subject || c.title)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const field = (key: 'name' | 'email' | 'subject' | 'message', label: string, type = 'text') => {
    const err = key !== 'subject' ? errors[key] : undefined;
    const id = `pk-${key}`;
    const props = {
      id,
      name: key,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${id}-err` : undefined,
      onInput: () => err && setErrors((prev) => ({ ...prev, [key]: undefined })),
    };
    return (
      <div className={`pk-field ${err ? 'has-error' : ''}`}>
        <label htmlFor={id}>
          {label}
          {key === 'subject' && <span className="pk-field__opt">{c.optional}</span>}
        </label>
        {key === 'message' ? (
          <textarea {...props} rows={5} />
        ) : (
          <input {...props} type={type} autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : 'off'} />
        )}
        {err && (
          <p className="pk-field__error" id={`${id}-err`}>
            <PiWarningCircleLight aria-hidden="true" />
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className="pk-section pk-contact" id="contact">
      <div className="pk-wrap">
        <Reveal className="pk-contact__head">
          <h2 className="pk-h2">{c.title}</h2>
          <p className="pk-lead">{c.subtitle}</p>
        </Reveal>

        <div className="pk-contact__grid">
          <Reveal className="pk-card-shell">
            <form className="pk-form" onSubmit={handleSubmit} noValidate>
              <div className="pk-form__row">
                {field('name', c.name)}
                {field('email', c.email, 'email')}
              </div>
              {field('subject', c.subject)}
              {field('message', c.message)}
              <button type="submit" className="pk-btn pk-btn--solid pk-btn--block">
                <span>{c.submit}</span>
                <span className="pk-btn__icon" aria-hidden="true">
                  <PiArrowRightLight />
                </span>
              </button>
              <p className="pk-form__note" role="status">
                {opened ? (
                  <>
                    {c.opened} <a href={`mailto:${BAKERY.email}`}>{BAKERY.email}</a>.
                  </>
                ) : (
                  c.note
                )}
              </p>
            </form>
          </Reveal>

          <Reveal className="pk-contact__aside" delay={0.1}>
            <div className="pk-hours">
              <h3 className="pk-h3">{c.hoursTitle}</h3>
              <StatusLine t={t} />
              <dl>
                {c.hours.map((row) => {
                  const isToday = row.days.includes(today);
                  return (
                    <div key={row.label} className={isToday ? 'is-today' : ''}>
                      <dt>
                        {row.label}
                        {isToday && <span className="pk-hours__today">{c.today}</span>}
                      </dt>
                      <dd>{row.time}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <h3 className="pk-h3">{c.infoTitle}</h3>
            <ul className="pk-info">
              <li>
                <PiMapPinLight aria-hidden="true" />
                <span>{c.address}</span>
              </li>
              <li>
                <PiPhoneLight aria-hidden="true" />
                <a href={BAKERY.phoneHref}>{BAKERY.phone}</a>
              </li>
              <li>
                <PiEnvelopeSimpleLight aria-hidden="true" />
                <a href={`mailto:${BAKERY.email}`}>{BAKERY.email}</a>
              </li>
            </ul>
            <Socials label={c.social} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Map
   ========================================================= */
function MapSection({ t }: { t: Content }) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${MAP.bbox}&layer=mapnik&marker=${MAP.lat},${MAP.lon}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${MAP.lat},${MAP.lon}`;

  return (
    <section className="pk-map" aria-label={t.map.title}>
      <div className="pk-wrap pk-map__inner">
        <Reveal className="pk-map__frame">
          <iframe title={t.map.title} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </Reveal>
        <Reveal className="pk-map__card" delay={0.15}>
          <PiMapPinLight className="pk-map__icon" aria-hidden="true" />
          <h2 className="pk-h3">{t.map.title}</h2>
          <p>{t.contact.address}</p>
          <a className="pk-link" href={directions} target="_blank" rel="noopener noreferrer">
            {t.map.directions}
            <PiArrowUpRightLight aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   Footer
   ========================================================= */
function Footer({ t, lang, setLang }: { t: Content; lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <footer className="pk-footer">
      <div className="pk-wrap">
        <div className="pk-footer__grid">
          <div className="pk-footer__brand">
            <p className="pk-footer__tagline">{t.footer.tagline}</p>
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
          <nav className="pk-footer__col" aria-label={t.footer.links}>
            <h4>{t.footer.links}</h4>
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={go(item.id)}>
                {t.nav[item.key]}
              </a>
            ))}
          </nav>
          <div className="pk-footer__col">
            <h4>{t.footer.contact}</h4>
            <span>{t.contact.address}</span>
            <a href={BAKERY.phoneHref}>{BAKERY.phone}</a>
            <a href={`mailto:${BAKERY.email}`}>{BAKERY.email}</a>
          </div>
          <div className="pk-footer__col">
            <h4>{t.footer.hours}</h4>
            {t.contact.hours.map((row) => (
              <span key={row.label}>
                {row.label} <b>{row.time}</b>
              </span>
            ))}
          </div>
        </div>
        <p className="pk-footer__word" aria-hidden="true">
          Pekáreň
        </p>
        <div className="pk-footer__bottom">
          <span>
            © {new Date().getFullYear()} {BAKERY.name}. {t.footer.rights}
          </span>
          <button type="button" onClick={scrollToTop}>
            {t.footer.top}
          </button>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   Page
   ========================================================= */
export default function Pekaren() {
  const [lang, setLang] = useStoredLang<Lang>('pekaren-lang', LANGS, 'sk');
  const t = content[lang];
  useSmoothScroll();
  useDocumentTitle(t.meta);

  return (
    <div className="pk">
      <a className="pk-skip" href="#obsah" onClick={go('obsah', () => document.getElementById('obsah')?.focus())}>
        {t.nav.skip}
      </a>
      <Header t={t} lang={lang} setLang={setLang} />
      <main id="obsah" tabIndex={-1}>
        <Hero t={t} />
        <Marquee words={t.marquee} />
        <About t={t} />
        <Categories t={t} />
        <Pricing t={t} />
        <Testimonials t={t} />
        <Contact t={t} />
        <MapSection t={t} />
      </main>
      <Footer t={t} lang={lang} setLang={setLang} />
    </div>
  );
}
