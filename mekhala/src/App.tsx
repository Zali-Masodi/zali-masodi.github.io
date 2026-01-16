import React from 'react'
import Header from './components/header'
import Section from './components/section'

const App: React.FC = () => {
  return (
    <div>
      <Header />

      <Section id="home" title="Home">
        <p>Welcome to our showcase site!</p>
      </Section>

      <Section id="about" title="About">
        <p>We are a company that does amazing things.</p>
      </Section>

      <Section id="products" title="Products">
        <p>Check out our fantastic products!</p>
      </Section>

      <Section id="contact" title="Contact">
        <p>Get in touch with us.</p>
      </Section>
    </div>
  )
}

export default App
