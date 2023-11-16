import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

//components
import LogoPNG from '../../public/logo.png'

export default function Logo() {
  return (
    <div class = "headerLogo">
        <Link href="/" class = "logoLink">
            <Image
            src = {LogoPNG}
            alt = "Logo"
            width = {100}
            quality = {100}
            placeholder = "blur"
            />
        </Link>          
    </div>
  )
}
