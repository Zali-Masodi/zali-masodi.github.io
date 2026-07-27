import { Routes, Route } from "react-router-dom";
// import Portfolio from "./pages/Portfolio";
import Pekaren from "./pages/Pekaren";
import MovingCompany from "./pages/Dodavka";
import LinksPage from "./pages/Prehlad";
// import SomethingPage from "./pages/Pekaren";

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Portfolio />} /> */}
      <Route path="/pekaren" element={<Pekaren />} />
      <Route path="/dodavka" element={<MovingCompany />} />
      <Route path="/" element={<LinksPage />} />


    </Routes>
  );
}