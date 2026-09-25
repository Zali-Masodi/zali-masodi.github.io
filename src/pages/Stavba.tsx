import { useRef, useState, type FormEvent, type ChangeEvent, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  PiArrowRightBold,
  PiArrowUpBold,
  PiArrowsLeftRightBold,
  PiAsteriskBold,
  PiBathtubBold,
  PiBuildingsBold,
  PiCaretDownBold,
  PiCookingPotBold,
  PiClockBold,
  PiEnvelopeSimpleBold,
  PiFacebookLogoBold,
  PiHouseBold,
  PiInstagramLogoBold,
  PiLightningBold,
  PiMapPinBold,
  PiPaintRollerBold,
  PiPhoneBold,
  PiPipeBold,
  PiStackBold,
  PiStarFill,
  PiWarningCircleBold,
} from 'react-icons/pi';
import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import { Counter, Photo, Reveal } from './shared/components';
import {
  EASE_OUT,
  scrollToId,
  scrollToTop,
  useDocumentTitle,
  useScrollLock,
  useScrolledPast,
  useSmoothScroll,
  useStoredLang,
} from './shared/kit';
import './Stavba.css';

/* =========================================================
   Company details
   ========================================================= */
const COMPANY = {
  name: 'PrerobTo',
  suffix: 'Rekonštrukcie',
  phone: '+421 903 827 652',
  phoneHref: 'tel:+421903827652',
  email: 'milanvorzak59@gmail.com',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  address: 'Ambroseho 6, 851 02 Bratislava-Petržalka',
  mapEmbedSrc: 'https://www.google.com/maps?q=Ambroseho+6,+851+02+Bratislava&output=embed',
};

/* Real photos: drop files into public/stavba/ and fill in the paths,
   e.g. hero: '/stavba/hero.jpg'. Empty slots show the designed fallback. */
const PHOTOS: {
  hero?: string;
  before?: string;
  after?: string;
  gallery: (string | undefined)[];
} = {
  gallery: [],
};

const GALLERY_COUNT = 16;
const GALLERY_INITIAL = 10;
/* Bento spans, chosen so both 10 and 16 tiles close the grid without holes. */
const GALLERY_SPAN: Record<number, string> = { 0: 'is-big', 3: 'is-tall', 4: 'is-wide', 7: 'is-wide', 10: 'is-wide', 14: 'is-wide' };
const GALLERY_TEXTURES = ['tx-concrete', 'tx-tile', 'tx-wood', 'tx-plaster'];

/* =========================================================
   Content (SK primary, EN second)
   ========================================================= */
type Lang = 'sk' | 'en';
const LANGS = ['sk', 'en'] as const;

interface Content {
  meta: string;
  nav: { services: string; process: string; gallery: string; reviews: string; contact: string; menu: string; close: string; skip: string };
  cta: string;
  hero: { eyebrow: string; line1: string; line2: string; subtitle: string; secondary: string };
  proof: { value: number; unit: string; label: string; text: string }[];
  services: { title: string; subtitle: string; items: { icon: IconType; title: string; text: string }[] };
  marquee: string[];
  process: { title: string; steps: { title: string; text: string }[] };
  gallery: { title: string; subtitle: string; more: string; less: string; labels: string[] };
  reviews: {
    eyebrow: string;
    title: string;
    subtitle: string;
    before: string;
    after: string;
    compare: string;
    items: { name: string; location: string; text: string }[];
  };
  banner: { title: string; subtitle: string };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    formTitle: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    phName: string;
    phEmail: string;
    phPhone: string;
    phMessage: string;
    optional: string;
    submit: string;
    note: string;
    opened: string;
    errName: string;
    errEmail: string;
    errMessage: string;
    subject: string;
    infoTitle: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    hoursLabel: string;
    hours: string;
    mapTitle: string;
  };
  footer: { tagline: string; navTitle: string; contactTitle: string; rights: string; top: string };
}

