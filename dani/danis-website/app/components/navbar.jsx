import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div class = "navbarList">
        <nav>
            <ol>                    
                <li className = "inline-block mr-10 font-bold text-primary text-lg"><Link href="/">Home</Link></li>
                <li className = "inline-block mr-10 font-bold text-primary text-lg"><Link href="about">About</Link></li>
                <li className = "inline-block mr-10 font-bold text-primary text-lg"><Link href="services">Services</Link></li>
                <li className = "inline-block mr-10 font-bold text-primary text-lg"><Link href="appointments">Appointments</Link></li>
                <li className = "inline-block mr-10 font-bold text-primary text-lg"><Link href="products">Products</Link></li>
            </ol>        
        </nav>
    </div>  
  )
}
