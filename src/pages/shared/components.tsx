import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './kit';
import './kit.css';

/* ------------------------------------------------------------------
   Reveal: fade-up + un-blur as the element enters the viewport.
   ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li' | 'article' | 'figure' | 'section';
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}

/** Counts up to `to` the first time it scrolls into view. Writes straight
 *  to the DOM so the animation never re-renders React. */
export function Counter({ to, duration = 1.8 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return <span ref={ref}>{reduce || to === 0 ? to : 0}</span>;
}

/* ------------------------------------------------------------------
   Photo slot. Shows the real image when `src` is set; otherwise (or if
   the file fails to load) renders the site's art-directed fallback.
   ------------------------------------------------------------------ */
export function Photo({
  src,
  alt,
  className = '',
  fallback,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <div className={`kit-photo ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className={`kit-photo kit-photo--fallback ${className}`} role="img" aria-label={alt}>
      {fallback}
    </div>
  );
}

