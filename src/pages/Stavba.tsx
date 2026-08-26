import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import './stavba.css';

/* =========================================================
   Types
   ========================================================= */
type Lang = 'sk' | 'en';

type IconKey =
  | 'experience' | 'team' | 'guarantee'
  | 'house' | 'bath' | 'kitchen' | 'facade' | 'paint' | 'bolt' | 'pipe' | 'layers'
  | 'camera' | 'star' | 'phone' | 'mail' | 'pin' | 'facebook' | 'instagram'
  | 'menu' | 'close' | 'arrow-right' | 'chevron-up' | 'clock' | 'sun' | 'moon';

interface PointItem { icon: IconKey; title: string; text: string }
interface ServiceItem { icon: IconKey; title: string; text: string }
interface ReviewItem { name: string; location: string; text: string; rating: number }

interface Content {
  nav: { home: string; services: string; gallery: string; reviews: string; contact: string };
  header: { cta: string };
  hero: {
    eyebrow: string;
    titleA: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    points: PointItem[];
  };
  services: { eyebrow: string; title: string; subtitle: string; items: ServiceItem[] };
  gallery: { eyebrow: string; title: string; subtitle: string; showMore: string; showLess: string; labels: string[] };
  reviews: { eyebrow: string; title: string; subtitle: string; before: string; after: string; items: ReviewItem[] };
  banner: { title: string; subtitle: string; cta: string };
  contact: {
    eyebrow: string; title: string; subtitle: string;
    formTitle: string;
    labelName: string; labelEmail: string; labelPhone: string; labelMessage: string;
    placeholderName: string; placeholderEmail: string; placeholderPhone: string; placeholderMessage: string;
    submit: string; sending: string; success: string; note: string;
    infoTitle: string; phoneLabel: string; emailLabel: string; addressLabel: string; hoursLabel: string;
    address: string; hours: string;
    mapTitle: string;
  };
  footer: {
    tagline: string;
    navTitle: string;
    servicesTitle: string;
    contactTitle: string;
    rights: string;
  };
}

/* =========================================================
   Static data (fake / placeholder company details)
   ========================================================= */
const COMPANY = {
  name: 'PrerobTo',
  suffix: 'Rekonštrukcie',
  phone: '+421 900 123 456',
  phoneHref: 'tel:+421900123456',
  email: 'prerobto@prerobto.com',
  emailHref: 'mailto: prerobto@prerobto.com',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  mapEmbedSrc: 'https://www.google.com/maps?q=Bratislava,Slovensko&output=embed',
};

const GALLERY_COUNT = 16;
const GALLERY_INITIAL = 10; // 2 rows x 5

/* =========================================================
   Icon component — small hand-drawn line icons, no deps
   ========================================================= */
