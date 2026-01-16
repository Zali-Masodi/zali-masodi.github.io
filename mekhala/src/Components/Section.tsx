import React, { type ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  children: ReactNode
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => (
  <section id={id} style={{ padding: '5rem 1rem', borderBottom: '1px solid #ccc' }}>
    <h2>{title}</h2>
    {children}
  </section>
)

export default Section
