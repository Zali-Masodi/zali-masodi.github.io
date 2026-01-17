import React, { useState } from 'react'

interface HeaderProps {
  lang: 'EN' | 'TH'
  setLang: (lang: 'EN' | 'TH') => void
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { id: 'home', label: lang === 'EN' ? 'Home' : 'หน้าหลัก' },
    { id: 'about', label: lang === 'EN' ? 'About' : 'เกี่ยวกับเรา' },
    { id: 'products', label: lang === 'EN' ? 'Products' : 'สินค้า' },
    { id: 'contact', label: lang === 'EN' ? 'Contact' : 'ติดต่อเรา' },
  ]

  const flagStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  }

  const disabledFlagStyle: React.CSSProperties = {
    ...flagStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  }

  return (
    <header className="header">
      {/* Desktop Nav + Flags */}
      <nav className="desktop-nav">
        <div className="nav-links">
          {navLinks.map(link => (
            <a key={link.id} href={`#${link.id}`}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-flags">          
          <span
            style={lang === 'TH' ? disabledFlagStyle : flagStyle}
            onClick={() => setLang('TH')}
          >
            🇹🇭
          </span>
          <span
            style={lang === 'EN' ? disabledFlagStyle : flagStyle}
            onClick={() => setLang('EN')}
          >
            🇬🇧
          </span>
        </div>
      </nav>

      {/* Hamburger for mobile */}
      <div
        className="mobile-nav-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="mobile-overlay">
          <div className="overlay-content">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="overlay-flags">
              <span
                style={lang === 'EN' ? disabledFlagStyle : flagStyle}
                onClick={() => { setLang('EN'); setMenuOpen(false) }}
              >
                🇬🇧
              </span>
              <span
                style={lang === 'TH' ? disabledFlagStyle : flagStyle}
                onClick={() => { setLang('TH'); setMenuOpen(false) }}
              >
                🇹🇭
              </span>
            </div>
          </div>

          {/* Clicking outside content closes menu */}
          <div
            className="overlay-background"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  )
}

export default Header