function Icon({ name, size = 22 }: { name: IconKey; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'experience':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="5" />
          <path d="M8.5 12.5 7 21l5-2.6 5 2.6-1.5-8.5" />
        </svg>
      );
    case 'team':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
          <circle cx="17" cy="9" r="2.4" />
          <path d="M15.2 14.3c2.6.3 4.8 2.5 4.8 5.7" />
        </svg>
      );
    case 'guarantee':
      return (
        <svg {...common}>
          <path d="M12 3l7 3.2v5.3c0 5-3 8.4-7 9.5-4-1.1-7-4.5-7-9.5V6.2L12 3z" />
          <path d="M9 12l2.2 2.2L15.5 10" />
        </svg>
      );
    case 'house':
      return (
        <svg {...common}>
          <path d="M4 11 12 4l8 7" />
          <path d="M6 10v10h12V10" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );
    case 'bath':
      return (
        <svg {...common}>
          <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2z" />
          <path d="M6 12V7a2 2 0 0 1 3.2-1.6" />
          <path d="M4 19v1.5M18 19v1.5" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg {...common}>
          <path d="M5 10h14l-1.2 9H6.2L5 10z" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M9 5.5c0-1 .8-1.8 1.8-1.8" />
        </svg>
      );
    case 'facade':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M4 10h16M4 16h16M10 4v16M16 4v16" />
        </svg>
      );
    case 'paint':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="10" height="6" rx="1" />
          <path d="M9 11v3a2 2 0 0 0 2 2h.5a1.5 1.5 0 0 1 1.5 1.5v.5a1.5 1.5 0 0 0 3 0c0-3-2-4-2-6" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 3 5 14h5l-1 7 8-11h-5l1-7z" />
        </svg>
      );
    case 'pipe':
      return (
        <svg {...common}>
          <path d="M4 7h7a3 3 0 0 1 3 3v7" />
          <path d="M17 15h3v3a2 2 0 1 1-4 0v-1" />
          <circle cx="5.5" cy="7" r="1.6" />
        </svg>
      );
    case 'layers':
      return (
        <svg {...common}>
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13l9 5 9-5" />
          <path d="M3 17.5l9 5 9-5" />
        </svg>
      );
    case 'camera':
      return (
        <svg {...common}>
          <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8z" />
          <circle cx="12" cy="13.5" r="3.3" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5-6-3.5-6 3.5 1.5-6.5-5-4.4 6.6-.6 2.9-6z" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M5 4h3.5l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5V19c0 1.1-.9 2-2 2C10.5 21 3 13.5 3 6a2 2 0 0 1 2-2z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
          <path d="M4.5 6.5l7.5 6 7.5-6" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.4" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common} fill="currentColor" stroke="none" viewBox="0 0 24 24">
          <path d="M14 9h2.5V6.2h-2.5c-2.2 0-3.5 1.4-3.5 3.6v1.7H8.3v3h2.2V21h3v-6.5h2.3l.4-3h-2.7V10c0-.6.3-1 .9-1z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...common}>
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      );
    case 'chevron-up':
      return (
        <svg {...common}>
          <path d="M5 15l7-7 7 7" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common}>
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
        </svg>
      );
    default:
      return null;
  }
}

/* =========================================================
   Content / translations (SK primary, EN provided,
   structure ready for adding more languages later)
   ========================================================= */
