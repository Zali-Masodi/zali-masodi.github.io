import React from 'react'
import Section from './Section'

type Language = 'EN' | 'TH'

interface ContactProps {
  lang: Language
}

const ContactSection: React.FC<ContactProps> = ({ lang }) => {
  return (
    <Section id="contact" title={lang === 'EN' ? 'Contact' : 'ติดต่อเรา'} style={{minHeight: '30vw', paddingTop: '5vw', paddingBottom: '30px'}}>
      {/* Heading */}
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>
        {lang === 'EN' ? 'Get in touch with us' : 'ติดต่อเรา'}
      </h2>

      {/* Card container */}
      <div
        style={{
          maxWidth: '500px',
          width: '90%',
          margin: '0 auto',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >
        {/* Social media logos */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '1.5rem',
          }}
        >
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/tiktokLogo.png"
              alt="TikTok"
              style={{ width: '40px', height: '40px' }}
            />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/facebookLogo.png"
              alt="Facebook"
              style={{ width: '40px', height: '40px' }}
            />
          </a>
          <a href="https://line.me" target="_blank" rel="noopener noreferrer">
            <img
              src="/lineLogo.png"
              alt="Line"
              style={{ width: '40px', height: '40px' }}
            />
          </a>
        </div>

        {/* Contact info */}
        <div style={{ fontSize: '1.1rem', color: '#555' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            📞 {lang === 'EN' ? '+66 123 456 789' : '+66 123 456 789'}
          </p>
          <p>
            ✉️ {lang === 'EN' ? 'info@yourflowershop.com' : 'info@yourflowershop.com'}
          </p>
        </div>
      </div>
    </Section>
  )
}

export default ContactSection
