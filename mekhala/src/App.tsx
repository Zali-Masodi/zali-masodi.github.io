import React, { useState } from 'react'
import Header from './Components/Header'
import Section from './Components/Section'

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
  const [lang, setLang] = useState<Language>('EN')

  return (
    <div>
      <Header lang={lang} setLang={setLang} />
      <Section id="home" title="Home">{content[lang].home}</Section>
      <Section id="about" title="About">{content[lang].about}</Section>
      <Section id="products" title="Products">{content[lang].products}</Section>
      <Section id="contact" title="Contact">{content[lang].contact}</Section>
    </div>
  )
}

export default App
