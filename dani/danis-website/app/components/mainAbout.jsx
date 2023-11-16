import React from 'react'
import Image from 'next/image'

//components
import Barber from '../../public/barber.jpg'

export default function MainAbout() {
  return (
    <div className = 'grid grid-cols-[repeat(2,1fr)] px-[7%]'>
      <div>
        <div className = 'mainAboutTitle text-[rgb(68,68,68)] text-[25px] tracking-[1px] font-bold italic m-auto'>
          <h1>About</h1>
        </div>

        <div class = 'mainAboutName text-[rgb(68,68,68)] text-[40px] tracking-[1px] font-bold italic m-auto'>
          <h1>Danis hair fashion</h1>
        </div>

        <div class = 'mainAboutText text-[rgb(68,68,68)] text-[15px] tracking-[1px] font-bold italic m-auto'>  
          <p>
          Welcome to [Barbershop Name], where style meets tradition! Our skilled barbers 
          bring a blend of modern trends and classic techniques to cater to your grooming needs. 
          Our cozy atmosphere invites you to relax and enjoy an unparalleled barbering experience.
          At [Barbershop Name], we take pride in our attention to detail, ensuring that every haircut, 
          shave, or beard trim is a personalized work of art. Our team is passionate about delivering top-notch 
          service, leaving you not just with a fresh look but with a boost of confidence.Step into our barbershop 
          and be greeted by a friendly team dedicated to enhancing your unique style. Whether you're after a timeless 
          haircut or a contemporary beard design, our barbers are here to make you look and feel your best. Experience 
          the timeless art of grooming at [Barbershop Name]—where every visit is an opportunity for self-expression and refinement.
            </p>
        </div>
      </div>

      <div className = 'flex justify-center items-center'>
      <Image
            src = {Barber}
            alt = "Barber"
            width = {500}
            quality = {100}
            placeholder = "blur"
            />
      </div>

    </div>
  )
}
