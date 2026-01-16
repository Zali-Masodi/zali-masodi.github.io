import React from 'react'

interface HeaderProps {
  lang: 'EN' | 'DE'
  setLang: (lang: 'EN' | 'DE') => void
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee', position: 'sticky', top: 0, zIndex: 1000 }}>
      <nav>
        <a href="#home" style={{ margin: '0 1rem' }}>Home</a>
        <a href="#about" style={{ margin: '0 1rem' }}>About</a>
        <a href="#products" style={{ margin: '0 1rem' }}>Products</a>
        <a href="#contact" style={{ margin: '0 1rem' }}>Contact</a>
      </nav>
      <div>
        <button onClick={() => setLang('EN')} disabled={lang === 'EN'}>EN</button>
        <button onClick={() => setLang('DE')} disabled={lang === 'DE'}>DE</button>
      </div>
    </header>
  )
}

export default Header
