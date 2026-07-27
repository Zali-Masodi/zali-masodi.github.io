import { useEffect, useRef, useState } from "react";
import "./Portfolio.css";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const NAV_SECTIONS = ["about", "skills", "experience", "projects", "education", "contact"];

const skills = [
  { cat: "Languages", name: "Programming", tags: ["C#", "JavaScript", "TypeScript"] },
  { cat: "Frameworks", name: "Frontend & Backend", tags: [".NET 8", "React", "Next.js", "MudBlazor", "Razor"] },
  { cat: "Databases", name: "Data Storage", tags: ["SQL Server", "PostgreSQL", "MySQL", "MongoDB", "Firestore"] },
  { cat: "Cloud & DevOps", name: "Infrastructure", tags: ["Azure", "AWS", "Docker", "GitLab CI/CD", "Jenkins", "Azure DevOps"] },
  { cat: "Architecture", name: "Patterns", tags: ["Microservices", "REST APIs", "CQRS", "MVVM", "Unit Testing", "Agile"] },
  { cat: "Tools", name: "Dev Toolchain", tags: ["Git/GitHub", "Postman", "Power BI", "SignalR", "Entity Framework"] },
];

const experience = [
  {
    id: "veloce",
    title: "Full-Stack Developer",
    company: "Veloce Liefert GmbH",
    period: "08/2025 – 04/2026",
    location: "Vienna, Austria",
    bullets: [
      "Developed and extended a .NET-based logistics platform, adding automated email notifications, REST APIs, and webhook integrations",
      "Enhanced Android delivery application with parcel redirection and real-time customer feedback features",
      "Designed and implemented shipment tracking pages across multiple business units, supporting scalable multi-tenant architecture",
      "Integrated multiple payment methods (Mollie, cash on delivery, invoicing), improving checkout flexibility",
      "Built package scanning and return workflows, reducing manual processing",
      "Implemented real-time customer comments functionality within shipment tracking pages, enabling direct communication and reducing the need for email and phone support by nearly 90%",
    ],
    tech: [".NET 8", "React", "SQL Server", "MySQL", "Android"],
    reference: { label: "📄 Download Reference Letter", file: "/Zeugnis_Ramon.pdf" },
  },
  {
    id: "actemium",
    title: "Full-Stack Developer",
    company: "Actemium",
    period: "10/2024 – 08/2025",
    location: "Herten, Netherlands",
    bullets: [
      "Developed and maintained manufacturing execution systems (MES) with a TrakSYS frontend and .NET microservices backend, improving data visibility across production lines",
      "Implemented RESTful APIs in .NET for real-time communication between MES modules and SQL databases (SQL Server/MySQL)",
      "Built automated unit tests to validate core business logic and ensure maintainability",
      "Integrated Power BI dashboards with MES data streams, providing real-time reporting for project managers and production supervisors",
      "Supported production environments during system updates and malfunctions, reducing downtime"
    ],
    tech: [".NET 8", "TrakSYS", "Microsoft Azure", "Power BI", "SQL Server", "MySQL"],
  },
  {
    id: "shipcloud",
    title: "Full-Stack Developer",
    company: "Shipcloud GmbH",
    period: "09/2023 – 06/2024",
    location: "Venlo, Netherlands",
    bullets: [
      "Designed and deployed scalable carrier integration solutions with .NETbackend and a Razor frontend, improving maintainability and system performance",
      "Implemented event-driven microservices in .NET for processing shipping orders and booking requests, reducing latency and manual intervention",
      "Built dashboards for monitoring carrier integrations, providing real-time visibility into order flows and errors",
      "Automated testing and integration pipelines for microservices, ensuring reliable deployments",
      "Streamlined API integrations with logistics partners, reducing onboarding time for new carriers"
    ],
    tech: [".NET", "Razor", "PostgreSQL", "GitLab CI/CD", "Postman"],
  },
  // {
  //   id: "actief",
  //   title: "Junior Full-Stack Developer",
  //   company: "Actief Werkt",
  //   period: "03/2023 – 08/2023",
  //   location: "Remote",
  //   bullets: [
  //     "Designed and developed a full-stack employee management system for attendance and shift data tracking.",
  //     "Built React frontend for real-time dashboards with attendance logs and production KPIs.",
  //     "Implemented secure REST API backend (.NET 8) with optimised PostgreSQL schemas.",
  //   ],
  //   tech: ["React", ".NET 8", "REST API", "PostgreSQL", "Azure DevOps"],
  // },
  {
    id: "canon",
    title: "DevOps Engineer",
    company: "Canon Production Printing",
    period: "09/2022 – 02/2023",
    location: "Venlo, Netherlands",
    bullets: [
      "Design and development of a security permissions reporting platform for Azure DevOps Server",
      "Reverse engineering of Azure DevOps Server API calls to extract and aggregate security and access control data",
      "Collection and consolidation of user and permission information from Active Directory and Azure DevOps environments",
      "Development of centralized dashboards with advanced filtering and search capabilities for security auditing and access reviews",
      "Creation of Power BI reports and automated data transformation pipelines using Power Query",
      "End-to-end project ownership, including requirements analysis, technology stack selection, architecture design, implementation, testing, and documentation"
    ],
    tech: ["Azure DevOps", "Power BI", "Power Query", "Active Directory", "Browser DevTools"],
  },
  {
    id: "fiserv",
    title: "DevOps Engineer",
    company: "Fiserv Inc.",
    period: "06/2021 – 09/2022",
    location: "Slovakia · Remote, Part-time",
    bullets: [
      "Application deployment and environment management in AWS",
      "Container deployment and administration using Docker",
      "Configuration and maintenance of CI/CD pipelines with Jenkins and GitLab",
      "Creation and modification of deployment and configuration files",
      "Development and maintenance of automation scripts using Bash and JavaScript",
      "Support of frontend development activities using React",

    ],
    tech: ["AWS", "Docker", "Jenkins", "GitLab", "WSL2", "YAML", "React"],
  },
];

