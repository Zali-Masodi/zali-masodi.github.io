import React from 'react'
import Image from 'next/image'

//components
import LogoPNG from '../../public/logo.png'

export default function CustomerReview() {
  return (
    <div className='customerReview m-4'>
        <div className='border-2 border-solid border-[#333]'>
            <div className='customerInfo grid grid-cols-[repeat(2,1fr)] w-full p-2.5'>
                <div className='customerPicture flex justify-center items-center'>
                    <Image
                    src = {LogoPNG}
                    alt = "Logo"
                    width = {80}
                    quality = {100}
                    placeholder = "blur"
                    />
                </div>

                <div className='customerDetails'>
                    <div>
                        <div className='customerName'>
                            <h1>Some guy</h1>
                        </div>
                        <div className='customerDate'>
                            <h1>1.1.2024</h1>
                        </div>
                        <div className='customerRating'>
                            <h1>*****</h1>
                        </div>

                    </div>
                </div>
            </div>


            <div className='reviewContent flex justify-center items-center p-3'>
                <p>
                Exceptional experience at [Barbershop Name]! 
                The skilled barbers deliver precision and style, creating a welcoming ambiance. 
                From the warm welcome to the expert cut, every detail is handled with care. 
                A top-notch choice for a fresh, confident look. Highly recommend!
                </p>
            </div>

        </div>
    </div>
  )
}