const content: Record<Lang, Content> = {
  sk: {
    meta: 'PrerobTo Rekonštrukcie | Rekonštrukcie bytov a domov, Bratislava',
    nav: { services: 'Služby', process: 'Postup', gallery: 'Galéria', reviews: 'Recenzie', contact: 'Kontakt', menu: 'Otvoriť menu', close: 'Zavrieť menu', skip: 'Preskočiť na obsah' },
    cta: 'Nezáväzná ponuka',
    hero: {
      eyebrow: 'Rekonštrukcie a stavebné práce, Bratislava',
      line1: 'Prerobíme to.',
      line2: 'Poriadne.',
      subtitle: 'Kompletné rekonštrukcie bytov, domov a prevádzok. Od búračky po posledný náter: jeden tím, jedna zodpovednosť.',
      secondary: 'Pozrieť realizácie',
    },
    proof: [
      { value: 15, unit: '+', label: 'rokov na stavbách', text: 'Stovky dokončených rekonštrukcií bytov, domov a prevádzok po celom Slovensku.' },
      { value: 0, unit: '', label: 'náhodných subdodávateľov', text: 'Murári, elektrikári aj obkladači sú naši vlastní ľudia.' },
      { value: 5, unit: ' rokov', label: 'písomnej záruky', text: 'Na všetky vykonané práce. Dohodnuté termíny dodržiavame.' },
    ],
    services: {
      title: 'Naše služby',
      subtitle: 'Od čiastkových prác až po kompletnú rekonštrukciu na kľúč. Vyberte si, čo potrebujete.',
      items: [
        { icon: PiHouseBold, title: 'Rekonštrukcie bytov', text: 'Kompletná premena bytového jadra, podláh, priečok aj rozvodov.' },
        { icon: PiBuildingsBold, title: 'Rekonštrukcie domov', text: 'Od základov po strechu. Obnova rodinných domov na kľúč.' },
        { icon: PiBathtubBold, title: 'Kúpeľne na mieru', text: 'Návrh, obklady, sanita aj podlahové kúrenie v jednom balíku.' },
        { icon: PiCookingPotBold, title: 'Kuchynské linky', text: 'Realizácia kuchyne vrátane rozvodov vody, plynu a elektriny.' },
        { icon: PiStackBold, title: 'Zatepľovanie a fasády', text: 'Zatepľovacie systémy, omietky a fasádne nátery s dlhou životnosťou.' },
        { icon: PiPaintRollerBold, title: 'Maliarske a stierkové práce', text: 'Vyrovnávanie stien, stierky, maľby interiérov aj exteriérov.' },
        { icon: PiLightningBold, title: 'Elektroinštalácie', text: 'Nové rozvody, revízie a modernizácia elektrickej siete.' },
        { icon: PiPipeBold, title: 'Vodoinštalácie a kúrenie', text: 'Rozvody vody, kanalizácie a vykurovacích systémov.' },
      ],
    },
    marquee: ['Kúpeľne', 'Kuchyne', 'Fasády', 'Podlahy', 'Elektrika', 'Strechy', 'Zateplenie', 'Interiéry'],
    process: {
      title: 'Ako pracujeme',
      steps: [
        { title: 'Obhliadka zadarmo', text: 'Prídeme, zmeriame priestor a vypočujeme si, čo si predstavujete.' },
        { title: 'Presná kalkulácia', text: 'Dostanete rozpočet po položkách. Bez skrytých nákladov.' },
        { title: 'Realizácia', text: 'Vlastný tím pracuje podľa harmonogramu. O každej fáze viete vopred.' },
        { title: 'Odovzdanie a záruka', text: 'Upraceme, odovzdáme a na prácu dáme písomnú záruku až 5 rokov.' },
      ],
    },
    gallery: {
      title: 'Galéria realizácií',
      subtitle: 'Výber z dokončených projektov. Fotografie priebežne dopĺňame.',
      more: 'Zobraziť viac',
      less: 'Zobraziť menej',
      labels: ['Kúpeľňa', 'Kuchyňa', 'Fasáda', 'Interiér', 'Podlaha', 'Strecha', 'Obývačka', 'Exteriér', 'Schodisko', 'Terasa', 'Sadrokartón', 'Elektrika', 'Dlažba', 'Balkón', 'Vstup', 'Povala'],
    },
    reviews: {
      eyebrow: 'Referencie',
      title: 'Čo hovoria naši klienti',
      subtitle: 'Reálne skúsenosti z rekonštrukcií, ktoré sme dokončili.',
      before: 'Pred',
      after: 'Po',
      compare: 'Porovnať stav pred a po rekonštrukcii',
      items: [
        { name: 'Jana K.', location: 'Bratislava', text: 'Rekonštrukciu bytového jadra zvládli presne v dohodnutom termíne a bez prekvapení v cene.' },
        { name: 'Peter M.', location: 'Trnava', text: 'Oceňujem najmä komunikáciu. Vždy sme vedeli, čo sa deje a kedy bude ktorá fáza hotová.' },
        { name: 'Zuzana H.', location: 'Nitra', text: 'Kompletná rekonštrukcia domu od základov po strechu. Výsledok predčil naše očakávania.' },
      ],
    },
    banner: {
      title: 'Máte projekt, o ktorom rozmýšľate?',
      subtitle: 'Zavolajte alebo napíšte. Obhliadku a kalkuláciu pripravíme zadarmo.',
    },
    contact: {
      eyebrow: 'Kontakt',
      title: 'Poďme prebrať váš projekt',
      subtitle: 'Vyplňte formulár alebo nás kontaktujte priamo. Ozveme sa do 24 hodín.',
      formTitle: 'Nezáväzný dopyt',
      name: 'Meno a priezvisko',
      email: 'E-mail',
      phone: 'Telefón',
      message: 'O akú prácu ide?',
      phName: 'Vaše meno',
      phEmail: 'vas@email.sk',
      phPhone: '+421 900 000 000',
      phMessage: 'Napr. rekonštrukcia kúpeľne v paneláku, cca 5 m²',
      optional: 'nepovinné',
      submit: 'Odoslať dopyt',
      note: 'Formulár otvorí váš e-mailový program s pripravenou správou. Nič neodosielame za vás.',
      opened: 'Otvorili sme váš e-mailový program. Ak sa neotvoril, napíšte nám priamo na',
      errName: 'Napíšte nám, ako vás oslovovať.',
      errEmail: 'Zadajte e-mail v tvare meno@domena.sk.',
      errMessage: 'Napíšte aspoň pár slov o projekte.',
      subject: 'Dopyt z webu',
      infoTitle: 'Kontaktné údaje',
      phoneLabel: 'Telefón',
      emailLabel: 'E-mail',
      addressLabel: 'Adresa',
      hoursLabel: 'Pracovná doba',
      hours: 'Po-Pia 7:00-17:00',
      mapTitle: 'Mapa: sídlo PrerobTo Rekonštrukcie',
    },
    footer: {
      tagline: 'Rekonštrukcie a stavebné práce, na ktoré sa môžete spoľahnúť.',
      navTitle: 'Navigácia',
      contactTitle: 'Kontakt',
      rights: 'Všetky práva vyhradené.',
      top: 'Späť hore',
    },
  },
  en: {
    meta: 'PrerobTo Renovations | Apartment and house renovations, Bratislava',
    nav: { services: 'Services', process: 'Process', gallery: 'Gallery', reviews: 'Reviews', contact: 'Contact', menu: 'Open menu', close: 'Close menu', skip: 'Skip to content' },
    cta: 'Free quote',
    hero: {
      eyebrow: 'Renovation and construction, Bratislava',
      line1: 'We rebuild it.',
      line2: 'Properly.',
      subtitle: 'Complete renovations of apartments, houses and business premises. Demolition to final coat: one team, one responsibility.',
      secondary: 'See our work',
    },
    proof: [
      { value: 15, unit: '+', label: 'years on site', text: 'Hundreds of completed renovations of apartments, houses and premises across Slovakia.' },
      { value: 0, unit: '', label: 'random subcontractors', text: 'Masons, electricians and tilers are all our own people.' },
      { value: 5, unit: ' years', label: 'written warranty', text: 'On all completed work. We keep to the agreed deadlines.' },
    ],
    services: {
      title: 'Our services',
      subtitle: 'From partial jobs to full turnkey renovation. Pick what you need.',
      items: [
        { icon: PiHouseBold, title: 'Apartment renovations', text: 'Complete transformation of the core, floors, walls and utilities.' },
        { icon: PiBuildingsBold, title: 'House renovations', text: 'Foundations to roof. Full turnkey renovation of family houses.' },
        { icon: PiBathtubBold, title: 'Custom bathrooms', text: 'Design, tiling, sanitary fittings and underfloor heating in one package.' },
        { icon: PiCookingPotBold, title: 'Kitchen installation', text: 'Kitchen fit-out including water, gas and electrical connections.' },
        { icon: PiStackBold, title: 'Insulation and facades', text: 'Insulation systems, plastering and long-lasting facade coatings.' },
        { icon: PiPaintRollerBold, title: 'Painting and plastering', text: 'Wall levelling, plastering and painting, interior and exterior.' },
        { icon: PiLightningBold, title: 'Electrical work', text: 'New wiring, inspections and modernisation of the electrical network.' },
        { icon: PiPipeBold, title: 'Plumbing and heating', text: 'Water, sewage and heating system installations.' },
      ],
    },
    marquee: ['Bathrooms', 'Kitchens', 'Facades', 'Flooring', 'Electrics', 'Roofing', 'Insulation', 'Interiors'],
    process: {
      title: 'How we work',
      steps: [
        { title: 'Free site visit', text: 'We come over, measure the space and listen to what you have in mind.' },
        { title: 'Itemised estimate', text: 'You get a line-by-line budget. No hidden costs.' },
        { title: 'Build', text: 'Our own crew works to a schedule. You know every phase in advance.' },
        { title: 'Handover and warranty', text: 'We clean up, hand over and give a written warranty of up to 5 years.' },
      ],
    },
    gallery: {
      title: 'Project gallery',
      subtitle: 'A selection of completed projects. New photos are added regularly.',
      more: 'Show more',
      less: 'Show less',
      labels: ['Bathroom', 'Kitchen', 'Facade', 'Interior', 'Flooring', 'Roof', 'Living room', 'Exterior', 'Staircase', 'Terrace', 'Drywall', 'Electrical', 'Tiling', 'Balcony', 'Entrance', 'Attic'],
    },
    reviews: {
      eyebrow: 'Testimonials',
      title: 'What our clients say',
      subtitle: 'Real feedback from renovations we have finished.',
      before: 'Before',
      after: 'After',
      compare: 'Compare before and after the renovation',
      items: [
        { name: 'Jana K.', location: 'Bratislava', text: 'The bathroom core renovation was finished exactly on schedule, with no surprises in the price.' },
        { name: 'Peter M.', location: 'Trnava', text: 'What I valued most was the communication. We always knew what was happening and when each phase would be done.' },
        { name: 'Zuzana H.', location: 'Nitra', text: 'A full house renovation from the foundations to the roof. The result exceeded our expectations.' },
      ],
    },
    banner: {
      title: 'Got a project in mind?',
      subtitle: 'Call or write to us. The site visit and estimate are free.',
    },
    contact: {
      eyebrow: 'Contact',
      title: "Let's talk about your project",
      subtitle: "Fill in the form or reach out directly. We'll get back to you within 24 hours.",
      formTitle: 'Free inquiry',
      name: 'Full name',
      email: 'Email',
      phone: 'Phone',
      message: 'What needs doing?',
      phName: 'Your name',
      phEmail: 'you@email.com',
      phPhone: '+421 900 000 000',
      phMessage: 'E.g. bathroom renovation in a panel flat, about 5 m²',
      optional: 'optional',
      submit: 'Send inquiry',
      note: 'The form opens your own email app with the message ready. We never send anything for you.',
      opened: "We've opened your email app. If nothing happened, write to us directly at",
      errName: 'Tell us what to call you.',
      errEmail: 'Enter an email like name@domain.com.',
      errMessage: 'Add a few words about the project.',
      subject: 'Website inquiry',
      infoTitle: 'Contact details',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      addressLabel: 'Address',
      hoursLabel: 'Working hours',
      hours: 'Mon-Fri 7:00-17:00',
      mapTitle: 'Map: PrerobTo Renovations office',
    },
    footer: {
      tagline: 'Renovation and construction work you can rely on.',
      navTitle: 'Navigation',
      contactTitle: 'Contact',
      rights: 'All rights reserved.',
      top: 'Back to top',
    },
  },
};

