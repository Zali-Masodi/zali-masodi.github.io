import React from 'react'

const Header: React.FC = () => {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        background: '#eee',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <nav>
        <a href="#home" style={{ margin: '0 1rem' }}>Home</a>
        <a href="#about" style={{ margin: '0 1rem' }}>About</a>
        <a href="#products" style={{ margin: '0 1rem' }}>Products</a>
        <a href="#contact" style={{ margin: '0 1rem' }}>Contact</a>
      </nav>

      <div>
        <a href="index_DE.html" style={{ marginLeft: '1rem' }}>DE</a>
      </div>
    </header>
  )
}

export default Header
