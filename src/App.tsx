import React, { useState } from 'react'
import Header from './Components/Header'
import Section from './Components/Section'
import ProductsSection from './Components/ProductsSection'
import ContactSection from './Components/ContactSection'

type Language = 'EN' | 'TH'

const content = {
  EN: {
    homeHeading: 'Welcome to Art Florist',
    homeDesc:
      'We create exquisite handcrafted textile flowers, designed to last a lifetime and bring lasting joy to your loved ones.',
    about: 'We are a company that does amazing things.',
    products: 'Check out our fantastic products!',
    contact: 'Get in touch with us.',
  },
  TH: {
    homeHeading: 'ยินดีต้อนรับสู่ Art Florist',
    homeDesc:
      'เราสร้างดอกไม้ผ้าแฮนด์เมดที่สวยงาม ออกแบบมาให้คงอยู่ตลอดไปและมอบความสุขยาวนานให้กับคนที่คุณรัก',
    about: 'เราเป็นบริษัทที่ทำสิ่งที่น่าทึ่ง',
    products: 'ชมผลิตภัณฑ์ที่ยอดเยี่ยมของเรา!',
    contact: 'ติดต่อเราได้ที่นี่',
  },
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('TH')

  return (
    <div>
      <Header lang={lang} setLang={setLang} />

      <Section
        id="home"
        title={content[lang].homeHeading}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1rem',        // smaller horizontal padding for mobile
          minHeight: '80vh',
          backgroundColor: '#F5F0E8',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',     // ensures padding doesn’t add extra width
        }}
      >
        {/* Logo */}
        <img
          src="/Mekhala_Logo.png"
          alt="Art Florist Logo"
          style={{
            height: 'auto',          // let height adjust automatically
            maxHeight: '450px',      // max height for desktop
            maxWidth: '90%',
            objectFit: 'contain',
          }}
        />


        {/* Heading */}
        <h1
          style={{
            fontSize: '3rem',
            color: '#A57B80',
            marginBottom: '1.5rem',
            wordWrap: 'break-word',   // prevents long text from overflowing
          }}
        >
          {content[lang].homeHeading}
        </h1>

        {/* Description */}
        <p
          style={{
            maxWidth: '600px',
            fontSize: '1.2rem',
            color: '#555',
            lineHeight: 1.6,
          }}
        >
          {content[lang].homeDesc}
        </p>
      </Section>

      <Section id="about" title={lang === 'EN' ? 'About' : 'เกี่ยวกับเรา'}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            maxWidth: '1000px',
            minHeight: '40vw',
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center', // 👈 centers on mobile
            textAlign: 'center',      // 👈 centers text on mobile
            padding: '0 1rem',        // padding for mobile

          }}
        >

          {/* Text */}
          <div
            style={{
              flex: '1 1 400px',
              maxWidth: '500px',
            }}
          >
            <h2 style={{ marginBottom: '1rem' }}>
              {lang === 'EN' ? 'About Art Florist' : 'เกี่ยวกับ Art Florist'}
            </h2>

            <p>
              {lang === 'EN'
                ? 'Art Florist was born from a love for craftsmanship and meaningful gifts. We create handmade textile flowers that capture the beauty of real blooms — without fading over time.'
                : 'Art Florist เกิดขึ้นจากความรักในงานฝีมือและของขวัญที่มีความหมาย เราสร้างสรรค์ดอกไม้ผ้าแฮนด์เมดที่คงความงดงามเหนือกาลเวลา'}
            </p>

            <p>
              {lang === 'EN'
                ? 'Each piece is carefully designed and crafted to celebrate special moments, offering a lasting alternative to traditional flowers.'
                : 'ทุกชิ้นถูกออกแบบและทำด้วยความใส่ใจ เพื่อถ่ายทอดความรู้สึกในช่วงเวลาพิเศษ และเป็นทางเลือกที่ยั่งยืนแทนดอกไม้สด'}
            </p>
          </div>

          {/* Image */}
          <div
            style={{
              flex: '1 1 300px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >

            <img
              src="/Flower_Big.jpeg"
              alt="Handcrafted textile flowers"
              style={{
                width: '100%',
                maxWidth: '450px',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                objectPosition: '50% 80%',
                borderRadius: '12px',
                display: 'block',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)', // 👈 soft depth
              }}
            />

          </div>
        </div>
      </Section>


      <ProductsSection lang={lang} />

      <ContactSection lang={lang} />
    </div>
  )
}

export default App
