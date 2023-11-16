import Image from 'next/image'

//components
import MainAbout from './components/mainAbout'
import MainHours from './components/mainHours'
import MainServices from './components/mainServices'
import CustomerReviews from './components/customerReviews'
import MainWelcome from './components/mainWelcome'

export default function Home() {
  return (
    <main class = 'mainContent'>
      
      <MainWelcome></MainWelcome>
<br />
<br />
      <MainAbout></MainAbout>
<br />
<br />
      <MainHours></MainHours>
<br />
<br />
      <MainServices></MainServices>
<br />
<br />
      <CustomerReviews></CustomerReviews>
    </main>
  )
}