type NavKey = 'services' | 'process' | 'gallery' | 'reviews' | 'contact';
const NAV: { id: string; key: NavKey }[] = [
  { id: 'sluzby', key: 'services' },
  { id: 'postup', key: 'process' },
  { id: 'galeria', key: 'gallery' },
  { id: 'recenzie', key: 'reviews' },
  { id: 'kontakt', key: 'contact' },
];

/* =========================================================
   Small building blocks
   ========================================================= */
function go(id: string, after?: () => void) {
  return (e: MouseEvent) => {
    e.preventDefault();
    after?.();
    scrollToId(id);
  };
}

function CtaButton({ label, onClick, tone = 'accent' }: { label: string; onClick: (e: MouseEvent) => void; tone?: 'accent' | 'ink' | 'ghost' }) {
  return (
    <a href="#kontakt" className={`sb-btn sb-btn--${tone}`} onClick={onClick}>
      <span>{label}</span>
      <span className="sb-btn__icon" aria-hidden="true">
        <PiArrowRightBold />
      </span>
    </a>
  );
}

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="sb-lang" role="group" aria-label="Jazyk / Language">
      {LANGS.map((code) => (
        <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <span className="sb-logo">
      <span className="sb-logo__mark" aria-hidden="true">P</span>
      <span className="sb-logo__text">
        {COMPANY.name}
        <small>{COMPANY.suffix}</small>
      </span>
    </span>
  );
}

function Socials() {
  return (
    <div className="sb-social">
      <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <PiFacebookLogoBold />
      </a>
      <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <PiInstagramLogoBold />
      </a>
    </div>
  );
}

/* =========================================================
   Header + mobile menu
   ========================================================= */
function Header({ t, lang, setLang }: { t: Content; lang: Lang; setLang: (l: Lang) => void }) {
  const scrolled = useScrolledPast(24);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  useScrollLock(open);
  const close = () => setOpen(false);

  return (
    <>
      <header className={`sb-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="sb-header__bar">
          <a href="#hero" className="sb-header__brand" onClick={go('hero', close)} aria-label={`${COMPANY.name} ${COMPANY.suffix}`}>
            <Logo />
          </a>

          <nav className="sb-nav" aria-label="Hlavná navigácia">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={go(item.id)}>
                {t.nav[item.key]}
              </a>
            ))}
          </nav>

          <div className="sb-header__actions">
            <LangSwitch lang={lang} setLang={setLang} />
            <a className="sb-header__phone" href={COMPANY.phoneHref}>
              <PiPhoneBold aria-hidden="true" />
              <span>{COMPANY.phone}</span>
            </a>
            <button
              type="button"
              className={`sb-burger ${open ? 'is-open' : ''}`}
              aria-label={open ? t.nav.close : t.nav.menu}
              aria-expanded={open}
              aria-controls="sb-mobile-menu"
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
            id="sb-mobile-menu"
            className="sb-menu"
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <nav className="sb-menu__nav" aria-label="Mobilná navigácia">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={go(item.id, close)}
                  initial={reduce ? false : { y: 48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: EASE_OUT }}
                >
                  {t.nav[item.key]}
                </motion.a>
              ))}
            </nav>
            <div className="sb-menu__foot">
              <a href={COMPANY.phoneHref}>
                <PiPhoneBold aria-hidden="true" /> {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`}>
                <PiEnvelopeSimpleBold aria-hidden="true" /> {COMPANY.email}
              </a>
              <div className="sb-menu__row">
                <Socials />
                <LangSwitch lang={lang} setLang={setLang} />
              </div>
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
function Hero({ t }: { t: Content }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const typeY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);

  const line = (text: string, delay: number, className = '') => (
    <span className="sb-hero__mask">
      <motion.span
        className={`sb-hero__line ${className}`}
        initial={reduce ? false : { y: '105%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, delay, ease: EASE_OUT }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <section className="sb-hero" id="hero" ref={ref}>
      <motion.div className="sb-hero__grid" style={reduce ? undefined : { y: gridY }} aria-hidden="true" />
      {PHOTOS.hero && (
        <div className="sb-hero__photo" aria-hidden="true">
          <img src={PHOTOS.hero} alt="" />
        </div>
      )}

      <motion.div className="sb-wrap sb-hero__inner" style={reduce ? undefined : { y: typeY }}>
        <motion.p
          className="sb-eyebrow"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          {t.hero.eyebrow}
        </motion.p>

        <h1 className="sb-hero__title">
          {line(t.hero.line1, 0.1)}
          {line(t.hero.line2, 0.22, 'is-accent')}
        </h1>

        {/* Cross-line laser level: precision is the brand promise */}
        <div className="sb-hero__level" aria-hidden="true">
          <motion.div
            className="sb-hero__laser"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.55, ease: EASE_OUT }}
          />
          <motion.div
            className="sb-hero__plumb"
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.6, delay: 0.9, ease: EASE_OUT }}
          />
          <motion.span
            className="sb-hero__cross"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1.5 }}
          />
        </div>

        <motion.div
          className="sb-hero__foot"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE_OUT }}
        >
          <p className="sb-hero__subtitle">{t.hero.subtitle}</p>
          <div className="sb-hero__ctas">
            <CtaButton label={t.cta} onClick={go('kontakt')} />
            <a href="#galeria" className="sb-link" onClick={go('galeria')}>
              {t.hero.secondary}
              <PiArrowRightBold aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* =========================================================
   Proof strip
   ========================================================= */
