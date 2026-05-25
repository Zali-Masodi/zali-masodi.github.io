import heroImg from './assets/hero.png'
import './App.css'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // ✅ CUBE STATE (ADDED ONLY)
  const [activeProject, setActiveProject] = useState<number | null>(null)

  const [rotation, setRotation] = useState(0)
  const [activeFace, setActiveFace] = useState(0)

  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    const mouseMove = (e: globalThis.MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener('mousemove', mouseMove)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
    }
  }, [])

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const experiences = [
    {
      company: 'Veloce Liefert GmbH',
      role: 'Full-Stack Developer',
      period: '08/2025 – 04/2026',
      location: 'Vienna, Austria',
      achievements: [
        'Developed and extended a .NET-based logistics platform with REST APIs and webhook integrations.',
        'Built scalable shipment tracking pages supporting multi-tenant architecture.',
        'Integrated Mollie, invoicing, and cash-on-delivery payment methods.',
        'Implemented real-time customer communication features reducing support requests by nearly 90%.',
        'Enhanced Android delivery application with parcel redirection and live feedback features.',
      ],
      tech: ['.NET 8', 'React', 'SQL Server', 'MySQL', 'Android'],
    },
    {
      company: 'Actemium',
      role: 'Medior Full-Stack Developer',
      period: '10/2024 – 08/2025',
      location: 'Herten, Netherlands',
      achievements: [
        'Developed MES systems with TrakSYS frontend and .NET microservices backend.',
        'Built RESTful APIs connecting MES modules with SQL databases.',
        'Integrated Power BI dashboards for real-time manufacturing reporting.',
        'Implemented automated unit testing and improved production reliability.',
      ],
      tech: ['.NET 8', 'Azure', 'Power BI', 'SQL Server', 'MySQL'],
    },
    {
      company: 'Shipcloud GmbH',
      role: 'Medior Full-Stack Developer',
      period: '09/2023 – 06/2024',
      location: 'Venlo, Netherlands',
      achievements: [
        'Designed scalable carrier integration systems with .NET and Razor.',
        'Built event-driven microservices for shipping order processing.',
        'Created dashboards for monitoring carrier integrations and order flows.',
        'Automated testing and CI/CD deployment pipelines.',
      ],
      tech: ['.NET', 'Razor', 'PostgreSQL', 'GitLab CI/CD'],
    },
    {
      company: 'Actief Werkt',
      role: 'Junior Full-Stack Developer',
      period: '03/2023 – 08/2023',
      location: 'Remote',
      achievements: [
        'Built a full-stack employee management system for attendance and production tracking.',
        'Developed React dashboards displaying KPIs and production metrics.',
        'Designed secure REST APIs and optimized PostgreSQL schemas.',
        'Implemented modular architecture and automated reporting systems.',
      ],
      tech: ['React', '.NET 8', 'REST API', 'PostgreSQL'],
    },
  ]

  const projects = [
    {
      title: 'QR Ordering System',
      description: 'Real-time restaurant ordering with QR + SignalR',
      tech: ['.NET 8', 'React', 'PostgreSQL'],
    },
    {
      title: 'AI HR Platform',
      description: 'AI recruitment + automated calling system',
      tech: ['Next.js', '.NET', 'OpenAI'],
    },
    {
      title: 'Bitcoin Lending',
      description: 'Smart contract lending system on Ethereum',
      tech: ['Solidity', 'Node.js', 'AWS'],
    },
    {
      title: 'Logistics SaaS',
      description: 'Multi-tenant shipment tracking platform',
      tech: ['.NET 8', 'React', 'Azure'],
    },
  ]

  const rotateLeft = () => {
    setRotation((r) => r - 90)
    setActiveFace((p) => (p + 1) % 4)
  }

  const rotateRight = () => {
    setRotation((r) => r + 90)
    setActiveFace((p) => (p + 3) % 4)
  }

  return (
    <main className="app">

      {/* CURSOR GLOW */}
      <div
        className="cursor-glow"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* HERO (UNCHANGED) */}
      <section className="hero">
        <motion.div className="hero-left" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
          <img src={heroImg} alt="Ramon Zalmai Masodi" />
        </motion.div>

        <motion.div className="hero-right" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.span className="badge" variants={fadeUp}>Full-Stack Software Developer</motion.span>
          <motion.h1 variants={fadeUp}>Ramon Zalmai Masodi</motion.h1>
          <motion.p className="intro" variants={fadeUp}>
            Full-Stack Software Developer with 3+ years of experience building scalable enterprise systems using .NET, React, and cloud technologies.
          </motion.p>
        </motion.div>
      </section>

      {/* SKILLS (UNCHANGED) */}
      <section className="section">
        <motion.div className="section-title">
          <h2>Technical Skills</h2>
          <p>Main technologies and engineering practices</p>
        </motion.div>

        <div className="skills-layout">
          {[
            { title: 'Languages', text: 'C#, JavaScript, TypeScript' },
            { title: 'Frameworks', text: '.NET 8, React, MudBlazor, Next.js' },
            { title: 'Databases', text: 'SQL Server, PostgreSQL, MySQL' },
            { title: 'Cloud & DevOps', text: 'Azure, Docker, GitLab CI/CD, Jenkins' },
            { title: 'Architecture', text: 'Microservices, REST APIs, CQRS, MVVM' },
            { title: 'Tools', text: 'Git, GitHub, Postman, Power BI, Sourcetree' },
          ].map((skill, i) => (
            <motion.div key={i} className="skill-card" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3>{skill.title}</h3>
              <p>{skill.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE (UNCHANGED) */}
      <section className="section">
        <motion.div className="section-title">
          <h2>Work Experience</h2>
          <p>Professional experience and engineering contributions</p>
        </motion.div>

        <div className="experience-list">
          {experiences.map((job, i) => (
            <motion.div key={i} className="experience-card">
              <div className="experience-header">
                <div>
                  <h3>{job.role}</h3>
                  <h4>{job.company}</h4>
                </div>
                <div className="experience-meta">
                  <span>{job.period}</span>
                  <span>{job.location}</span>
                </div>
              </div>

              <ul>
                {job.achievements.map((a, j) => (
                  <li key={j}>{a}</li>
                ))}
              </ul>

              <div className="tech-tags">
                {job.tech.map((t, k) => (
                  <span key={k}>{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ PROJECT CUBE (ADDED ONLY HERE) */}
      <section className="section">
        <div className="section-title">
          <h2>Projects</h2>
          <p>Interactive cube (controlled)</p>
        </div>

        <div className="cube-controls">
          <button onClick={rotateLeft}>◀</button>
          <span>{activeFace + 1} / 4</span>
          <button onClick={rotateRight}>▶</button>
        </div>

        {isZoomed && (
          <button className="close-btn" onClick={() => setIsZoomed(false)}>
            ✕
          </button>
        )}

        <div className="cube-scene">
          <div
            className="cube"
            style={{
              transform: `
  scale(${isZoomed ? 1.6 : 1})
  rotateY(${rotation}deg)
`,
            }}
          >
            {projects.map((p, i) => (
              <div
                key={i}
                className={`cube-face face-${i}`}
                onClick={() => {
                  setActiveProject(i)
                  setIsZoomed(true)
                }}
              >
                <h3>{p.title}</h3>

                {isZoomed && (
                  <div className="cube-details">
                    <p>{p.description}</p>

                    <div className="tech-tags">
                      {p.tech.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


      </section>

    </main>
  )
}

export default App