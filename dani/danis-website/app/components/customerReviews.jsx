import React from 'react'

//components
import CustomerReview from './customerReview'

export default function CustomerReviews() {
  return (
    
    <div className = 'customerReviews grid grid-cols-[repeat(2,1fr)] w-full p-2.5'>
      <div className='grid grid-cols-[repeat(3,1fr)] w-full p-2.5'>
      <CustomerReview></CustomerReview>
      <CustomerReview></CustomerReview>
      <CustomerReview></CustomerReview>
      </div>

      <div className='flex justify-center items-center p-3 m-3'> 
          <p>At [Barbershop Name], our commitment to customer care goes beyond the haircut. 
            We understand that grooming is a personal experience, and we take pride in creating an
            environment where you feel valued and appreciated.
            From the moment you step through our doors, you'll be greeted with a warm 
            welcome and a genuine interest in your style preferences. Our skilled barbers 
            don't just provide haircuts; they take the time to listen, ensuring that your 
            unique needs and preferences are understood.
            We prioritize your comfort and satisfaction, aiming to create a memorable and enjoyable 
            experience with every visit. Our attention to detail extends to the personalized service 
            we offer, making sure you leave our barbershop not only looking great but feeling confident and cared for.
            At [Barbershop Name], it's not just about the haircut; it's about building lasting relationships 
            with our customers. We're dedicated to providing not only exceptional grooming services but also 
            a sense of belonging and a welcoming atmosphere for everyone who walks through our doors. Your satisfaction 
            is our priority, and we look forward to exceeding your expectations at every visit.
            </p>
      </div>
        
    </div>

  )
}
