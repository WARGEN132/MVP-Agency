import React, { memo, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, type Variants } from 'motion/react';
import { Send } from 'lucide-react';
import { TELEGRAM_URL, scrollToId } from '../lib/site';

/* =========================================================================
   1. MVP BRAND LOGO (Vector Emblem)
   id градиентов уникальны для каждого экземпляра (логотип на странице 3 раза)
   ========================================================================= */
export const MvpLogo = memo(function MvpLogo({
  size = 36,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const purple = `purpleGrad-${uid}`;
  const dark = `darkBgGrad-${uid}`;
  const glow = `purpleGlow-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="MVP Agency"
    >
      <defs>
        <linearGradient id={purple} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d0fe" />
          <stop offset="35%" stopColor="#c084fc" />
          <stop offset="70%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id={dark} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#181824" />
          <stop offset="100%" stopColor="#0a0a0f" />
        </linearGradient>
        <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path
        d="M50 5 L88 22 V55 C88 80 70 98 50 105 C30 98 12 80 12 55 V22 L50 5 Z"
        fill={`url(#${dark})`}
        stroke={`url(#${purple})`}
        strokeWidth="4"
        filter={`url(#${glow})`}
      />
      <path d="M35 22 L42 12 L50 20 L58 12 L65 22 Z" fill={`url(#${purple})`} />
      <text
        x="50"
        y="62"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="28"
        fill={`url(#${purple})`}
        textAnchor="middle"
      >
        MVP
      </text>
      <polygon points="50,72 54,77 50,82 46,77" fill={`url(#${purple})`} />
    </svg>
  );
});

/* =========================================================================
   2. TEXT REVEAL COMPONENTS (Editorial Curtain Animation)
   ========================================================================= */
export const textRevealItemVariants: Variants = {
  hidden: {
    clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
    y: '110%',
    opacity: 0,
  },
  visible: {
    clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const TextRevealWord: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <span className="inline-block overflow-hidden mr-[0.28em] last:mr-0 align-top">
    <motion.span
      variants={textRevealItemVariants}
      className={`inline-block will-change-[transform,clip-path] ${className}`}
    >
      {children}
    </motion.span>
  </span>
);

export const EditorialHeading: React.FC<{
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  viewportMargin?: string;
  animateOnMount?: boolean;
}> = ({
  as = 'h2',
  children,
  className = '',
  delay = 0.05,
  stagger = 0.08,
  viewportMargin = '-50px',
  animateOnMount = false,
}) => {
  const Component = motion[as];
  const containerVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: stagger, delayChildren: delay },
      },
    }),
    [stagger, delay]
  );

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      {...(animateOnMount
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, margin: viewportMargin } })}
      className={className}
    >
      {children}
    </Component>
  );
};

/* =========================================================================
   3. CUSTOM CURSOR
   Только для мыши. Слушатели вешаются один раз, проверка "наведено ли на кнопку"
   идёт по mouseover, а не на каждое движение мыши.
   ========================================================================= */
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], .cursor-pointer, summary, label';

const isInteractive = (target: EventTarget | null) =>
  target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null;

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const visibleRef = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 520, mass: 0.12 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };
    const handleMouseOver = (e: MouseEvent) => setIsHovered(isInteractive(e.target));
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none" aria-hidden="true">
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isClicked ? (isHovered ? 1.15 : 0.82) : isHovered ? 1.38 : 1,
          borderColor: isHovered ? 'rgba(233, 213, 255, 0.95)' : 'rgba(192, 132, 252, 0.85)',
          backgroundColor: isHovered ? 'rgba(168, 85, 247, 0.22)' : 'rgba(168, 85, 247, 0.1)',
          boxShadow: isHovered
            ? '0 0 14px rgba(192, 132, 252, 0.65), 0 0 4px rgba(255, 255, 255, 0.4), inset 0 0 6px rgba(216, 180, 254, 0.3)'
            : '0 0 10px rgba(192, 132, 252, 0.45), inset 0 0 4px rgba(168, 85, 247, 0.15)',
        }}
        transition={{ type: 'spring', stiffness: 480, damping: 26 }}
        className="fixed top-0 left-0 -ml-[11px] -mt-[11px] h-[22px] w-[22px] rounded-full border-[1.5px] backdrop-blur-[2px] flex items-center justify-center will-change-transform"
      >
        <motion.div
          animate={{
            scale: isHovered ? 1.25 : 1,
            backgroundColor: isHovered ? '#ffffff' : '#f3e8ff',
            boxShadow: isHovered ? '0 0 6px #ffffff, 0 0 10px #c084fc' : '0 0 4px #ffffff',
          }}
          transition={{ duration: 0.15 }}
          className="h-1.5 w-1.5 rounded-full"
        />
      </motion.div>
    </div>
  );
};

/* =========================================================================
   4. SCROLL PROGRESS BAR
   Ширина меняется напрямую в DOM (без setState), поэтому прокрутка
   не вызывает перерисовку React.
   ========================================================================= */
export const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left will-change-transform bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-400"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

/* =========================================================================
   5. PRELOADER
   Показывается один раз за сессию и не показывается тем,
   у кого в системе выключена анимация.
   ========================================================================= */
const PRELOADER_KEY = 'mvp-preloader-seen';

const shouldShowPreloader = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return sessionStorage.getItem(PRELOADER_KEY) !== '1';
  } catch {
    return true;
  }
};

export const Preloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(shouldShowPreloader);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(PRELOADER_KEY, '1');
      } catch {
        /* хранилище может быть недоступно (приватный режим), это не страшно */
      }
      setIsVisible(false);
      onComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508] text-white px-4 select-none pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-full h-[420px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5 relative z-10 text-center"
          >
            <MvpLogo size={64} className="drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]" />
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold tracking-[0.08em] text-white font-display">
                MVP <span className="text-purple-400">AGENCY</span>
              </span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent mt-1"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* =========================================================================
   6. MOBILE FLOATING ACTION BAR
   Учитывает "чёлку" и нижнюю полосу iPhone (safe-area), скролл через rAF.
   ========================================================================= */
export const MobileBottomBar: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const scrolled = window.scrollY > 280;
      const contactEl = document.getElementById('kontakty');
      const nearContact = contactEl
        ? contactEl.getBoundingClientRect().top < window.innerHeight * 0.7
        : false;
      setShow(scrolled && !nearContact);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="md:hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-40 max-w-md mx-auto"
        >
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#0e0e14]/95 backdrop-blur-xl border border-zinc-700/70 shadow-2xl shadow-black/80">
            <button
              type="button"
              onClick={() => scrollToId('#kontakty')}
              className="flex-1 min-h-[46px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 active:brightness-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <span>Обсудить проект</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="min-h-[46px] px-3.5 rounded-xl bg-sky-500/15 active:bg-sky-500/25 text-sky-400 border border-sky-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
              aria-label="Написать в Telegram"
            >
              <Send className="w-4 h-4" />
              <span className="hidden min-[480px]:inline">TG</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
