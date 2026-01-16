import React, { useState } from 'react'
import Header from './components/header'
import Section from './components/section'

type Language = 'EN' | 'DE'

const content = {
  EN: {
    home: 'Welcome to our showcase site!',
    about: 'We are a company that does amazing things.',
    products: 'Check out our fantastic products!',
    contact: 'Get in touch with us.'
  },
  DE: {
    home: 'Willkommen auf unserer Showcase-Seite!',
    about: 'Wir sind ein Unternehmen, das großartige Dinge macht.',
    products: 'Schauen Sie sich unsere fantastischen Produkte an!',
    contact: 'Kontaktieren Sie uns.'
  }
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN') // default language

  return (
    <div>
      <Header lang={lang} setLang={setLang} />

      <Section id="home" title="Home">
        <p>{content[lang].home}</p>
      </Section>

      <Section id="about" title="About">
        <p>{content[lang].about}</p>
      </Section>

      <Section id="products" title="Products">
        <p>{content[lang].products}</p>
      </Section>

      <Section id="contact" title="Contact">
        <p>{content[lang].contact}</p>
      </Section>
    </div>
  )
}

export default App
