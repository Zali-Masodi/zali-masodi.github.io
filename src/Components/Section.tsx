import React, { type ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
  style?: React.CSSProperties // <-- add this
}

const Section: React.FC<SectionProps> = ({ id, children, style }) => {
  return (
    <section id={id} style={style}>
      {children}
    </section>
  )
}


export default Section