function Proof({ t }: { t: Content }) {
  return (
    <section className="sb-proof" aria-label={t.proof.map((p) => p.label).join(', ')}>
      <div className="sb-wrap sb-proof__grid">
        {t.proof.map((p, i) => (
          <Reveal key={p.label} className="sb-proof__item" delay={i * 0.08}>
            <p className="sb-proof__value">
              <Counter to={p.value} />
              <span className="sb-proof__unit">{p.unit}</span>
            </p>
            <p className="sb-proof__label">{p.label}</p>
            <p className="sb-proof__text">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   Services: sticky heading + interactive index
   ========================================================= */
function Services({ t }: { t: Content }) {
  return (
    <section className="sb-section sb-services" id="sluzby">
      <div className="sb-wrap sb-services__layout">
        <div className="sb-services__head">
          <Reveal>
            <h2 className="sb-h2">{t.services.title}</h2>
            <p className="sb-lead">{t.services.subtitle}</p>
            <CtaButton label={t.cta} onClick={go('kontakt')} tone="ghost" />
          </Reveal>
        </div>

        <ul className="sb-services__list">
          {t.services.items.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="li" key={s.title} className="sb-service" delay={(i % 4) * 0.05}>
                <span className="sb-service__icon" aria-hidden="true">
                  <Icon />
                </span>
                <div className="sb-service__body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
                <PiArrowRightBold className="sb-service__arrow" aria-hidden="true" />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* =========================================================
   Marquee (the one per page)
   ========================================================= */
function Marquee({ words }: { words: string[] }) {
  const row = (hidden: boolean) => (
    <div className="sb-marquee__row" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <span key={w} className="sb-marquee__item">
          {w}
          <PiAsteriskBold className="sb-marquee__star" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="sb-marquee">
      <div className="sb-marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* =========================================================
   Process: timeline that fills as you scroll
   ========================================================= */
function Process({ t }: { t: Content }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });

  return (
    <section className="sb-section sb-process" id="postup">
      <div className="sb-wrap">
        <Reveal>
          <h2 className="sb-h2">{t.process.title}</h2>
        </Reveal>
        <ol className="sb-process__list" ref={ref}>
          <li className="sb-process__rail" aria-hidden="true">
            <motion.span style={reduce ? { scale: 1 } : { scaleX: scrollYProgress }} className="sb-process__fill sb-process__fill--x" />
            <motion.span style={reduce ? { scale: 1 } : { scaleY: scrollYProgress }} className="sb-process__fill sb-process__fill--y" />
          </li>
          {t.process.steps.map((step, i) => (
            <Reveal as="li" key={step.title} className="sb-process__step" delay={i * 0.1}>
              <span className="sb-process__node" aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* =========================================================
   Gallery: bento with textured fallbacks
   ========================================================= */
function Gallery({ t }: { t: Content }) {
  const [expanded, setExpanded] = useState(false);
  const count = expanded ? GALLERY_COUNT : GALLERY_INITIAL;

  return (
    <section className="sb-section sb-gallery" id="galeria">
      <div className="sb-wrap">
        <Reveal className="sb-gallery__head">
          <h2 className="sb-h2">{t.gallery.title}</h2>
          <p className="sb-lead">{t.gallery.subtitle}</p>
        </Reveal>

        <div className="sb-gallery__grid">
          {Array.from({ length: count }, (_, i) => {
            const label = t.gallery.labels[i % t.gallery.labels.length];
            return (
              <Reveal key={i} className={`sb-tile ${GALLERY_SPAN[i] ?? ''}`} delay={(i % 5) * 0.04} y={20}>
                <Photo
                  src={PHOTOS.gallery[i]}
                  alt={label}
                  className="sb-tile__photo"
                  fallback={<div className={`sb-tile__art ${GALLERY_TEXTURES[i % GALLERY_TEXTURES.length]}`} />}
                />
                <p className="sb-tile__label">{label}</p>
              </Reveal>
            );
          })}
        </div>

        <div className="sb-gallery__toggle">
          <button type="button" className="sb-btn sb-btn--ghost" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            <span>{expanded ? t.gallery.less : t.gallery.more}</span>
            <span className={`sb-btn__icon ${expanded ? 'is-flipped' : ''}`} aria-hidden="true">
              <PiCaretDownBold />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Reviews: before/after comparison + quotes
   ========================================================= */
function BeforeAfter({ t }: { t: Content }) {
  const ref = useRef<HTMLDivElement>(null);
  // Drag position lives in a CSS variable, so dragging never re-renders React
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    ref.current?.style.setProperty('--pos', `${e.target.value}%`);
  };

  return (
    <div className="sb-compare" ref={ref}>
      <Photo
        src={PHOTOS.after}
        alt={t.reviews.after}
        className="sb-compare__layer sb-compare__after"
        fallback={
          <div className="sb-room sb-room--after">
            <span className="sb-room__window" />
            <span className="sb-room__floor" />
          </div>
        }
      />
      <div className="sb-compare__clip">
        <Photo
          src={PHOTOS.before}
          alt={t.reviews.before}
          className="sb-compare__layer sb-compare__before"
          fallback={
            <div className="sb-room sb-room--before">
              <span className="sb-room__patch" />
              <span className="sb-room__floor" />
            </div>
          }
        />
      </div>
      <span className="sb-compare__tag sb-compare__tag--before">{t.reviews.before}</span>
      <span className="sb-compare__tag sb-compare__tag--after">{t.reviews.after}</span>
      <span className="sb-compare__handle" aria-hidden="true">
        <span className="sb-compare__grip">
          <PiArrowsLeftRightBold />
        </span>
      </span>
      <input type="range" min={0} max={100} defaultValue={50} onChange={onInput} aria-label={t.reviews.compare} className="sb-compare__range" />
    </div>
  );
}

function Reviews({ t }: { t: Content }) {
  return (
    <section className="sb-section sb-reviews" id="recenzie">
      <div className="sb-wrap sb-reviews__layout">
        <Reveal className="sb-reviews__visual">
          <BeforeAfter t={t} />
        </Reveal>

        <div className="sb-reviews__content">
          <Reveal>
            <p className="sb-eyebrow">{t.reviews.eyebrow}</p>
            <h2 className="sb-h2">{t.reviews.title}</h2>
            <p className="sb-lead">{t.reviews.subtitle}</p>
          </Reveal>

          <ul className="sb-quotes">
            {t.reviews.items.map((r, i) => (
              <Reveal as="li" key={r.name} className="sb-quote" delay={i * 0.08}>
                <div className="sb-quote__stars" aria-label="5/5">
                  {Array.from({ length: 5 }, (_, s) => (
                    <PiStarFill key={s} aria-hidden="true" />
                  ))}
                </div>
                <blockquote>“{r.text}”</blockquote>
                <p className="sb-quote__by">
                  <strong>{r.name}</strong>
                  <span>{r.location}</span>
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Banner
   ========================================================= */
function Banner({ t }: { t: Content }) {
  return (
    <section className="sb-banner">
      <div className="sb-wrap sb-banner__inner">
        <Reveal className="sb-banner__copy">
          <h2 className="sb-banner__title">{t.banner.title}</h2>
          <p>{t.banner.subtitle}</p>
        </Reveal>
        <Reveal className="sb-banner__actions" delay={0.1}>
          <a className="sb-banner__phone" href={COMPANY.phoneHref}>
            <PiPhoneBold aria-hidden="true" />
            {COMPANY.phone}
          </a>
          <CtaButton label={t.cta} onClick={go('kontakt')} tone="ink" />
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   Contact
   ========================================================= */
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

function Contact({ t }: { t: Content }) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [opened, setOpened] = useState(false);
  const c = t.contact;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const next: FieldErrors = {};
    if (!name) next.name = c.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = c.errEmail;
    if (message.length < 5) next.message = c.errMessage;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    const lines = [`${c.name}: ${name}`, `${c.email}: ${email}`];
    if (phone) lines.push(`${c.phone}: ${phone}`);
    const body = [...lines, '', message].join('\n');
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(`${c.subject}: ${name}`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const field = (key: 'name' | 'email' | 'phone' | 'message', label: string, placeholder: string, type = 'text', optional = false) => {
    const err = key !== 'phone' ? errors[key] : undefined;
    const id = `sb-${key}`;
    const common = {
      id,
      name: key,
      placeholder,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${id}-err` : undefined,
      onInput: () => err && setErrors((prev) => ({ ...prev, [key]: undefined })),
    };
    return (
      <div className={`sb-field ${err ? 'has-error' : ''}`}>
        <label htmlFor={id}>
          {label}
          {optional && <span className="sb-field__opt">{c.optional}</span>}
        </label>
        {key === 'message' ? (
          <textarea {...common} rows={5} />
        ) : (
          <input {...common} type={type} autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : 'tel'} />
        )}
        {err && (
          <p className="sb-field__error" id={`${id}-err`}>
            <PiWarningCircleBold aria-hidden="true" />
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className="sb-section sb-contact" id="kontakt">
      <div className="sb-wrap">
        <Reveal className="sb-contact__head">
          <p className="sb-eyebrow">{c.eyebrow}</p>
          <h2 className="sb-h2">{c.title}</h2>
          <p className="sb-lead">{c.subtitle}</p>
        </Reveal>

        <div className="sb-contact__layout">
          <Reveal className="sb-shell">
            <form className="sb-form" onSubmit={handleSubmit} noValidate>
              <h3 className="sb-h3">{c.formTitle}</h3>
              <div className="sb-form__row">
                {field('name', c.name, c.phName)}
                {field('phone', c.phone, c.phPhone, 'tel', true)}
              </div>
              {field('email', c.email, c.phEmail, 'email')}
              {field('message', c.message, c.phMessage)}

              <button type="submit" className="sb-btn sb-btn--accent sb-btn--block">
                <span>{c.submit}</span>
                <span className="sb-btn__icon" aria-hidden="true">
                  <PiArrowRightBold />
                </span>
              </button>
              <p className="sb-form__note" role="status">
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

          <Reveal className="sb-contact__aside" delay={0.1}>
            <h3 className="sb-h3">{c.infoTitle}</h3>
            <dl className="sb-info">
              <div>
                <dt>
                  <PiPhoneBold aria-hidden="true" />
                  {c.phoneLabel}
                </dt>
                <dd>
                  <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                </dd>
              </div>
              <div>
                <dt>
                  <PiEnvelopeSimpleBold aria-hidden="true" />
                  {c.emailLabel}
                </dt>
                <dd>
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </dd>
              </div>
              <div>
                <dt>
                  <PiMapPinBold aria-hidden="true" />
                  {c.addressLabel}
                </dt>
                <dd>{COMPANY.address}</dd>
              </div>
              <div>
                <dt>
                  <PiClockBold aria-hidden="true" />
                  {c.hoursLabel}
                </dt>
                <dd>{c.hours}</dd>
              </div>
            </dl>
            <Socials />
            <div className="sb-map">
              <iframe src={COMPANY.mapEmbedSrc} title={c.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Footer
   ========================================================= */
function Footer({ t, lang, setLang }: { t: Content; lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <footer className="sb-footer">
      <div className="sb-wrap">
        <div className="sb-footer__top">
          <div className="sb-footer__brand">
            <Logo />
            <p>{t.footer.tagline}</p>
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
          <nav className="sb-footer__col" aria-label={t.footer.navTitle}>
            <h4>{t.footer.navTitle}</h4>
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={go(item.id)}>
                {t.nav[item.key]}
              </a>
            ))}
          </nav>
          <div className="sb-footer__col">
            <h4>{t.footer.contactTitle}</h4>
            <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            <span>{COMPANY.address}</span>
            <Socials />
          </div>
        </div>
      </div>

      <p className="sb-footer__word" aria-hidden="true">
        {COMPANY.name}
      </p>

      <div className="sb-wrap sb-footer__bottom">
        <span>
          © {new Date().getFullYear()} {COMPANY.name} {COMPANY.suffix}. {t.footer.rights}
        </span>
        <button type="button" className="sb-footer__top-link" onClick={scrollToTop}>
          {t.footer.top}
          <PiArrowUpBold aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}

function ToTop({ label }: { label: string }) {
  const visible = useScrolledPast(900);
  return (
    <button type="button" className={`sb-to-top ${visible ? 'is-visible' : ''}`} onClick={scrollToTop} aria-label={label} tabIndex={visible ? 0 : -1}>
      <PiArrowUpBold />
    </button>
  );
}

/* =========================================================
   Page
   ========================================================= */
export default function Stavba() {
  const [lang, setLang] = useStoredLang<Lang>('stavba-lang', LANGS, 'sk');
  const t = content[lang];
  useSmoothScroll();
  useDocumentTitle(t.meta);

  return (
    <div className="sb">
      <a className="sb-skip" href="#obsah" onClick={go('obsah', () => document.getElementById('obsah')?.focus())}>
        {t.nav.skip}
      </a>
      <Header t={t} lang={lang} setLang={setLang} />
      <main id="obsah" tabIndex={-1}>
        <Hero t={t} />
        <Proof t={t} />
        <Services t={t} />
        <Marquee words={t.marquee} />
        <Process t={t} />
        <Gallery t={t} />
        <Reviews t={t} />
        <Banner t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} lang={lang} setLang={setLang} />
      <ToTop label={t.footer.top} />
    </div>
  );
}