const projects = [
  {
    year: "2026 · In Progress",
    title: "Restaurant QR Ordering System",
    desc: "Real-time restaurant ordering platform — customers scan QR codes at their table and place orders collaboratively. Multi-tenant architecture with full data isolation.",
    bullets: ["Multi-user table sessions via SignalR", "Admin panel for menus, tables, and staff", "Backend auth with restaurant ID extraction"],
    tech: [".NET 8", "SignalR", "PostgreSQL", "React"],
  },
  {
    year: "2025 · Freelance",
    title: "AI-Powered HR Hiring Platform",
    desc: "Full-stack HR platform with AI-automated candidate calling, job pipeline management, and cross-system communication with a separate AI calling service.",
    bullets: ["Next.js frontend + C# .NET 8 backend", "Automated CI/CD to production Debian server", "OAuth with Google · Entity Framework + PostgreSQL"],
    tech: ["Next.js", ".NET 8", "PostgreSQL", "Debian", "OAuth"],
  },
  {
    year: "2025 · Freelance",
    title: "Bitcoin Lending & Borrowing Platform",
    desc: "Decentralised P2P design for lending USDC and borrowing against Bitcoin collateral with automated liquidation and Chainlink oracle price feeds.",
    bullets: ["Smart contracts on Rootstock (Solidity / OpenZeppelin)", "Hybrid on-chain/off-chain Node.js + MongoDB backend", "OpenZeppelin Defender + AWS infrastructure"],
    tech: ["Solidity", "Rootstock", "Chainlink", "Node.js", "MongoDB"],
  },
  {
    year: "2023 · Freelance",
    title: "Logistics Emissions Calculation API",
    desc: "REST API for calculating carbon emissions in logistics based on the GLEC Framework — processing transport modes, distances, and fuel consumption.",
    bullets: ["TypeScript + Firebase Functions", "Firestore for schema-flexible storage", "Postman-documented endpoint suite"],
    tech: ["TypeScript", "Firebase", "Firestore", "REST API"],
  },
];

const education = [
  { period: "2019 – 2024", degree: "BSc, Software Engineering", school: "Fontys University of Applied Sciences", location: "Venlo, Netherlands", note: "" },
  { period: "2023 · Study Abroad", degree: "Computer Science Minor", school: "Tatung University", location: "Taipei, Taiwan", note: "Mandarin Chinese · Final exam: 96/100" },
];

