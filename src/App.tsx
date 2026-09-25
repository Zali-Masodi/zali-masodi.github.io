import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// import Portfolio from "./pages/Portfolio";
import LinksPage from "./pages/Prehlad";
// import SomethingPage from "./pages/Pekaren";

// Each site loads on demand, so a visitor only downloads the page they open
const Pekaren = lazy(() => import("./pages/Pekaren"));
const MovingCompany = lazy(() => import("./pages/Dodavka"));
const Stavba = lazy(() => import("./pages/Stavba"));
const Snake = lazy(() => import("./pages/Snake"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* <Route path="/" element={<Portfolio />} /> */}
        <Route path="/pekaren" element={<Pekaren />} />
        <Route path="/dodavka" element={<MovingCompany />} />
        <Route path="/stavba" element={<Stavba />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/" element={<LinksPage />} />
      </Routes>
    </Suspense>
  );
}
