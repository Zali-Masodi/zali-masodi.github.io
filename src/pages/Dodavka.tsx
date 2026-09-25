import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  PiArrowRightBold,
  PiArrowUpRightBold,
  PiBroomBold,
  PiCouchBold,
  PiEnvelopeSimpleBold,
  PiFacebookLogoBold,
  PiInstagramLogoBold,
  PiMapPinBold,
  PiMinusBold,
  PiPackageBold,
  PiPhoneBold,
  PiPianoKeysBold,
  PiPlusBold,
  PiShieldCheckBold,
  PiStarFill,
  PiClockBold,
  PiToolboxBold,
  PiTrashBold,
  PiTruckFill,
  PiWarningCircleBold,
  PiWrenchBold,
} from 'react-icons/pi';
import '@fontsource-variable/archivo/wdth';
import '@fontsource-variable/geist-mono';
import { Photo, Reveal } from './shared/components';
import {
  EASE_OUT,
  scrollToId,
  scrollToTop,
  todayIndex,
  useDocumentTitle,
  useScrollLock,
  useSmoothScroll,
  useStoredLang,
} from './shared/kit';
import './Dodavka.css';

/* =========================================================
   Company details
   ========================================================= */
const COMPANY = {
  name: 'Moving Co.',
  email: 'info@movingcompany.sk',
  phone: '+421 910 555 123',
  phoneHref: 'tel:+421910555123',
  /* Fill in real profile URLs to show the icons; empty ones stay hidden. */
  facebook: '',
  instagram: '',
};

const MAP = { lat: 48.2181, lon: 17.4, bbox: '17.383,48.206,17.417,48.230' };

/* Estimator rates, straight from the price list below. */
const RATES = {
  size: [120, 220, 350],
  floor: 10,
  wardrobe: 25,
  km: 0.6,
};

/* Real photos: drop files into public/dodavka/ and fill in the paths,
   e.g. about: '/dodavka/tim.jpg'. Empty slots show the cardboard fallback. */
const PHOTOS: { about?: string; transport?: string } = {};

/* =========================================================
   Content
   ========================================================= */
type Lang = 'sk' | 'en';
const LANGS = ['sk', 'en'] as const;

interface Estimate {
  size: number;
  floors: number;
  wardrobes: number;
  km: number;
  total: number;
}

interface Content {
  meta: string;
  nav: { about: string; services: string; process: string; pricing: string; contact: string; menu: string; close: string; skip: string };
  cta: string;
  hero: { eyebrow: string; title: string; subtitle: string; secondary: string };
  calc: {
    title: string;
    hint: string;
    what: string;
    sizes: { name: string; sub: string }[];
    floors: string;
    wardrobes: string;
    km: string;
    less: string;
    more: string;
    from: string;
    send: string;
    summary: (e: Estimate) => string;
  };
  marquee: string[];
  about: { title: string; paragraph: string; labelTitle: string; values: { icon: IconType; title: string; text: string }[] };
  services: { title: string; subtitle: string; items: { icon: IconType; name: string; desc: string }[] };
  process: { title: string; steps: { title: string; text: string }[] };
  pricing: { title: string; subtitle: string; note: string; categories: { id: string; label: string; items: { name: string; price: string }[] }[] };
  testimonials: { title: string; items: { quote: string; author: string; role: string }[] };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    phone: string;
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
  footer: { tagline: string; links: string; contact: string; rights: string; top: string };
}