const languages = [
  { name: "Slovak", level: "Mother tongue", pct: 100 },
  { name: "English", level: "C1 · IELTS Certificate", pct: 90 },
  { name: "Mandarin Chinese", level: "A2 · Tatung Univ. (96/100)", pct: 30 },
  { name: "German", level: "Beginner · In Progress", pct: 15 },
];

const certs = [
  {
    label: "🔷 Certified Ethereum Developer",
    url: "https://certificates.blockchain-council.org/12f0d8e5-dd9b-4507-8898-23f363ae8c01#acc.xKLiFunV"
  },
  {
    label: "🛡 VOL-VCA",
    url: "/certs/VOL-VCA.pdf"
  },
  {
    label: "🚗 International Driving Permit – Type B",
    url: "#"
  }
];

/* ─────────────────────────────────────────
   APP
───────────────────────────────────────── */
export default function Portfolio() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("about");

  /* Cursor glow */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* Active nav section via scroll position */
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.25;
      let current = NAV_SECTIONS[0];
      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            const bar = e.target.querySelector<HTMLElement>(".lang-fill");
            if (bar) setTimeout(() => { bar.style.width = bar.dataset.width ?? "0%"; }, 300);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Counter animation */
  useEffect(() => {
    const stats = [
      { val: 3, suffix: "+" },
      { val: 6, suffix: "" },
      { val: 5, suffix: "+" },
      { val: 90, suffix: "%" },
    ];
    const els = document.querySelectorAll<HTMLElement>(".stat-num");
    const bar = document.querySelector(".stats-bar");
    if (!bar) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        els.forEach((el, i) => {
          let c = 0;
          const step = stats[i].val / 38;
          const iv = setInterval(() => {
            c = Math.min(c + step, stats[i].val);
            el.textContent = Math.round(c) + stats[i].suffix;
            if (c >= stats[i].val) clearInterval(iv);
          }, 28);
        });
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(bar);
    return () => io.disconnect();
  }, []);

  /* 3-D tilt */
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".tilt");
    const cleanup: (() => void)[] = [];
    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-4px) perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      };
      const onLeave = () => { card.style.transform = ""; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanup.push(() => { card.removeEventListener("mousemove", onMove); card.removeEventListener("mouseleave", onLeave); });
    });
    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="bg-mesh" />
      <div className="bg-grain" />
      <div id="cursor-glow" ref={cursorRef} />

      {/* ── NAV ── */}
      <nav>
        <div className="nav-pill">
          <div className="nav-logo">RZM</div>
          <ul className="nav-links">
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={activeSection === id ? "active" : ""}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="about">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Full-Stack Software Developer · Slovakia · Open to Remote
          </div>
          <h1 className="hero-name">
            <span className="line1">Ramon Zalmai</span>
            <span className="line2">Masodi</span>
          </h1>
          <div className="hero-rule">
            <span className="hero-rule-line" />
            <span className="hero-role">C# · .NET · React · Logistics Systems</span>
          </div>
          <p className="hero-desc">
            Full-Stack Developer with 3+ years building scalable logistics and enterprise
            systems. Strong focus on clean architecture, performance, and systems that matter.
          </p>
          <div className="hero-contact">
            <a href="tel:+421949490488" className="c-pill">📞 +421 949 490 488</a>
            <a href="mailto:zalimasodi@gmail.com" className="c-pill">✉ zalimasodi@gmail.com</a>
            <span className="c-pill">📍 Slovakia · Remote</span>
          </div>
          <div className="hero-cta">
            <a href="#experience" className="btn-primary">View Experience</a>
            <a href="#contact" className="btn-ghost">Get in Touch</a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="container">
        <div className="stats-bar reveal">
          {[
            { num: "3+", label: "Years of Experience" },
            { num: "5", label: "Companies" },
            { num: "4+", label: "Personal Projects" },
            { num: "90%", label: "Support Reduction @ Veloce" },
          ].map((s) => (
            <div className="stat-pane" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SKILLS ── */}
      <section id="skills">
        <div className="container">
          <div className="section-eyebrow reveal">Core Competencies</div>
          <h2 className="section-title reveal d1">Technical Skills</h2>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <div className={`skill-card glass tilt reveal d${(i % 3) + 1}`} key={s.cat}>
                <div className="sk-label">{s.cat}</div>
                <div className="sk-name">{s.name}</div>
                <div className="sk-tags">{s.tags.map((t) => <span className="sk-tag" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience">
        <div className="container">
          <div className="section-eyebrow reveal">Career History</div>
          <h2 className="section-title reveal d1">Work Experience</h2>
          <div className="timeline">
            {experience.map((ex, i) => (
              <div className={`tl-item reveal d${(i % 3) + 1}`} key={ex.id}>
                <div className="tl-dot" />
                <div className="exp-card glass tilt">
                  <div className="exp-head">
                    <div>
                      <div className="exp-title">{ex.title}</div>
                      <div className="exp-company">{ex.company}</div>
                    </div>
                    <div className="exp-meta">
                      <div className="exp-period">{ex.period}</div>
                      <div className="exp-location">{ex.location}</div>
                    </div>
                  </div>
                  <ul className="exp-list">{ex.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                  <div className="tech-tags">{ex.tech.map((t) => <span className="tech-tag" key={t}>{t}</span>)}</div>
                  {"reference" in ex && ex.reference && (
                    <a href={ex.reference.file} download className="btn-download">
                      {ex.reference.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS 2×2 ── */}
      <section id="projects">
        <div className="container">
          <div className="section-eyebrow reveal">Side Work</div>
          <h2 className="section-title reveal d1">Personal Projects</h2>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div className={`proj-card glass tilt reveal d${(i % 2) + 1}`} key={p.title}>
                <div className="proj-year">{p.year}</div>
                <div className="proj-title">{p.title}</div>
                <div className="proj-desc">{p.desc}</div>
                <ul className="exp-list" style={{ marginBottom: 14 }}>{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                <div className="tech-tags">{p.tech.map((t) => <span className="tech-tag" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION TIMELINE ── */}
      <section id="education">
        <div className="container">
          <div className="section-eyebrow reveal">Academic Background</div>
          <h2 className="section-title reveal d1">Education</h2>
          <div className="edu-timeline">
            {education.map((ed, i) => (
              <div className={`edu-tl-item reveal d${i + 1}`} key={ed.school}>
                <div className="edu-tl-dot" />
                <div className="edu-card glass tilt">
                  <div className="edu-year">{ed.period}</div>
                  <div className="edu-deg">{ed.degree}</div>
                  <div className="edu-school">{ed.school}</div>
                  <div className="edu-loc">{ed.location}</div>
                  {ed.note && <div className="edu-note">{ed.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LANGUAGES & CERTS ── */}
      <section>
        <div className="container">
          <div className="section-eyebrow reveal">Communication</div>
          <h2 className="section-title reveal d1">Languages</h2>
          <div className="lang-grid" style={{ marginBottom: 56 }}>
            {languages.map((l, i) => (
              <div className={`lang-card glass reveal d${i + 1}`} key={l.name}>
                <div className="lang-name">{l.name}</div>
                <div className="lang-level">{l.level}</div>
                <div className="lang-bar">
                  <div className="lang-fill" data-width={`${l.pct}%`} style={{ width: 0 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="section-eyebrow reveal">Certifications &amp; More</div>
          <div className="certs-row reveal d1">
            {certs.map((c) =>
              c.url && c.url !== "#" ? (
                <a
                  key={c.label}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-pill cert-link"
                >
                  {c.label}
                </a>
              ) : (
                <span key={c.label} className="cert-pill cert-disabled">
                  {c.label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <div className="container">
          <div className="section-eyebrow reveal">Get in Touch</div>
          <h2 className="section-title reveal d1">Let's Work Together</h2>
          <div className="contact-panel glass reveal d2">
            <p className="contact-desc">
              I'm open to remote opportunities and exciting engineering challenges.
              Feel free to reach out via email or phone.
            </p>
            <div className="contact-btns">
              <a href="mailto:zalimasodi@gmail.com" className="btn-primary">✉ zalimasodi@gmail.com</a>
              <a href="tel:+421949490488" className="btn-ghost">📞 +421 949 490 488</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          © 2026 Ramon Zalmai Masodi · Slovakia · Open to Remote
        </div>
      </footer>
    </>
  );
}