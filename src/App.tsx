import heroImg from './assets/hero.png'
import './App.css'

function App() {
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
      title: 'Restaurant QR Ordering System',
      description:
        'Multi-tenant real-time ordering system with QR-based table sessions and SignalR updates.',
      tech: ['.NET 8', 'SignalR', 'React', 'PostgreSQL'],
    },
    {
      title: 'AI-Powered HR Hiring Platform',
      description:
        'Full-stack recruitment platform with AI candidate calling and automated deployment pipelines.',
      tech: ['Next.js', '.NET 8', 'OAuth', 'PostgreSQL'],
    },
    {
      title: 'Bitcoin Lending Platform',
      description:
        'Designed decentralized lending architecture with Solidity smart contracts and Chainlink oracles.',
      tech: ['Solidity', 'React', 'Node.js', 'AWS'],
    },
  ]

  return (
    <main className="app">
      <section className="hero">
        <div className="hero-left">
          <img src={heroImg} alt="Ramon Zalmai Masodi" />
        </div>

        <div className="hero-right">
          <span className="badge">Full-Stack Software Developer</span>

          <h1>Ramon Zalmai Masodi</h1>

          <p className="intro">
            Full-Stack Software Developer with 3+ years of experience building
            scalable logistics and enterprise systems using .NET, React, and
            cloud technologies. Experienced in microservices, DevOps, CI/CD,
            and production-ready architectures.
          </p>

          <div className="info-grid">
            <div className="info-card">
              <span>Email</span>
              <strong>zalimasodi@gmail.com</strong>
            </div>

            <div className="info-card">
              <span>Phone</span>
              <strong>+421 949 490 488</strong>
            </div>

            <div className="info-card">
              <span>Location</span>
              <strong>Slovakia • Remote</strong>
            </div>

            <div className="info-card">
              <span>Experience</span>
              <strong>3+ Years</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Technical Skills</h2>
          <p>Main technologies and engineering practices</p>
        </div>

        <div className="skills-layout">
          <div className="skill-card">
            <h3>Languages</h3>
            <p>C#, JavaScript, TypeScript</p>
          </div>

          <div className="skill-card">
            <h3>Frameworks</h3>
            <p>.NET 8, React, MudBlazor, Next.js</p>
          </div>

          <div className="skill-card">
            <h3>Databases</h3>
            <p>SQL Server, PostgreSQL, MySQL</p>
          </div>

          <div className="skill-card">
            <h3>Cloud & DevOps</h3>
            <p>Azure, Docker, GitLab CI/CD, Jenkins</p>
          </div>

          <div className="skill-card">
            <h3>Architecture</h3>
            <p>Microservices, REST APIs, CQRS, MVVM</p>
          </div>

          <div className="skill-card">
            <h3>Tools</h3>
            <p>Git, GitHub, Postman, Power BI, Sourcetree</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Work Experience</h2>
          <p>Professional experience and engineering contributions</p>
        </div>

        <div className="experience-list">
          {experiences.map((job, index) => (
            <div className="experience-card" key={index}>
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
                {job.achievements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <div className="tech-tags">
                {job.tech.map((tech, i) => (
                  <span key={i}>{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Projects</h2>
          <p>Freelance and independent development work</p>
        </div>

        <div className="project-layout">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <h3>{project.title}</h3>

              <p>{project.description}</p>

              <div className="tech-tags">
                {project.tech.map((tech, i) => (
                  <span key={i}>{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section bottom-grid">
        <div className="extra-card">
          <h2>Education</h2>

          <div className="extra-item">
            <strong>BSc, Software Engineering</strong>
            <span>Fontys University of Applied Sciences</span>
            <p>Venlo, Netherlands • 2019 – 2024</p>
          </div>

          <div className="extra-item">
            <strong>Minor Study Abroad, Computer Science</strong>
            <span>Tatung University</span>
            <p>Taipei, Taiwan • 2023</p>
          </div>
        </div>

        <div className="extra-card">
          <h2>Languages</h2>

          <div className="language-item">
            <span>Slovak</span>
            <strong>Native</strong>
          </div>

          <div className="language-item">
            <span>English</span>
            <strong>C1 • IELTS</strong>
          </div>

          <div className="language-item">
            <span>Mandarin Chinese</span>
            <strong>A2</strong>
          </div>

          <div className="language-item">
            <span>German</span>
            <strong>Beginner</strong>
          </div>
        </div>

        <div className="extra-card">
          <h2>Certifications</h2>

          <ul className="cert-list">
            <li>VCA-VOL (Valid until 13.11.2034)</li>
            <li>Certified Ethereum Developer</li>
            <li>International Driving Permit • B Type</li>
          </ul>

          <h2 className="hobbies-title">Interests</h2>

          <p>Travelling, Sports, Cooking</p>
        </div>
      </section>
    </main>
  )
}

export default App