export const TELEGRAM_HANDLE = '@wargen_me';
export const TELEGRAM_URL = 'https://t.me/wargen_me';

export type PackageName = 'STARTUP' | 'BUSINESS' | 'AGENCY';

/** Плавно прокручивает к секции. Тем, у кого в системе выключена анимация, скролл делается мгновенно. */
export const scrollToId = (selector: string) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};
