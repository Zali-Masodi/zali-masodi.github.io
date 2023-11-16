import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

//components
import Logo from './logo'
import Navbar from './navbar'




export default function Header() {
  return (
<header>
    <div class = "headerItem">
        <Logo></Logo>
    </div>

    <div class = "headerItem">
        <Navbar></Navbar>         
    </div>
</header>
  )
}
