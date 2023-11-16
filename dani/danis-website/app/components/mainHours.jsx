import React from 'react'


export default function MainHours() {
  return (
    <div className="bg-[url('../public/background.png')] bg-no-repeat bg-cover p-10">

      <div>
      <div className = 'mainHoursTitle flex justify-center items-center text-[rgb(135,219,214)] text-[50px] tracking-[1px] font-bold italic m-auto'>
        <h1>Opening Hours</h1>
      </div>
        

      <div className = 'mainHoursList flex justify-center items-center text-[rgb(135,219,214)] text-3xl tracking-[10px] font-bold italic m-auto'>
        <ol>
            <li>Mon.: Closed</li>
            <li>Tue.: 10:00 - 18:00</li>
            <li>Wed.: 10:00 - 18:00</li>   
            <li>Thu.: 10:00 - 20:00</li>
            <li>Fri.: 10:00 - 18:00</li>
            <li>Sat.: 10:00 - 17:00</li>
            <li>Sun.: 12:00 - 17:00</li>
        </ol>
      </div>
      </div>

    </div>
  )
}
