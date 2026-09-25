import { useEffect, useState, type MouseEvent } from 'react';
import Lenis from 'lenis';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';

/* ------------------------------------------------------------------
   Smooth scroll (Lenis). One instance per mounted page, disabled when
   the visitor prefers reduced motion.
   ------------------------------------------------------------------ */
let lenis: Lenis | null = null;

export function useSmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (reduce) return;
    const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
    lenis = instance;
    let frame = requestAnimationFrame(function loop(time) {
      instance.raf(time);
      frame = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, [reduce]);
}

/** Scrolls to a section by id. Anchors can't use plain hrefs because the
 *  app runs on HashRouter, where "#contact" would be read as a route. */
export function scrollToId(id: string, offset = -80) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    // force: the mobile menu stops Lenis while open and links close it
    lenis.scrollTo(el, { offset, duration: 1.3, force: true });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function jumpTo(id: string, offset?: number) {
  return (e: MouseEvent) => {
    e.preventDefault();
    scrollToId(id, offset);
  };
}

/** True once the page has scrolled past `threshold` px. Driven by Motion's
 *  scroll value, so React only re-renders when the boolean flips. */
export function useScrolledPast(threshold: number) {
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setPast(y > threshold));
  return past;
}

/** Locks page scroll while an overlay (mobile menu) is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------
   Language preference, remembered per site. Storage can be blocked
   (private mode), so every access is guarded.
   ------------------------------------------------------------------ */
export function useStoredLang<L extends string>(key: string, allowed: readonly L[], fallback: L) {
  const [lang, setLang] = useState<L>(() => {
    try {
      const stored = window.localStorage.getItem(key) as L | null;
      if (stored && allowed.includes(stored)) return stored;
    } catch {
      /* storage unavailable */
    }
    return fallback;
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(key, lang);
    } catch {
      /* storage unavailable */
    }
  }, [key, lang]);

  return [lang, setLang] as const;
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

/** Current weekday index, Monday = 0. */
export function todayIndex() {
  return (new Date().getDay() + 6) % 7;
}