const content: Record<Lang, Content> = {
  sk: {
    nav: { home: 'Domov', services: 'Služby', gallery: 'Galéria', reviews: 'Recenzie', contact: 'Kontakt' },
    header: { cta: 'Nezáväzná ponuka' },
    hero: {
      eyebrow: 'Rekonštrukcie a stavebné práce',
      titleA: 'Staviame a rekonštruujeme s',
      titleHighlight: 'remeselnou presnosťou',
      subtitle:
        'Kompletné rekonštrukcie bytov, domov a komerčných priestorov na Slovensku. Od búračky až po posledný náter — jeden tím, jedna zodpovednosť.',
      ctaPrimary: 'Nezáväzná kalkulácia',
      ctaSecondary: 'Pozrieť referencie',
      points: [
        {
          icon: 'experience',
          title: '15+ rokov na stavbách',
          text: 'Stovky dokončených rekonštrukcií bytov, domov a prevádzok po celom Slovensku.',
        },
        {
          icon: 'team',
          title: 'Vlastný tím remeselníkov',
          text: 'Žiadni náhodní subdodávatelia — murári, elektrikári aj obkladači sú naši ľudia.',
        },
        {
          icon: 'guarantee',
          title: 'Záruka až 5 rokov',
          text: 'Na všetky vykonané práce dávame písomnú záruku a dodržiavame dohodnuté termíny.',
        },
      ],
    },
    services: {
      eyebrow: 'Čo robíme',
      title: 'Naše služby',
      subtitle: 'Od čiastkových prác až po kompletnú rekonštrukciu na kľúč — vyberte si, čo potrebujete.',
      items: [
        { icon: 'house', title: 'Rekonštrukcie bytov', text: 'Kompletná premena bytového jadra, podláh, priečok aj rozvodov.' },
        { icon: 'facade', title: 'Rekonštrukcie domov', text: 'Od základov po strechu — obnova rodinných domov na kľúč.' },
        { icon: 'bath', title: 'Kúpeľne na mieru', text: 'Návrh, obklady, sanita aj podlahové kúrenie v jednom balíku.' },
        { icon: 'kitchen', title: 'Kuchynské linky', text: 'Realizácia kuchyne vrátane rozvodov vody, plynu a elektriny.' },
        { icon: 'layers', title: 'Zatepľovanie a fasády', text: 'Zatepľovacie systémy, omietky a fasádne nátery s dlhou životnosťou.' },
        { icon: 'paint', title: 'Maliarske a stierkové práce', text: 'Vyrovnávanie stien, stierky, maľby interiérov aj exteriérov.' },
        { icon: 'bolt', title: 'Elektroinštalácie', text: 'Nové rozvody, revízie a modernizácia elektrickej siete.' },
        { icon: 'pipe', title: 'Vodoinštalácie a kúrenie', text: 'Rozvody vody, kanalizácie a vykurovacích systémov.' },
      ],
    },
    gallery: {
      eyebrow: 'Naša práca',
      title: 'Galéria realizácií',
      subtitle: 'Výber z dokončených projektov. Fotografie priebežne dopĺňame.',
      showMore: 'Zobraziť viac fotiek',
      showLess: 'Zobraziť menej',
      labels: ['Kúpeľňa', 'Kuchyňa', 'Fasáda', 'Interiér', 'Podlaha', 'Strecha', 'Obývačka', 'Exteriér', 'Schodisko', 'Terasa', 'Sadrokartón', 'Elektrika', 'Dlažba', 'Balkón', 'Vstup', 'Povala'],
    },
    reviews: {
      eyebrow: 'Referencie',
      title: 'Čo hovoria naši klienti',
      subtitle: 'Reálne skúsenosti z rekonštrukcií, ktoré sme dokončili — fotky pred a po pridávame priebežne.',
      before: 'Pred',
      after: 'Po',
      items: [
        {
          name: 'Jana K.',
          location: 'Bratislava',
          rating: 5,
          text: 'Rekonštrukciu bytového jadra zvládli presne v dohodnutom termíne a bez akýchkoľvek prekvapení v cene.',
        },
        {
          name: 'Peter M.',
          location: 'Trnava',
          rating: 5,
          text: 'Oceňujem najmä komunikáciu — vždy sme vedeli, čo sa deje a kedy bude ktorá fáza hotová.',
        },
        {
          name: 'Zuzana H.',
          location: 'Nitra',
          rating: 5,
          text: 'Kompletná rekonštrukcia domu od základov po strechu. Výsledok predčil naše očakávania.',
        },
      ],
    },
    banner: {
      title: 'Máte projekt, o ktorom rozmýšľate?',
      subtitle: 'Zavolajte nám alebo napíšte — obhliadku a kalkuláciu pripravíme zadarmo.',
      cta: 'Napísať správu',
    },
    contact: {
      eyebrow: 'Kontakt',
      title: 'Poďme prebrať váš projekt',
      subtitle: 'Vyplňte formulár nižšie alebo nás kontaktujte priamo — ozveme sa do 24 hodín.',
      formTitle: 'Nezáväzný dopyt',
      labelName: 'Meno a priezvisko',
      labelEmail: 'E-mail',
      labelPhone: 'Telefón',
      labelMessage: 'Správa',
      placeholderName: 'Váš email',
      placeholderEmail: 'prerobto@prerobto.com',
      placeholderPhone: '+421 900 000 000',
      placeholderMessage: 'Opíšte nám váš projekt...',
      submit: 'Odoslať dopyt',
      sending: 'Odosielam...',
      success: 'Ďakujeme! Vaša správa bola odoslaná, ozveme sa čo najskôr.',
      note: 'Odoslaním súhlasíte so spracovaním osobných údajov za účelom vybavenia dopytu.',
      infoTitle: 'Kontaktné údaje',
      phoneLabel: 'Telefón',
      emailLabel: 'E-mail',
      addressLabel: 'Adresa',
      hoursLabel: 'Pracovná doba',
      address: 'Stavebná 12, 831 04 Bratislava',
      hours: 'Po – Pia: 7:00 – 17:00',
      mapTitle: 'Kde nás nájdete',
    },
    footer: {
      tagline: 'Rekonštrukcie a stavebné práce, na ktoré sa môžete spoľahnúť.',
      navTitle: 'Navigácia',
      servicesTitle: 'Služby',
      contactTitle: 'Kontakt',
      rights: 'Všetky práva vyhradené.',
    },
  },
  en: {
    nav: { home: 'Home', services: 'Services', gallery: 'Gallery', reviews: 'Reviews', contact: 'Contact' },
    header: { cta: 'Free quote' },
    hero: {
      eyebrow: 'Renovation & construction work',
      titleA: 'We build and renovate with',
      titleHighlight: 'craftsman precision',
      subtitle:
        'Complete renovations of apartments, houses and commercial spaces across Slovakia. From demolition to the final coat of paint — one team, one responsibility.',
      ctaPrimary: 'Get a free estimate',
      ctaSecondary: 'See our work',
      points: [
        {
          icon: 'experience',
          title: '15+ years on site',
          text: 'Hundreds of completed renovations of apartments, houses and business premises across Slovakia.',
        },
        {
          icon: 'team',
          title: 'Our own craftsmen',
          text: 'No random subcontractors — masons, electricians and tilers are all our own people.',
        },
        {
          icon: 'guarantee',
          title: 'Up to 5-year warranty',
          text: 'We provide a written warranty on all completed work and keep to the agreed deadlines.',
        },
      ],
    },
    services: {
      eyebrow: 'What we do',
      title: 'Our services',
      subtitle: 'From partial jobs to full turnkey renovation — pick what you need.',
      items: [
        { icon: 'house', title: 'Apartment renovations', text: 'Complete transformation of the core, floors, walls and utilities.' },
        { icon: 'facade', title: 'House renovations', text: 'From foundations to roof — full turnkey renovation of family houses.' },
        { icon: 'bath', title: 'Custom bathrooms', text: 'Design, tiling, sanitary fittings and underfloor heating in one package.' },
        { icon: 'kitchen', title: 'Kitchen installation', text: 'Kitchen fit-out including water, gas and electrical connections.' },
        { icon: 'layers', title: 'Insulation & facades', text: 'Insulation systems, plastering and long-lasting facade coatings.' },
        { icon: 'paint', title: 'Painting & plastering', text: 'Wall levelling, plastering and painting, interior and exterior.' },
        { icon: 'bolt', title: 'Electrical work', text: 'New wiring, inspections and modernisation of the electrical network.' },
        { icon: 'pipe', title: 'Plumbing & heating', text: 'Water, sewage and heating system installations.' },
      ],
    },
    gallery: {
      eyebrow: 'Our work',
      title: 'Project gallery',
      subtitle: 'A selection of completed projects. New photos are added regularly.',
      showMore: 'Show more photos',
      showLess: 'Show less',
      labels: ['Bathroom', 'Kitchen', 'Facade', 'Interior', 'Flooring', 'Roof', 'Living room', 'Exterior', 'Staircase', 'Terrace', 'Drywall', 'Electrical', 'Tiling', 'Balcony', 'Entrance', 'Attic'],
    },
    reviews: {
      eyebrow: 'Testimonials',
      title: 'What our clients say',
      subtitle: 'Real feedback from finished renovations — before and after photos are added regularly.',
      before: 'Before',
      after: 'After',
      items: [
        {
          name: 'Jana K.',
          location: 'Bratislava',
          rating: 5,
          text: 'The bathroom core renovation was finished exactly on schedule with no surprises in the price.',
        },
        {
          name: 'Peter M.',
          location: 'Trnava',
          rating: 5,
          text: 'What I valued most was the communication — we always knew what was happening and when each phase would be done.',
        },
        {
          name: 'Zuzana H.',
          location: 'Nitra',
          rating: 5,
          text: 'A full house renovation from the foundations to the roof. The result exceeded our expectations.',
        },
      ],
    },
    banner: {
      title: 'Got a project in mind?',
      subtitle: 'Call or write to us — the site visit and estimate are free.',
      cta: 'Send a message',
    },
    contact: {
      eyebrow: 'Contact',
      title: "Let's talk about your project",
      subtitle: "Fill in the form below or reach out directly — we'll get back to you within 24 hours.",
      formTitle: 'Free inquiry',
      labelName: 'Full name',
      labelEmail: 'Email',
      labelPhone: 'Phone',
      labelMessage: 'Message',
      placeholderName: 'Your name',
      placeholderEmail: 'prerobto@prerobto.com',
      placeholderPhone: '+421 900 000 000',
      placeholderMessage: 'Tell us about your project...',
      submit: 'Send inquiry',
      sending: 'Sending...',
      success: "Thank you! Your message has been sent, we'll be in touch soon.",
      note: 'By submitting you agree to the processing of your personal data to handle your inquiry.',
      infoTitle: 'Contact details',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      addressLabel: 'Address',
      hoursLabel: 'Working hours',
      address: 'Stavebná 12, 831 04 Bratislava',
      hours: 'Mon – Fri: 7:00 – 17:00',
      mapTitle: 'Find us here',
    },
    footer: {
      tagline: 'Renovation and construction work you can rely on.',
      navTitle: 'Navigation',
      servicesTitle: 'Services',
      contactTitle: 'Contact',
      rights: 'All rights reserved.',
    },
  },
};

