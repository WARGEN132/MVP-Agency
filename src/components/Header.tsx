import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Send } from 'lucide-react';
import { MvpLogo } from './UI';
import { scrollToId } from '../lib/site';

const NAV_LINKS = [
  { id: 'model', label: 'О нас', href: '#model' },
  { id: 'uslugi', label: 'Форматы', href: '#uslugi' },
  { id: 'keysy', label: 'Кейсы', href: '#keysy' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
] as const;

// Секции, за которыми следим. 'top' и 'kontakty' нужны, чтобы подсветка
// в меню гасла в начале страницы и в блоке с формой.
const OBSERVED_IDS = ['top', ...NAV_LINKS.map((l) => l.id), 'kontakty'];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Шапка становится плотной после небольшой прокрутки
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setIsScrolled(window.scrollY > 20);
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

  // Какая секция сейчас в центре экрана. Так браузер сам сообщает о пересечении,
  // без чтения offsetTop на каждый скролл.
  useEffect(() => {
    const elements = OBSERVED_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Пока открыто мобильное меню: блокируем прокрутку фона, закрываем по Escape
  // и при переходе на широкий экран.
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [mobileOpen]);

  const go = (href: string) => {
    setMobileOpen(false);
    scrollToId(href);
  };

  const headerClass = mobileOpen
    ? 'py-2.5 sm:py-3 bg-[#07070a] border-b border-white/[0.06]'
    : isScrolled
      ? 'py-2.5 sm:py-3 backdrop-blur-xl bg-[#07070a]/92 border-b border-white/[0.06] shadow-xl shadow-black/50'
      : 'py-3.5 sm:py-5 bg-transparent';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
            aria-label="MVP Agency, наверх"
          >
            <MvpLogo size={32} className="transition-transform duration-300 group-hover:scale-105 sm:w-9 sm:h-9" />
            <span className="text-base sm:text-lg font-black text-white font-display tracking-tight leading-none">
              MVP <span className="text-purple-400">AGENCY</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md"
            aria-label="Основная навигация"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-purple-500/20 border border-purple-500/40 rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />}
                    {link.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => go('#kontakty')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <span>Обсудить проект</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Toggle Button (зона нажатия 44x44) */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900/90 active:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white cursor-pointer transition-colors"
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-purple-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/*
        Мобильное меню вынесено ЗА пределы <header>. Раньше оно лежало внутри, а у шапки при прокрутке
        включается backdrop-blur: из-за этого браузер считал шапку "рамкой" для fixed-элементов,
        и меню с затемнением съезжали и схлопывались.
      */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
          />
        )}
        {mobileOpen && (
          <motion.div
            key="menu-panel"
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden fixed inset-x-0 top-0 z-[45] max-h-dvh overflow-y-auto border-b border-zinc-800 bg-[#09090f] px-5 pb-6 pt-[5.5rem] shadow-2xl space-y-5"
          >
            <nav className="flex flex-col space-y-2" aria-label="Мобильная навигация">
              {NAV_LINKS.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => go(link.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`text-left px-4 py-3.5 rounded-xl text-base font-semibold transition-all flex items-center justify-between min-h-[50px] active:scale-[0.98] ${
                      isActive
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold'
                        : 'text-zinc-300 hover:bg-zinc-900/60 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {isActive && <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />}
                      {link.label}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">0{idx + 1}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => go('#kontakty')}
                className="w-full min-h-[50px] py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 active:brightness-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <span>Обсудить проект</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