const content: Record<Lang, Content> = {
  sk: {
    meta: 'Moving Co. | Sťahovanie Senec a okolie',
    nav: { about: 'O nás', services: 'Služby', process: 'Postup', pricing: 'Cenník', contact: 'Kontakt', menu: 'Otvoriť menu', close: 'Zavrieť menu', skip: 'Preskočiť na obsah' },
    cta: 'Nezáväzná ponuka',
    hero: {
      eyebrow: 'Sťahovanie, Senec a okolie',
      title: 'Sťahovanie bez stresu.',
      subtitle: 'Od prvej škatule po poslednú skrutku. Byty, domy aj kancelárie, s montážou nábytku a odvozom odpadu.',
      secondary: 'Pozrieť služby',
    },
    calc: {
      title: 'Odhad ceny',
      hint: 'Podľa nášho cenníka. Presnú cenu potvrdíme po obhliadke.',
      what: 'Čo sťahujeme?',
      sizes: [
        { name: 'Malý byt', sub: '1-izbový' },
        { name: 'Väčší byt', sub: '3-izbový' },
        { name: 'Rodinný dom', sub: 'celý dom' },
      ],
      floors: 'Poschodia bez výťahu',
      wardrobes: 'Montáž skríň',
      km: 'Km mimo Senca',
      less: 'Menej',
      more: 'Viac',
      from: 'od',
      send: 'Chcem presnú ponuku',
      summary: (e) =>
        `Odhad z webu: ${['malý byt (1-izbový)', 'väčší byt (3-izbový)', 'rodinný dom'][e.size]}, ${e.floors} posch. bez výťahu, montáž ${e.wardrobes} skríň, ${e.km} km mimo Senca. Orientačne od ${e.total} €.\n\nTermín sťahovania: \nOdkiaľ a kam: `,
    },
    marquee: ['Byty', 'Domy', 'Kancelárie', 'Klavíry', 'Trezory', 'Biela technika', 'Stavebná suť', 'Pivnice a garáže'],
    about: {
      title: 'Jeden tím, jedna dodávka, žiadne prekvapenia',
      paragraph:
        'Sťahujeme domácnosti aj firmy v Senci a okolí Bratislavy. Každú zákazku si vopred obhliadneme alebo prekonzultujeme telefonicky, takže viete, koľko to bude stáť a koľko ľudí príde. Nábytok chránime a vieme ho rozobrať aj znova zložiť.',
      labelTitle: 'V každej zákazke',
      values: [
        { icon: PiToolboxBold, title: 'Vlastné vybavenie', text: 'Sťahovacie pásy, prikrývky, plošinové vozíky aj náradie na montáž máme vždy so sebou.' },
        { icon: PiShieldCheckBold, title: 'Poistená preprava', text: 'Každá zákazka je krytá poistením zodpovednosti za spôsobenú škodu.' },
        { icon: PiClockBold, title: 'Presné termíny', text: 'Dohodnutý čas dodržíme. Vieme, že si na sťahovanie berete voľno.' },
      ],
    },
    services: {
      title: 'Čo pre vás prevezieme',
      subtitle: 'Od jednej skrine po celý byt. Dodávky aj náradie na všetko, čo si sťahovanie vyžaduje, máme vlastné.',
      items: [
        { icon: PiCouchBold, name: 'Sťahovanie nábytku', desc: 'Byty, domy aj kancelárie. Vynesieme, odvezieme, dovezieme a uložíme na miesto.' },
        { icon: PiWrenchBold, name: 'Montáž nábytku', desc: 'Rozloženie a opätovné zloženie skríň, postelí aj kuchynských liniek priamo u vás.' },
        { icon: PiPianoKeysBold, name: 'Preprava veľkých predmetov', desc: 'Klavíry, trezory, biela technika a iné neskladné kusy, prevezené bezpečne.' },
        { icon: PiTrashBold, name: 'Odvoz odpadu a sute', desc: 'Starý nábytok, stavebnú suť aj objemný odpad odvezieme na zberný dvor.' },
        { icon: PiBroomBold, name: 'Vypratávanie priestorov', desc: 'Vyprázdnime byty, pivnice, garáže aj kancelárie pred sťahovaním či rekonštrukciou.' },
      ],
    },
    process: {
      title: 'Ako prebieha sťahovanie',
      steps: [
        { title: 'Zavoláte alebo napíšete', text: 'Poviete nám, čo, odkiaľ a kam treba presťahovať.' },
        { title: 'Obhliadka a cena', text: 'Prídeme sa pozrieť alebo to prejdeme po telefóne. Cenu viete vopred.' },
        { title: 'Balenie a nakládka', text: 'Nábytok zabalíme do prikrývok, rozoberieme a bezpečne naložíme.' },
        { title: 'Preprava a montáž', text: 'Dovezieme, vynesieme, zložíme a uložíme presne tam, kam chcete.' },
      ],
    },
    pricing: {
      title: 'Koľko to stojí',
      subtitle: 'Orientačný cenník. Presnú sumu určíme po obhliadke alebo telefonickom rozhovore.',
      note: 'Cenovú ponuku pošleme do 24 hodín, zadarmo a nezáväzne.',
      categories: [
        {
          id: 'moving',
          label: 'Sťahovanie',
          items: [
            { name: 'Malý byt (1-izbový)', price: 'od 120 €' },
            { name: 'Väčší byt (3-izbový)', price: 'od 220 €' },
            { name: 'Rodinný dom', price: 'od 350 €' },
            { name: 'Príplatok za poschodie bez výťahu', price: '10 € / podlažie' },
          ],
        },
        {
          id: 'assembly',
          label: 'Montáž',
          items: [
            { name: 'Skriňa / šatník', price: 'od 25 €' },
            { name: 'Kuchynská linka', price: 'od 60 €' },
            { name: 'Posteľ s roštom', price: 'od 20 €' },
            { name: 'Nábytok IKEA (kus)', price: 'od 15 €' },
          ],
        },
        {
          id: 'transport',
          label: 'Preprava',
          items: [
            { name: 'Klavír / pianíno', price: 'od 90 €' },
            { name: 'Trezor do 300 kg', price: 'od 80 €' },
            { name: 'Chladnička / práčka', price: 'od 30 €' },
            { name: 'Preprava mimo Senca', price: '0,60 € / km' },
          ],
        },
        {
          id: 'waste',
          label: 'Odvoz odpadu',
          items: [
            { name: 'Objemný odpad (1 m³)', price: 'od 20 €' },
            { name: 'Stavebná suť (1 m³)', price: 'od 25 €' },
            { name: 'Vypratanie pivnice / garáže', price: 'od 90 €' },
            { name: 'Poplatok za zberný dvor', price: 'podľa množstva' },
          ],
        },
      ],
    },
    testimonials: {
      title: 'Sťahovanie, na ktoré sa dá spoľahnúť',
      items: [
        { quote: 'Sťahovali sme 3-izbový byt aj s klavírom a všetko prebehlo rýchlo a bez jedinej škrabanca.', author: 'Lucia P.', role: 'Sťahovanie bytu, Senec' },
        { quote: 'Prišli presne na dohodnutý čas, rozobrali skrine, previezli ich a do hodiny znova zložili.', author: 'Marek Š.', role: 'Montáž a sťahovanie, Bratislava' },
        { quote: 'Suť z rekonštrukcie kúpeľne odviezli v ten istý deň, keď sme volali.', author: 'Zuzana a Ivan', role: 'Odvoz odpadu, Senec' },
      ],
    },
    contact: {
      title: 'Dohodnime si termín',
      subtitle: 'Napíšte nám, čo a kedy potrebujete presťahovať, a cenovú ponuku pošleme do 24 hodín.',
      name: 'Meno',
      email: 'E-mail',
      phone: 'Telefón',
      subject: 'Predmet',
      message: 'Čo sťahujeme?',
      optional: 'nepovinné',
      submit: 'Odoslať dopyt',
      note: 'Formulár otvorí váš e-mailový program s pripravenou správou. Nič neposielame za vás.',
      opened: 'Otvorili sme váš e-mailový program. Ak sa neotvoril, napíšte nám na',
      errName: 'Napíšte nám, ako vás oslovovať.',
      errEmail: 'Zadajte e-mail v tvare meno@domena.sk.',
      errMessage: 'Napíšte pár slov o sťahovaní.',
      infoTitle: 'Kontaktné údaje',
      address: 'Lichnerova 89, 903 01 Senec',
      hoursTitle: 'Otváracie hodiny',
      today: 'dnes',
      hours: [
        { days: [0, 1, 2, 3, 4], label: 'Pondelok-Piatok', time: '7:00-19:00' },
        { days: [5], label: 'Sobota', time: '8:00-14:00' },
        { days: [6], label: 'Nedeľa', time: 'Len po dohode' },
      ],
      social: 'Sledujte nás',
    },
    map: { title: 'Sídlime v Senci, jazdíme po celom kraji', directions: 'Navigovať v Google Maps' },
    footer: { tagline: 'Sťahovanie a preprava, na ktoré sa dá spoľahnúť.', links: 'Rýchle odkazy', contact: 'Kontakt', rights: 'Všetky práva vyhradené.', top: 'Späť hore' },
  },
  en: {
    meta: 'Moving Co. | Movers in Senec and around',
    nav: { about: 'About', services: 'Services', process: 'Process', pricing: 'Pricing', contact: 'Contact', menu: 'Open menu', close: 'Close menu', skip: 'Skip to content' },
    cta: 'Free quote',
    hero: {
      eyebrow: 'Movers, Senec and around',
      title: 'Stress-free moving.',
      subtitle: 'From the first box to the last screw. Flats, houses and offices, with furniture assembly and waste removal.',
      secondary: 'See services',
    },
    calc: {
      title: 'Price estimate',
      hint: 'Based on our price list. We confirm the exact price after a walkthrough.',
      what: 'What are we moving?',
      sizes: [
        { name: 'Small flat', sub: '1-bedroom' },
        { name: 'Larger flat', sub: '3-bedroom' },
        { name: 'Family house', sub: 'whole house' },
      ],
      floors: 'Floors without a lift',
      wardrobes: 'Wardrobes to assemble',
      km: 'Km outside Senec',
      less: 'Fewer',
      more: 'More',
      from: 'from',
      send: 'Get an exact quote',
      summary: (e) =>
        `Website estimate: ${['small flat (1-bedroom)', 'larger flat (3-bedroom)', 'family house'][e.size]}, ${e.floors} floors without a lift, ${e.wardrobes} wardrobes to assemble, ${e.km} km outside Senec. Roughly from €${e.total}.\n\nMoving date: \nFrom and to: `,
    },
    marquee: ['Flats', 'Houses', 'Offices', 'Pianos', 'Safes', 'Appliances', 'Building debris', 'Cellars and garages'],
    about: {
      title: 'One crew, one van, no surprises',
      paragraph:
        'We move homes and businesses in Senec and around Bratislava. Every job gets a walkthrough or a phone consultation first, so you know the cost and crew size upfront. We protect your furniture and can take it apart and rebuild it.',
      labelTitle: 'On every job',
      values: [
        { icon: PiToolboxBold, title: 'Our own gear', text: 'Moving straps, blankets, dollies and assembly tools always come with us.' },
        { icon: PiShieldCheckBold, title: 'Insured transport', text: 'Every job is covered by liability insurance for damages.' },
        { icon: PiClockBold, title: 'On time, every time', text: 'We keep the agreed slot. We know you took time off work for this.' },
      ],
    },
    services: {
      title: "What we'll haul for you",
      subtitle: 'From a single wardrobe to a whole flat. We own the vans and the tools for whatever the move needs.',
      items: [
        { icon: PiCouchBold, name: 'Furniture moving', desc: 'Flats, houses and offices. We carry it out, drive it over and set it in place.' },
        { icon: PiWrenchBold, name: 'Furniture assembly', desc: 'We take apart and rebuild wardrobes, beds and kitchen units right on site.' },
        { icon: PiPianoKeysBold, name: 'Large item transport', desc: 'Pianos, safes, appliances and other bulky pieces, moved safely.' },
        { icon: PiTrashBold, name: 'Waste and debris removal', desc: 'Old furniture, building debris and bulky waste taken to the disposal site.' },
        { icon: PiBroomBold, name: 'Clearing spaces', desc: 'We empty flats, cellars, garages and offices before a move or renovation.' },
      ],
    },
    process: {
      title: 'How a move works',
      steps: [
        { title: 'Call or write', text: 'Tell us what needs moving, from where and to where.' },
        { title: 'Walkthrough and price', text: 'We come over or go through it by phone. You know the price upfront.' },
        { title: 'Packing and loading', text: 'We wrap furniture in blankets, take it apart and load it safely.' },
        { title: 'Delivery and assembly', text: 'We drive it over, carry it in, rebuild it and put it exactly where you want.' },
      ],
    },
    pricing: {
      title: 'What it costs',
      subtitle: 'A guide price list. The exact quote follows a walkthrough or a phone call.',
      note: "We'll send your quote within 24 hours, free and with no obligation.",
      categories: [
        {
          id: 'moving',
          label: 'Moving',
          items: [
            { name: 'Small flat (1-bedroom)', price: 'from €120' },
            { name: 'Larger flat (3-bedroom)', price: 'from €220' },
            { name: 'Family house', price: 'from €350' },
            { name: 'No-lift surcharge', price: '€10 / floor' },
          ],
        },
        {
          id: 'assembly',
          label: 'Assembly',
          items: [
            { name: 'Wardrobe / closet', price: 'from €25' },
            { name: 'Kitchen unit', price: 'from €60' },
            { name: 'Bed with frame', price: 'from €20' },
            { name: 'IKEA furniture (each)', price: 'from €15' },
          ],
        },
        {
          id: 'transport',
          label: 'Transport',
          items: [
            { name: 'Piano', price: 'from €90' },
            { name: 'Safe up to 300 kg', price: 'from €80' },
            { name: 'Fridge / washing machine', price: 'from €30' },
            { name: 'Transport outside Senec', price: '€0.60 / km' },
          ],
        },
        {
          id: 'waste',
          label: 'Waste removal',
          items: [
            { name: 'Bulky waste (1 m³)', price: 'from €20' },
            { name: 'Building debris (1 m³)', price: 'from €25' },
            { name: 'Cellar / garage clearance', price: 'from €90' },
            { name: 'Disposal site fee', price: 'by volume' },
          ],
        },
      ],
    },
    testimonials: {
      title: 'Moving you can count on',
      items: [
        { quote: 'We moved a 3-bedroom flat, piano included, and everything went fast without a single scratch.', author: 'Lucia P.', role: 'Flat move, Senec' },
        { quote: 'They showed up right on time, took the wardrobes apart, moved them and rebuilt everything within the hour.', author: 'Marek Š.', role: 'Assembly and move, Bratislava' },
        { quote: 'They hauled away our bathroom renovation debris the same day we called.', author: 'Zuzana & Ivan', role: 'Waste removal, Senec' },
      ],
    },
    contact: {
      title: "Let's book your date",
      subtitle: "Tell us what and when you need moved, and we'll send a quote within 24 hours.",
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'What are we moving?',
      optional: 'optional',
      submit: 'Send request',
      note: 'The form opens your own email app with the message ready. We never send anything for you.',
      opened: "We've opened your email app. If nothing happened, write to us at",
      errName: 'Tell us what to call you.',
      errEmail: 'Enter an email like name@domain.com.',
      errMessage: 'Add a few words about the move.',
      infoTitle: 'Contact details',
      address: 'Lichnerova 89, 903 01 Senec, Slovakia',
      hoursTitle: 'Opening hours',
      today: 'today',
      hours: [
        { days: [0, 1, 2, 3, 4], label: 'Monday-Friday', time: '7:00-19:00' },
        { days: [5], label: 'Saturday', time: '8:00-14:00' },
        { days: [6], label: 'Sunday', time: 'By arrangement' },
      ],
      social: 'Follow us',
    },
    map: { title: 'Based in Senec, on the road across the region', directions: 'Directions in Google Maps' },
    footer: { tagline: 'Moving and transport you can rely on.', links: 'Quick links', contact: 'Contact', rights: 'All rights reserved.', top: 'Back to top' },
  },
};