const LANGS: { code: Lang; label: string }[] = [
  { code: 'sk', label: 'SK' },
  { code: 'en', label: 'EN' },
];

/* =========================================================
   Small reusable bits
   ========================================================= */
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="sb-review__stars" aria-label={`${count}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={16} />
      ))}
    </div>
  );
}

/* =========================================================
   Main component
   ========================================================= */
export default function Stavba() {
  const [lang, setLang] = useState<Lang>('sk');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const rootRef = useRef<HTMLDivElement>(null);

  const t = content[lang];

  const navItems: { id: string; label: string }[] = [
    { id: 'hero', label: t.nav.home },
    { id: 'sluzby', label: t.nav.services },
    { id: 'galeria', label: t.nav.gallery },
    { id: 'recenzie', label: t.nav.reviews },
    { id: 'kontakt', label: t.nav.contact },
  ];

  // scroll effects: header background + back-to-top visibility
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // reveal-on-scroll animation
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang, galleryExpanded]);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('sending');
    window.setTimeout(() => {
      setFormState('sent');
      (e.target as HTMLFormElement).reset();
    }, 900);
  };

  const galleryItems = Array.from({ length: GALLERY_COUNT }).map((_, i) => ({
    id: i,
    label: t.gallery.labels[i % t.gallery.labels.length],
  }));
  const visibleGalleryItems = galleryExpanded ? galleryItems : galleryItems.slice(0, GALLERY_INITIAL);

  return (
    <div className="sb-root" ref={rootRef}>
      {/* ============ HEADER ============ */}
      <header className={`sb-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container sb-header__inner">
          <a href="#hero" className="sb-logo" onClick={handleNavClick('hero')}>
            <span className="sb-logo__mark">
              <Icon name="house" size={18} />
            </span>
            <span className="sb-logo__text">
              {COMPANY.name} <span>{COMPANY.suffix}</span>
            </span>
          </a>

          <nav className="sb-nav-desktop" aria-label="Hlavná navigácia">
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={handleNavClick(item.id)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sb-header__actions">
            <div className="sb-lang-switch sb-chip-switch" role="group" aria-label="Language switch">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  className={lang === l.code ? 'is-active' : ''}
                  onClick={() => setLang(l.code)}
                  type="button"
                >
                  {l.label}
                </button>
              ))}
            </div>

            <a className="sb-header__phone" href={COMPANY.phoneHref}>
              <Icon name="phone" size={16} />
              {COMPANY.phone}
            </a>

            <button
              className={`sb-burger ${menuOpen ? 'is-open' : ''}`}
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              type="button"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* ============ MOBILE OVERLAY MENU ============ */}
      <div className={`sb-mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        <div className="sb-mobile-menu__top">
          <button className="sb-burger is-open" aria-label="Close menu" onClick={() => setMenuOpen(false)} type="button">
            <span /><span /><span />
          </button>
        </div>
        <nav className="sb-mobile-menu__nav" aria-label="Mobilná navigácia">
          {navItems.map((item, i) => (
            <a key={item.id} href={`#${item.id}`} onClick={handleNavClick(item.id)}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="sb-mobile-menu__footer">
          <a href={COMPANY.phoneHref}><Icon name="phone" size={18} />{COMPANY.phone}</a>
          <a href={COMPANY.emailHref}><Icon name="mail" size={18} />{COMPANY.email}</a>
          <div className="sb-social">
            <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" size={18} /></a>
            <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={18} /></a>
          </div>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="sb-hero" id="hero">
        <div className="sb-hero__sweep" aria-hidden="true" />
        <div className="container sb-hero__inner">
          <div className="eyebrow">{t.hero.eyebrow}</div>
          <h1 className="sb-hero__title">
            {t.hero.titleA} <em>{t.hero.titleHighlight}</em>
          </h1>
          <p className="sb-hero__subtitle">{t.hero.subtitle}</p>

          <div className="sb-hero__ctas">
            <a href="#kontakt" className="btn btn-primary is-pulsing" onClick={handleNavClick('kontakt')}>
              {t.hero.ctaPrimary}
              <Icon name="arrow-right" size={18} />
            </a>
            <a href="#galeria" className="btn btn-outline" onClick={handleNavClick('galeria')}>
              {t.hero.ctaSecondary}
            </a>
          </div>

          <div className="sb-hero__points">
            {t.hero.points.map((p, i) => (
              <Reveal key={i} className="sb-point">
                <span className="sb-point__icon"><Icon name={p.icon} /></span>
                <div>
                  <div className="sb-point__title">{p.title}</div>
                  <p className="sb-point__text">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hazard-stripe" aria-hidden="true" />

      {/* ============ SERVICES ============ */}
      <section className="section sb-services" id="sluzby">
        <div className="container">
          <Reveal className="section-head">
            <div className="eyebrow">{t.services.eyebrow}</div>
            <h2 className="section-title">{t.services.title}</h2>
            <p className="section-subtitle">{t.services.subtitle}</p>
          </Reveal>

          <div className="sb-services__grid">
            {t.services.items.map((s, i) => (
              <Reveal key={i} className="sb-service-card">
                <div className="sb-service-card__icon"><Icon name={s.icon} /></div>
                <h3 className="sb-service-card__title">{s.title}</h3>
                <p className="sb-service-card__text">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="section sb-gallery" id="galeria">
        <div className="container">
          <Reveal className="section-head">
            <div className="eyebrow">{t.gallery.eyebrow}</div>
            <h2 className="section-title">{t.gallery.title}</h2>
            <p className="section-subtitle">{t.gallery.subtitle}</p>
          </Reveal>

          <div className="sb-gallery__grid">
            {visibleGalleryItems.map((item) => (
              <div className="sb-gallery__item" key={item.id} style={{ animationDelay: `${(item.id % 10) * 40}ms` }}>
                <div className="sb-gallery__item-inner">
                  <Icon name="camera" size={26} />
                </div>
                <span className="sb-gallery__item-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="sb-gallery__toggle">
            <button className="btn btn-dark" onClick={() => setGalleryExpanded((v) => !v)} type="button">
              {galleryExpanded ? t.gallery.showLess : t.gallery.showMore}
              <Icon name={galleryExpanded ? 'chevron-up' : 'arrow-right'} size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="section sb-reviews" id="recenzie">
        <div className="container">
          <Reveal className="section-head">
            <div className="eyebrow">{t.reviews.eyebrow}</div>
            <h2 className="section-title section-title--light">{t.reviews.title}</h2>
            <p className="section-subtitle section-subtitle--light">{t.reviews.subtitle}</p>
          </Reveal>

          <div className="sb-reviews__grid">
            {t.reviews.items.map((r, i) => (
              <Reveal key={i} className="sb-review-card">
                <div className="sb-review__photos">
                  <div className="sb-review__photo">
                    <span>{t.reviews.before}</span>
                    <Icon name="camera" size={22} />
                  </div>
                  <div className="sb-review__photo">
                    <span>{t.reviews.after}</span>
                    <Icon name="camera" size={22} />
                  </div>
                </div>
                <Stars count={r.rating} />
                <p className="sb-review__text">&ldquo;{r.text}&rdquo;</p>
                <div className="sb-review__author">
                  <strong>{r.name}</strong>
                  <small>{r.location}</small>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT BANNER ============ */}
      <section className="sb-banner">
        <div className="container sb-banner__inner">
          <div className="sb-banner__row">
            <div>
              <h2 className="sb-banner__title">{t.banner.title}</h2>
              <p style={{ marginTop: 10, opacity: 0.92 }}>{t.banner.subtitle}</p>
            </div>
            <a className="sb-banner__phone" href={COMPANY.phoneHref}>
              <Icon name="phone" size={22} />
              {COMPANY.phone}
            </a>
          </div>
          <a href="#kontakt" className="btn btn-dark" onClick={handleNavClick('kontakt')}>
            {t.banner.cta}
            <Icon name="arrow-right" size={18} />
          </a>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="section sb-contact" id="kontakt">
        <div className="container">
          <Reveal className="section-head">
            <div className="eyebrow">{t.contact.eyebrow}</div>
            <h2 className="section-title">{t.contact.title}</h2>
            <p className="section-subtitle">{t.contact.subtitle}</p>
          </Reveal>

          <div className="sb-contact__grid">
            <Reveal>
              <form className="sb-form" onSubmit={handleSubmit}>
                <h3 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '1.1rem' }}>
                  {t.contact.formTitle}
                </h3>

                <div className="sb-field">
                  <label htmlFor="sb-name">{t.contact.labelName}</label>
                  <input id="sb-name" name="name" type="text" required placeholder={t.contact.placeholderName} />
                </div>
                <div className="sb-field">
                  <label htmlFor="sb-email">{t.contact.labelEmail}</label>
                  <input id="sb-email" name="email" type="email" required placeholder={t.contact.placeholderEmail} />
                </div>
                <div className="sb-field">
                  <label htmlFor="sb-phone">{t.contact.labelPhone}</label>
                  <input id="sb-phone" name="phone" type="tel" placeholder={t.contact.placeholderPhone} />
                </div>
                <div className="sb-field">
                  <label htmlFor="sb-message">{t.contact.labelMessage}</label>
                  <textarea id="sb-message" name="message" required placeholder={t.contact.placeholderMessage} />
                </div>

                {formState === 'sent' ? (
                  <div className="sb-form__success">{t.contact.success}</div>
                ) : (
                  <>
                    <button className="btn btn-primary btn-block" type="submit" disabled={formState === 'sending'}>
                      {formState === 'sending' ? t.contact.sending : t.contact.submit}
                      {formState !== 'sending' && <Icon name="arrow-right" size={18} />}
                    </button>
                    <p className="sb-form__note">{t.contact.note}</p>
                  </>
                )}
              </form>
            </Reveal>

            <Reveal>
              <div className="sb-contact-info">
                <div className="sb-contact-info__card">
                  <h3 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '1rem', marginBottom: 6 }}>
                    {t.contact.infoTitle}
                  </h3>

                  <div className="sb-contact-info__row">
                    <span className="icon-box"><Icon name="phone" size={18} /></span>
                    <div>
                      <small>{t.contact.phoneLabel}</small>
                      <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                    </div>
                  </div>
                  <div className="sb-contact-info__row">
                    <span className="icon-box"><Icon name="mail" size={18} /></span>
                    <div>
                      <small>{t.contact.emailLabel}</small>
                      <a href={COMPANY.emailHref}>{COMPANY.email}</a>
                    </div>
                  </div>
                  <div className="sb-contact-info__row">
                    <span className="icon-box"><Icon name="pin" size={18} /></span>
                    <div>
                      <small>{t.contact.addressLabel}</small>
                      <span className="value">{t.contact.address}</span>
                    </div>
                  </div>
                  <div className="sb-contact-info__row">
                    <span className="icon-box"><Icon name="clock" size={18} /></span>
                    <div>
                      <small>{t.contact.hoursLabel}</small>
                      <span className="value">{t.contact.hours}</span>
                    </div>
                  </div>

                  <div className="sb-social" style={{ marginTop: 20 }}>
                    <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" size={18} /></a>
                    <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={18} /></a>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: '1rem', marginBottom: 12 }}>
                    {t.contact.mapTitle}
                  </h3>
                  <div className="sb-map">
                    <iframe
                      src={COMPANY.mapEmbedSrc}
                      title="Mapa"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="sb-footer">
        <div className="hazard-stripe" aria-hidden="true" />
        <div className="container sb-footer__top">
          <div className="sb-footer__brand">
            <div className="sb-logo">
              <span className="sb-logo__mark"><Icon name="house" size={18} /></span>
              <span className="sb-logo__text">{COMPANY.name} <span>{COMPANY.suffix}</span></span>
            </div>
            <p>{t.footer.tagline}</p>
          </div>

          <div className="sb-footer__col">
            <h4>{t.footer.navTitle}</h4>
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={handleNavClick(item.id)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sb-footer__col">
            <h4>{t.footer.servicesTitle}</h4>
            <ul>
              {t.services.items.slice(0, 5).map((s, i) => (
                <li key={i}><a href="#sluzby" onClick={handleNavClick('sluzby')}>{s.title}</a></li>
              ))}
            </ul>
          </div>

          <div className="sb-footer__col">
            <h4>{t.footer.contactTitle}</h4>
            <ul>
              <li><a href={COMPANY.phoneHref}>{COMPANY.phone}</a></li>
              <li><a href={COMPANY.emailHref}>{COMPANY.email}</a></li>
              <li><span>{t.contact.address}</span></li>
            </ul>
            <div className="sb-social" style={{ marginTop: 14 }}>
              <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" size={18} /></a>
              <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={18} /></a>
            </div>
          </div>
        </div>

        <div className="container sb-footer__bottom">
          <div className="sb-footer__bottom-row">
            <span>© {new Date().getFullYear()} {COMPANY.name} {COMPANY.suffix}. {t.footer.rights}</span>
            <span>SK / EN</span>
          </div>
        </div>
      </footer>

      <button
        className={`sb-to-top ${showTop ? 'is-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        type="button"
      >
        <Icon name="chevron-up" size={20} />
      </button>
    </div>
  );
}