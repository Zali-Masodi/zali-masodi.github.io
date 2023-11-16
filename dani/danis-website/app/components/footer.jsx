import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

//components
import Logo from '../../public/logo.png'

export default function Footer() {
  return (
    <footer class = 'footer'>

        <div class = "footerComponent">
            <Image
            src = {Logo}
            alt = "Logo"
            width = {100}
            quality = {100}
            placeholder = "blur"
            />      
        </div>

        <div class = "footerComponent">
            

        </div>
        
        <div class = "footerComponent">
            <ol>                    
            <li className = "inline-block mr-10 font-bold text-primary text-lg"><Link href = "/">Instagram</Link></li>
            <li className = "inline-block mr-10 font-bold text-primary text-lg">Facebook</li>
            <li className = "inline-block mr-10 font-bold text-primary text-lg">WhatsApp</li>
            </ol>
        </div>

        
    </footer>
  )
}