type NavKey = 'about' | 'services' | 'process' | 'pricing' | 'contact';
const NAV: { id: string; key: NavKey }[] = [
  { id: 'about', key: 'about' },
  { id: 'services', key: 'services' },
  { id: 'process', key: 'process' },
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
    scrollToId(id, -88);
  };
}

function Kraft({ icon: Icon = PiPackageBold }: { icon?: IconType }) {
  return (
    <div className="dv-kraft">
      <span className="dv-kraft__tape" />
      <Icon className="dv-kraft__stamp" aria-hidden="true" />
    </div>
  );
}

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="dv-lang" role="group" aria-label="Jazyk / Language">
      {LANGS.map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Button({ label, onClick, href, variant = 'solid' }: { label: string; onClick?: (e: MouseEvent) => void; href: string; variant?: 'solid' | 'ghost' | 'ink' }) {
  return (
    <a href={href} onClick={onClick} className={`dv-btn dv-btn--${variant}`}>
      <span>{label}</span>
      <span className="dv-btn__icon" aria-hidden="true">
        <PiArrowRightBold />
      </span>
    </a>
  );
}

function Logo() {
  return (
    <span className="dv-logo">
      <span className="dv-logo__mark" aria-hidden="true">
        <PiTruckFill />
      </span>
      <span className="dv-logo__text">
        Moving Co.
        <small>Senec</small>
      </span>
    </span>
  );
}

/* =========================================================
   Header: hides while scrolling down, returns on scroll up
   ========================================================= */
function Header({ t, lang, setLang }: { t: Content; lang: Lang; setLang: (l: Lang) => void }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [raised, setRaised] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  useScrollLock(open);
  const close = () => setOpen(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setRaised(y > 12);
    if (y < 160) setHidden(false);
    else if (y - prev > 6) setHidden(true);
    else if (prev - y > 6) setHidden(false);
  });

  return (
    <>
      <header className={`dv-header ${raised ? 'is-raised' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <div className="dv-wrap dv-header__bar">
          <a href="#top" className="dv-header__brand" onClick={go('top', close)} aria-label="Moving Co. Senec">
            <Logo />
          </a>
          <nav className="dv-nav" aria-label="Hlavná navigácia">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={go(item.id)}>
                {t.nav[item.key]}
              </a>
            ))}
          </nav>
          <div className="dv-header__actions">
            <LangSwitch lang={lang} setLang={setLang} />
            <a href={COMPANY.phoneHref} className="dv-header__phone">
              <PiPhoneBold aria-hidden="true" />
              <span>{COMPANY.phone}</span>
            </a>
            <button
              type="button"
              className={`dv-burger ${open ? 'is-open' : ''}`}
              aria-label={open ? t.nav.close : t.nav.menu}
              aria-expanded={open}
              aria-controls="dv-menu"
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
            id="dv-menu"
            className="dv-menu"
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : { y: '-100%' }}
            animate={reduce ? { opacity: 1 } : { y: '0%' }}
            exit={reduce ? { opacity: 0 } : { y: '-100%' }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <nav className="dv-menu__nav" aria-label="Mobilná navigácia">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={go(item.id, close)}
                  initial={reduce ? false : { x: -32, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.05, ease: EASE_OUT }}
                >
                  {t.nav[item.key]}
                  <PiArrowRightBold aria-hidden="true" />
                </motion.a>
              ))}
            </nav>
            <div className="dv-menu__foot">
              <a href={COMPANY.phoneHref}>
                <PiPhoneBold aria-hidden="true" /> {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`}>
                <PiEnvelopeSimpleBold aria-hidden="true" /> {COMPANY.email}
              </a>
              <LangSwitch lang={lang} setLang={setLang} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================================
   Price estimator
   ========================================================= */
function Stepper({ label, value, setValue, min = 0, max = 10, less, more }: { label: string; value: number; setValue: (n: number) => void; min?: number; max?: number; less: string; more: string }) {
  return (
    <div className="dv-stepper">
      <span className="dv-stepper__label">{label}</span>
      <div className="dv-stepper__ctrl">
        <button type="button" onClick={() => setValue(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label}: ${less}`}>
          <PiMinusBold />
        </button>
        <output aria-live="polite">{value}</output>
        <button type="button" onClick={() => setValue(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}: ${more}`}>
          <PiPlusBold />
        </button>
      </div>
    </div>
  );
}

function Estimator({ t, onSend }: { t: Content; onSend: (summary: string) => void }) {
  const [size, setSize] = useState(1);
  const [floors, setFloors] = useState(0);
  const [wardrobes, setWardrobes] = useState(0);
  const [km, setKm] = useState(0);
  const reduce = useReducedMotion();

  const total = Math.round(RATES.size[size] + floors * RATES.floor + wardrobes * RATES.wardrobe + km * RATES.km);
  const spring = useSpring(total, { stiffness: 140, damping: 22 });
  const shown = useTransform(spring, (v) => Math.round(v));
  useEffect(() => {
    if (reduce) spring.jump(total);
    else spring.set(total);
  }, [total, spring, reduce]);

  const c = t.calc;

  return (
    <div className="dv-calc">
      <div className="dv-calc__head">
        <h2 className="dv-calc__title">{c.title}</h2>
        <p className="dv-calc__hint">{c.hint}</p>
      </div>

      <fieldset className="dv-calc__sizes">
        <legend>{c.what}</legend>
        <div className="dv-calc__options">
          {c.sizes.map((s, i) => (
            <label key={s.name} className={i === size ? 'is-active' : ''}>
              <input type="radio" name="dv-size" checked={i === size} onChange={() => setSize(i)} />
              <strong>{s.name}</strong>
              <span>{s.sub}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="dv-calc__steppers">
        <Stepper label={c.floors} value={floors} setValue={setFloors} less={c.less} more={c.more} />
        <Stepper label={c.wardrobes} value={wardrobes} setValue={setWardrobes} less={c.less} more={c.more} />
      </div>

      <div className="dv-calc__range">
        <label htmlFor="dv-km">
          {c.km}
          <output htmlFor="dv-km">{km} km</output>
        </label>
        <input
          id="dv-km"
          type="range"
          min={0}
          max={200}
          step={5}
          value={km}
          onChange={(e) => setKm(Number(e.target.value))}
          style={{ '--fill': `${(km / 200) * 100}%` } as CSSProperties}
        />
      </div>

      <div className="dv-calc__total">
        <p>
          <span className="dv-calc__from">{c.from}</span>
          <motion.span className="dv-calc__num">{shown}</motion.span>
          <span className="dv-calc__cur">€</span>
        </p>
        <button type="button" className="dv-btn dv-btn--solid" onClick={() => onSend(c.summary({ size, floors, wardrobes, km, total }))}>
          <span>{c.send}</span>
          <span className="dv-btn__icon" aria-hidden="true">
            <PiArrowRightBold />
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   Hero
   ========================================================= */
function Hero({ t, onSend }: { t: Content; onSend: (summary: string) => void }) {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE_OUT },
        };

  return (
    <section className="dv-hero" id="top">
      <div className="dv-wrap dv-hero__grid">
        <div className="dv-hero__copy">
          <motion.p className="dv-eyebrow" {...rise(0)}>
            {t.hero.eyebrow}
          </motion.p>
          <h1 className="dv-hero__title">
            {t.hero.title.split(' ').map((word, i, words) => (
              <Fragment key={`${word}-${i}`}>
                <span className="dv-hero__mask">
                  <motion.span
                    className="dv-hero__word"
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1, delay: 0.08 + i * 0.07, ease: EASE_OUT }}
                  >
                    {word}
                  </motion.span>
                </span>
                {i < words.length - 1 && ' '}
              </Fragment>
            ))}
          </h1>
          <motion.p className="dv-hero__subtitle" {...rise(0.4)}>
            {t.hero.subtitle}
          </motion.p>
          <motion.div className="dv-hero__ctas" {...rise(0.5)}>
            <Button href="#contact" label={t.cta} onClick={go('contact')} />
            <Button href="#services" label={t.hero.secondary} onClick={go('services')} variant="ghost" />
          </motion.div>
        </div>

        <motion.div
          className="dv-hero__calc"
          initial={reduce ? false : { opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.35 }}
        >
          <Estimator t={t} onSend={onSend} />
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   Marquee
   ========================================================= */
function Marquee({ words }: { words: string[] }) {
  const row = (hidden: boolean) => (
    <div className="dv-marquee__row" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <span className="dv-marquee__item" key={w}>
          {w}
          <PiPackageBold aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="dv-marquee">
      <div className="dv-marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* =========================================================
   About: statement + shipping label
   ========================================================= */
function About({ t }: { t: Content }) {
  return (
    <section className="dv-section dv-about" id="about">
      <div className="dv-wrap">
        <Reveal>
          <h2 className="dv-statement">{t.about.title}</h2>
        </Reveal>
        <div className="dv-about__grid">
          <Reveal className="dv-about__media">
            <Photo src={PHOTOS.about} alt={t.about.title} className="dv-about__photo" fallback={<Kraft />} />
          </Reveal>
          <div className="dv-about__copy">
            <Reveal>
              <p className="dv-lead">{t.about.paragraph}</p>
            </Reveal>
            <Reveal className="dv-label" delay={0.1}>
              <div className="dv-label__top" aria-hidden="true">
                <span>SENEC</span>
                <span className="dv-label__bars" />
              </div>
              <h3 className="dv-label__title">{t.about.labelTitle}</h3>
              <ul>
                {t.about.values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <li key={v.title}>
                      <span className="dv-label__icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <div>
                        <strong>{v.title}</strong>
                        <p>{v.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Services: bento
   ========================================================= */
function Services({ t }: { t: Content }) {
  return (
    <section className="dv-section dv-services" id="services">
      <div className="dv-wrap">
        <Reveal className="dv-head">
          <h2 className="dv-h2">{t.services.title}</h2>
          <p className="dv-lead">{t.services.subtitle}</p>
        </Reveal>
        <div className="dv-bento">
          {t.services.items.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="article" key={s.name} className={`dv-cell dv-cell--${i}`} delay={i * 0.06}>
                {i === 2 && <Photo src={PHOTOS.transport} alt={s.name} className="dv-cell__photo" fallback={<Kraft icon={PiPianoKeysBold} />} />}
                <span className="dv-cell__icon" aria-hidden="true">
                  <Icon />
                </span>
                <div className="dv-cell__body">
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Process: the van drives the route as you scroll
   ========================================================= */
function Process({ t }: { t: Content }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  // The van rides a full-size track, so a 0-100% translate spans the road
  const along = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <section className="dv-section dv-process" id="process">
      <div className="dv-wrap">
        <Reveal>
          <h2 className="dv-h2">{t.process.title}</h2>
        </Reveal>
        <div className="dv-route" ref={ref}>
          <div className="dv-route__road" aria-hidden="true">
            <motion.span className="dv-route__done dv-route__done--x" style={reduce ? { scaleX: 1 } : { scaleX: progress }} />
            <motion.span className="dv-route__done dv-route__done--y" style={reduce ? { scaleY: 1 } : { scaleY: progress }} />
            <motion.span className="dv-route__track dv-route__track--x" style={{ x: reduce ? '100%' : along }}>
              <span className="dv-route__van">
                <PiTruckFill />
              </span>
            </motion.span>
            <motion.span className="dv-route__track dv-route__track--y" style={{ y: reduce ? '100%' : along }}>
              <span className="dv-route__van">
                <PiTruckFill />
              </span>
            </motion.span>
          </div>
          <ol className="dv-route__stops">
            {t.process.steps.map((step, i) => (
              <Reveal as="li" key={step.title} className="dv-stop" delay={i * 0.08}>
                <span className="dv-stop__pin" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Pricing
   ========================================================= */
function Pricing({ t }: { t: Content }) {
  const [active, setActive] = useState(t.pricing.categories[0].id);
  const reduce = useReducedMotion();
  const category = t.pricing.categories.find((c) => c.id === active) ?? t.pricing.categories[0];

  return (
    <section className="dv-section dv-pricing" id="pricing">
      <div className="dv-wrap">
        <Reveal className="dv-head">
          <h2 className="dv-h2">{t.pricing.title}</h2>
          <p className="dv-lead">{t.pricing.subtitle}</p>
        </Reveal>

        <Reveal>
          <div className="dv-tabs" role="tablist" aria-label={t.pricing.title}>
            {t.pricing.categories.map((c) => (
              <button key={c.id} type="button" role="tab" id={`dv-tab-${c.id}`} aria-selected={c.id === category.id} aria-controls="dv-tabpanel" onClick={() => setActive(c.id)}>
                {c.label}
                {c.id === category.id && <motion.span layoutId="dv-tab-bar" className="dv-tabs__bar" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              </button>
            ))}
          </div>
        </Reveal>

        <div role="tabpanel" id="dv-tabpanel" aria-labelledby={`dv-tab-${category.id}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={category.id}
              className="dv-prices"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              {category.items.map((item) => (
                <li key={item.name} className="dv-price">
                  <span className="dv-price__name">{item.name}</span>
                  <span className="dv-price__value">{item.price}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <Reveal className="dv-pricing__foot">
          <p>{t.pricing.note}</p>
          <Button href="#contact" label={t.cta} onClick={go('contact')} variant="ink" />
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   Testimonials: delivery slips
   ========================================================= */
function Testimonials({ t }: { t: Content }) {
  return (
    <section className="dv-section dv-reviews" aria-label={t.testimonials.title}>
      <div className="dv-wrap">
        <Reveal className="dv-head">
          <h2 className="dv-h2">{t.testimonials.title}</h2>
        </Reveal>
        <div className="dv-slips">
          {t.testimonials.items.map((item, i) => (
            <Reveal as="figure" key={item.author} className={`dv-slip dv-slip--${i}`} delay={i * 0.1} y={40}>
              <div className="dv-slip__stars" aria-label="5/5">
                {Array.from({ length: 5 }, (_, s) => (
                  <PiStarFill key={s} aria-hidden="true" />
                ))}
              </div>
              <blockquote>“{item.quote}”</blockquote>
              <figcaption>
                <strong>{item.author}</strong>
                <span>{item.role}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Contact
   ========================================================= */
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

function Contact({ t, message, setMessage }: { t: Content; message: string; setMessage: (m: string) => void }) {
  const c = t.contact;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [opened, setOpened] = useState(false);
  const today = todayIndex();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const subject = String(data.get('subject') ?? '').trim();
    const text = message.trim();

    const next: FieldErrors = {};
    if (!name) next.name = c.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = c.errEmail;
    if (text.length < 5) next.message = c.errMessage;
    setErrors(next);
    const firstError = Object.keys(next)[0];
    if (firstError) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    const lines = [`${c.name}: ${name}`, `${c.email}: ${email}`];
    if (phone) lines.push(`${c.phone}: ${phone}`);
    const body = [...lines, '', text].join('\n');
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject || c.title)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const clearError = (key: keyof FieldErrors) => () => errors[key] && setErrors((prev) => ({ ...prev, [key]: undefined }));

  const errorText = (key: keyof FieldErrors) =>
    errors[key] && (
      <p className="dv-field__error" id={`dv-${key}-err`}>
        <PiWarningCircleBold aria-hidden="true" />
        {errors[key]}
      </p>
    );

  const invalid = (key: keyof FieldErrors) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `dv-${key}-err` : undefined,
  });

  const socials = [
    { href: COMPANY.facebook, name: 'Facebook', Icon: PiFacebookLogoBold },
    { href: COMPANY.instagram, name: 'Instagram', Icon: PiInstagramLogoBold },
  ].filter((s) => s.href);

  return (
    <section className="dv-section dv-contact" id="contact">
      <div className="dv-wrap">
        <Reveal className="dv-head">
          <h2 className="dv-h2">{c.title}</h2>
          <p className="dv-lead">{c.subtitle}</p>
        </Reveal>

        <div className="dv-contact__grid">
          <Reveal className="dv-shell">
            <form className="dv-form" onSubmit={handleSubmit} noValidate>
              <div className="dv-form__row">
                <div className={`dv-field ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="dv-name">{c.name}</label>
                  <input id="dv-name" name="name" autoComplete="name" onInput={clearError('name')} {...invalid('name')} />
                  {errorText('name')}
                </div>
                <div className="dv-field">
                  <label htmlFor="dv-phone">
                    {c.phone}
                    <span className="dv-field__opt">{c.optional}</span>
                  </label>
                  <input id="dv-phone" name="phone" type="tel" autoComplete="tel" />
                </div>
              </div>
              <div className="dv-form__row">
                <div className={`dv-field ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="dv-email">{c.email}</label>
                  <input id="dv-email" name="email" type="email" autoComplete="email" onInput={clearError('email')} {...invalid('email')} />
                  {errorText('email')}
                </div>
                <div className="dv-field">
                  <label htmlFor="dv-subject">
                    {c.subject}
                    <span className="dv-field__opt">{c.optional}</span>
                  </label>
                  <input id="dv-subject" name="subject" />
                </div>
              </div>
              <div className={`dv-field ${errors.message ? 'has-error' : ''}`}>
                <label htmlFor="dv-message">{c.message}</label>
                <textarea
                  id="dv-message"
                  name="message"
                  rows={6}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearError('message')();
                  }}
                  {...invalid('message')}
                />
                {errorText('message')}
              </div>
              <button type="submit" className="dv-btn dv-btn--solid dv-btn--block">
                <span>{c.submit}</span>
                <span className="dv-btn__icon" aria-hidden="true">
                  <PiArrowRightBold />
                </span>
              </button>
              <p className="dv-form__note" role="status">
                {opened ? (
                  <>
                    {c.opened} <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                  </>
                ) : (
                  c.note
                )}
              </p>
            </form>
          </Reveal>

          <Reveal className="dv-contact__aside" delay={0.1}>
            <h3 className="dv-h3">{c.infoTitle}</h3>
            <ul className="dv-info">
              <li>
                <PiMapPinBold aria-hidden="true" />
                <span>{c.address}</span>
              </li>
              <li>
                <PiPhoneBold aria-hidden="true" />
                <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
              </li>
              <li>
                <PiEnvelopeSimpleBold aria-hidden="true" />
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
            </ul>

            <h3 className="dv-h3">{c.hoursTitle}</h3>
            <dl className="dv-hours">
              {c.hours.map((row) => {
                const isToday = row.days.includes(today);
                return (
                  <div key={row.label} className={isToday ? 'is-today' : ''}>
                    <dt>
                      {row.label}
                      {isToday && <span className="dv-hours__today">{c.today}</span>}
                    </dt>
                    <dd>{row.time}</dd>
                  </div>
                );
              })}
            </dl>

            {socials.length > 0 && (
              <div className="dv-social" aria-label={c.social}>
                {socials.map(({ href, name, Icon }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
                    <Icon />
                  </a>
                ))}
              </div>
            )}
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
    <section className="dv-map" aria-label={t.map.title}>
      <div className="dv-wrap dv-map__grid">
        <Reveal className="dv-map__copy">
          <h2 className="dv-h3 dv-map__title">{t.map.title}</h2>
          <p>{t.contact.address}</p>
          <a className="dv-link" href={directions} target="_blank" rel="noopener noreferrer">
            {t.map.directions}
            <PiArrowUpRightBold aria-hidden="true" />
          </a>
        </Reveal>
        <Reveal className="dv-map__frame" delay={0.1}>
          <iframe title={t.map.title} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
    <footer className="dv-footer">
      <div className="dv-wrap">
        <div className="dv-footer__grid">
          <div>
            <Logo />
            <p className="dv-footer__tagline">{t.footer.tagline}</p>
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
          <nav className="dv-footer__col" aria-label={t.footer.links}>
            <h4>{t.footer.links}</h4>
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={go(item.id)}>
                {t.nav[item.key]}
              </a>
            ))}
          </nav>
          <div className="dv-footer__col">
            <h4>{t.footer.contact}</h4>
            <span>{t.contact.address}</span>
            <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </div>
        </div>
      </div>
      <p className="dv-footer__word" aria-hidden="true">
        Moving <span>Co.</span>
      </p>
      <div className="dv-wrap dv-footer__bottom">
        <span>
          © {new Date().getFullYear()} {COMPANY.name} {t.footer.rights}
        </span>
        <button type="button" onClick={scrollToTop}>
          {t.footer.top}
        </button>
      </div>
    </footer>
  );
}

/* =========================================================
   Page
   ========================================================= */
export default function MovingCompany() {
  const [lang, setLang] = useStoredLang<Lang>('dodavka-lang', LANGS, 'sk');
  const t = content[lang];
  const [message, setMessage] = useState('');
  useSmoothScroll();
  useDocumentTitle(t.meta);

  const sendEstimate = (summary: string) => {
    setMessage(summary);
    scrollToId('contact', -88);
    window.setTimeout(() => document.getElementById('dv-name')?.focus({ preventScroll: true }), 1400);
  };

  return (
    <div className="dv">
      <a className="dv-skip" href="#obsah" onClick={go('obsah', () => document.getElementById('obsah')?.focus())}>
        {t.nav.skip}
      </a>
      <Header t={t} lang={lang} setLang={setLang} />
      <main id="obsah" tabIndex={-1}>
        <Hero t={t} onSend={sendEstimate} />
        <Marquee words={t.marquee} />
        <About t={t} />
        <Services t={t} />
        <Process t={t} />
        <Pricing t={t} />
        <Testimonials t={t} />
        <Contact t={t} message={message} setMessage={setMessage} />
        <MapSection t={t} />
      </main>
      <Footer t={t} lang={lang} setLang={setLang} />
    </div>
  );
}
