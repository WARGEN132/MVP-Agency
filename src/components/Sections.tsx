import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Eye,
  ArrowRight,
  ShieldCheck,
  Film,
  Zap,
  Target,
  Rocket,
  Check,
  Send,
  CheckCircle2,
  Phone,
  User,
  ChevronDown,
  X,
} from 'lucide-react';
import { EditorialHeading, TextRevealWord, MvpLogo } from './UI';
import { type PackageName, TELEGRAM_HANDLE, TELEGRAM_URL, scrollToId } from '../lib/site';

/* Общие классы, чтобы не повторять их в каждой секции */
const CONTAINER = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10';
const SECTION = 'py-12 sm:py-16 md:py-24 relative scroll-mt-6';
const H2 =
  'text-xl min-[480px]:text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display';
const CARD = 'glass-card border border-zinc-800 bg-[#0e0e14]';
const GHOST_BTN =
  'w-full min-h-[44px] rounded-xl bg-zinc-900 active:bg-zinc-800 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center cursor-pointer transition-colors';

/* =========================================================================
   ДАННЫЕ (вынесены из компонентов: не создаются заново при каждой перерисовке)
   ========================================================================= */
const HERO_STATS = [
  { value: '40M+', label: 'Охватов в год', icon: TrendingUp },
  { value: '50M+', label: 'Просмотров видео', icon: Eye },
  { value: '20K+', label: 'В Telegram', icon: Zap },
];

const HERO_FEATURES = [
  {
    icon: Film,
    title: 'Съёмка под ключ',
    text: '4K оборудование, свет, звук и студия',
    tone: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
  },
  {
    icon: Target,
    title: 'Автоворонка в Telegram',
    text: 'Перелив просмотров в реальные заявки',
    tone: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантия по договору',
    text: 'Фиксированные KPI и прозрачные этапы',
    tone: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Упаковка и контент',
    icon: Film,
    tag: 'Фундамент и вирусный сценарий',
    desc: 'Разрабатываем позиционирование, пишем сценарии с высоким удержанием и организуем съёмку 4K.',
    features: [
      'Анализ ниши и конкурентов',
      '20–50 вирусных сценариев',
      'Выездная съёмочная группа',
      'Монтаж под тренды Reels/Shorts',
    ],
  },
  {
    num: '02',
    title: 'Трафик и продажи',
    icon: Target,
    tag: 'Монетизация просмотров',
    desc: 'Превращаем охваты в заявки и выручку. Создаём автоворонку в Telegram, лид-магниты и ботов.',
    features: [
      'Лид-магниты и кодовые слова',
      'Telegram-бот автопрогрева',
      'Перелив аудитории в канал',
      'Конверсия просмотров в клиентов',
    ],
  },
  {
    num: '03',
    title: 'Продюсирование под ключ',
    icon: Rocket,
    tag: 'Ваш личный медиаотдел',
    desc: 'Берем полный цикл медиапроекта: стабильный поток клиентов, личный бренд и рост бизнеса.',
    features: [
      'Персональный продюсер',
      'Публикация во все соцсети',
      'Еженедельные A/B тесты',
      'Гарантия охватов по договору',
    ],
  },
];

interface PackageInfo {
  name: PackageName;
  badge: string;
  desc: string;
  shooting: string;
  videos: string;
  popular: boolean;
  items: string[];
}

const PACKAGES: PackageInfo[] = [
  {
    name: 'STARTUP',
    badge: 'Быстрый старт',
    desc: 'Тестирование гипотез и привлечение первых целевых просмотров.',
    shooting: '5 часов съёмки',
    videos: '20 роликов',
    popular: false,
    items: [
      'Аудит соцсетей и контент-стратегия',
      'Выездная профессиональная съёмка (5ч)',
      '20 готовых роликов под ключ',
      'Динамичный монтаж, звук и субтитры',
    ],
  },
  {
    name: 'BUSINESS',
    badge: 'Популярный выбор',
    desc: 'Системный медиакомплекс для стабильного потока клиентов и заявок.',
    shooting: '8 часов съёмки',
    videos: '30 роликов',
    popular: true,
    items: [
      'Глубокий анализ ниши и вирусные сценарии',
      'Профессиональная съёмка 4K (8ч)',
      '30 роликов с A/B тестами зацепов',
      'Разработка Telegram-бота и лид-магнитов',
      'Построение автоворонки продаж для заявок',
    ],
  },
  {
    name: 'AGENCY',
    badge: 'Максимальный',
    desc: 'Полное партнерство и масштабирование бренда под ключ.',
    shooting: '12 часов съёмки',
    videos: '50 роликов',
    popular: false,
    items: [
      'Полное ведение: от идеи до продаж',
      'Выездная команда (12ч, свет, звук)',
      '50 готовых роликов в месяц во все соцсети',
      'Сквозная воронка и Telegram-экосистема',
      'Персональный продюсер и контент-директор',
    ],
  },
];

const CASE_STATS = [
  { value: '+50M', label: 'Reels & Shorts', accent: true },
  { value: '20K+', label: 'В Telegram', accent: false },
  { value: '40M+', label: 'Охватов', accent: true },
];

const CASES = [
  {
    title: 'YouTube и Shorts канал с нуля',
    niche: 'Экспертный контент',
    views: '40.7M',
    subscribers: '+51.6K',
    hours: '417K ч',
    desc: 'Системная съемка роликов, A/B тестирование обложек и удержание внимания аудитории в первые секунды.',
  },
  {
    title: 'Telegram-канал в нише финансов',
    niche: 'Финансы и инвестиции',
    views: '18.4M',
    subscribers: '+20K TG',
    hours: '180K ч',
    desc: 'Автоматическая воронка выдачи материалов по кодовым словам из вирусных Reels и Shorts.',
  },
  {
    title: 'Личный бренд эксперта по недвижимости',
    niche: 'Премиум недвижимость',
    views: '6.2M',
    subscribers: '+8.4K целевых',
    hours: '62K ч',
    desc: 'Упаковка экспертного блога, кинематографичная съёмка объектов и привлечение целевых клиентов.',
  },
];

const FAQS = [
  {
    q: 'Сколько времени занимает подготовка и запуск первой съёмки?',
    a: 'Обычно старт занимает от 3 до 5 рабочих дней. За это время мы проводим глубокий аудит вашей ниши, разрабатываем контент-стратегию и утверждаем список сценариев.',
  },
  {
    q: 'Нужна ли мне своя съёмочная техника, свет или микрофоны?',
    a: 'Нет. Наша команда приезжает со всем необходимым профессиональным оборудованием: 4K-камеры, студийный свет, бескабельные петличные системы и стабилизаторы.',
  },
  {
    q: 'Кто пишет сценарии и генерирует идеи для роликов?',
    a: 'Всю креативную работу берет на себя сценаристская команда MVP Agency. Мы постоянно отслеживаем мировые тренды Reels и Shorts, адаптируя их под вашу конкретную нишу.',
  },
  {
    q: 'Как просмотры конвертируются в реальные продажи?',
    a: 'Мы внедряем проверенные логические воронки: кодовые слова, лид-магниты, автоответчики и переливы в Telegram-канал, где выстраивается прогрев аудитории.',
  },
  {
    q: 'Можно ли работать с нами, если вы находитесь в другом городе?',
    a: 'Да. У нас есть мобильные съёмочные группы в ключевых городах, а также налаженный формат удалённого продюсирования и онлайн-режиссуры съёмок.',
  },
];

/* =========================================================================
   1. HERO SECTION
   ========================================================================= */
export const HeroSection: React.FC = () => (
  <section id="top" className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 md:py-24 overflow-hidden">
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[250px] sm:h-[350px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

    <div className={CONTAINER}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        {/* Main Copy */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-6">
          <EditorialHeading
            as="h1"
            animateOnMount={true}
            delay={0.15}
            stagger={0.08}
            className="text-[28px] min-[480px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] text-white font-display tracking-tight"
          >
            <TextRevealWord>Превращаем</TextRevealWord>
            <TextRevealWord>охваты</TextRevealWord>
            <TextRevealWord>в</TextRevealWord>
            <TextRevealWord>системную</TextRevealWord>
            <TextRevealWord className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-300">
              прибыль
            </TextRevealWord>
          </EditorialHeading>

          <p className="text-sm sm:text-base text-zinc-300 max-w-xl font-normal leading-relaxed">
            Создание вирусного контента, системные продажи через личный бренд и продюсирование
            медиапроектов под ключ.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto pt-1 sm:pt-2">
            <button
              type="button"
              onClick={() => scrollToId('#kontakty')}
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-purple-600/25 cursor-pointer min-h-[48px]"
            >
              <span>Обсудить проект</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => scrollToId('#model')}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full font-semibold text-xs sm:text-sm text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 active:scale-[0.98] border border-zinc-800 transition-all duration-200 cursor-pointer min-h-[48px]"
            >
              <span>Модель работы</span>
            </button>
          </div>

          {/* Numbers: 3 колонки и на телефоне */}
          <div className="pt-5 sm:pt-8 border-t border-zinc-800/80 w-full grid grid-cols-3 gap-2 sm:gap-6">
            {HERO_STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="p-2 sm:p-0 rounded-lg bg-zinc-900/30 sm:bg-transparent border border-zinc-800/50 sm:border-0 text-center sm:text-left"
              >
                <div className="text-base min-[480px]:text-lg sm:text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-1 font-display">
                  <span>{value}</span>
                  <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0 hidden min-[480px]:inline" />
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card */}
        <div className="lg:col-span-5">
          <div className={`${CARD} rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden`}>
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-semibold text-zinc-300 leading-tight">
                  Медиа-агентство полного цикла
                </span>
              </div>
              <span className="shrink-0 text-[10px] sm:text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                MVP 2026
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
              {HERO_FEATURES.map(({ icon: Icon, title, text, tone }) => (
                <div
                  key={title}
                  className="p-3 sm:p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-3"
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center shrink-0 ${tone}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">{title}</div>
                    <div className="text-[11px] text-zinc-400">{text}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToId('#kontakty')}
              className={`${GHOST_BTN} py-3 px-4 font-bold text-xs text-white gap-2`}
            >
              <span>Запросить стратегическую сессию</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* =========================================================================
   2. MODEL SECTION
   ========================================================================= */
export const ModelSection: React.FC = () => (
  <section id="model" className={SECTION}>
    <div className={CONTAINER}>
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <EditorialHeading as="h2" className={H2}>
          <TextRevealWord>Модель</TextRevealWord>
          <TextRevealWord>работы</TextRevealWord>
          <TextRevealWord className="text-purple-400">MVP</TextRevealWord>
          <TextRevealWord className="text-purple-400">AGENCY</TextRevealWord>
        </EditorialHeading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className={`${CARD} rounded-2xl p-5 sm:p-6 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-zinc-700 font-display">{step.num}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-1 font-display">{step.title}</h3>
                <div className="text-xs text-purple-400 font-medium mb-2.5 sm:mb-3">{step.tag}</div>
                <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed mb-4 sm:mb-6">{step.desc}</p>

                <ul className="space-y-2 mb-5 sm:mb-6 pt-3 sm:pt-4 border-t border-zinc-800/60">
                  {step.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => scrollToId('#kontakty')}
                className={`${GHOST_BTN} py-2.5 px-3 text-zinc-300 hover:text-white text-xs font-semibold gap-1.5`}
              >
                <span>Подробнее</span>
                <ArrowRight className="w-3 h-3 text-purple-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

/* =========================================================================
   3. SERVICES & TARIFFS SECTION
   Кнопка "Выбрать ..." запоминает формат и подставляет его в форму заявки.
   ========================================================================= */
export const ServicesSection: React.FC<{ onSelectPackage?: (name: PackageName) => void }> = ({
  onSelectPackage,
}) => (
  <section id="uslugi" className={SECTION}>
    <div className={CONTAINER}>
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <EditorialHeading as="h2" className={H2}>
          <TextRevealWord>Форматы</TextRevealWord>
          <TextRevealWord>сотрудничества</TextRevealWord>
        </EditorialHeading>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 sm:mt-3">
          Готовые программы под любые задачи: от первого теста до полного продюсирования
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className={`${CARD} rounded-2xl p-5 sm:p-7 flex flex-col justify-between ${
              pkg.popular
                ? 'border-purple-500/80 shadow-xl shadow-purple-500/15 ring-1 ring-purple-500/30'
                : 'hover:border-zinc-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-white font-display">{pkg.name}</h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border text-center ${
                    pkg.popular
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {pkg.badge}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed mb-4 sm:mb-5">{pkg.desc}</p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6 p-2.5 sm:p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-medium block">Съёмка</span>
                  <span className="text-xs sm:text-sm font-bold text-purple-400">{pkg.shooting}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-medium block">Результат</span>
                  <span className="text-xs sm:text-sm font-bold text-white">{pkg.videos}</span>
                </div>
              </div>

              <ul className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8">
                {pkg.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <div className="w-4 h-4 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectPackage?.(pkg.name);
                scrollToId('#kontakty');
              }}
              className={`w-full min-h-[46px] py-3 px-4 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                pkg.popular
                  ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 active:brightness-95 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-zinc-900 active:bg-zinc-800 hover:bg-zinc-800 text-zinc-200 border border-zinc-800'
              }`}
            >
              <span>Выбрать {pkg.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* =========================================================================
   4. CASES SECTION
   ========================================================================= */
export const CasesSection: React.FC = () => (
  <section id="keysy" className={SECTION}>
    <div className={CONTAINER}>
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <EditorialHeading as="h2" className={H2}>
          <TextRevealWord>Результаты</TextRevealWord>
          <TextRevealWord>проектов</TextRevealWord>
        </EditorialHeading>
      </div>

      {/* Big numbers */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-8 sm:mb-12">
        {CASE_STATS.map((s) => (
          <div key={s.label} className={`${CARD} rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center`}>
            <div
              className={`text-lg min-[480px]:text-xl sm:text-4xl font-extrabold font-display ${
                s.accent ? 'text-purple-400' : 'text-white'
              }`}
            >
              {s.value}
            </div>
            <div className="text-[11px] sm:text-sm font-medium text-zinc-300 mt-1 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {CASES.map((cs) => (
          <div key={cs.title} className={`${CARD} rounded-2xl p-5 sm:p-6 flex flex-col justify-between`}>
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {cs.niche}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-2.5 mb-2 font-display">{cs.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">{cs.desc}</p>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-2.5 px-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-center">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Просмотры</span>
                  <span className="text-xs font-bold text-white leading-tight">{cs.views}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Подписчики</span>
                  <span className="text-xs font-bold text-purple-400 leading-tight break-words">
                    {cs.subscribers}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Время</span>
                  <span className="text-xs font-bold text-zinc-300 leading-tight">{cs.hours}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollToId('#kontakty')}
              className={`${GHOST_BTN} mt-5 sm:mt-6 py-2.5 text-zinc-300 text-xs font-semibold gap-1.5`}
            >
              <span>Хочу такой же результат</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* =========================================================================
   5. FAQ SECTION
   ========================================================================= */
export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className={SECTION}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <EditorialHeading as="h2" className={H2}>
            <TextRevealWord>Часто</TextRevealWord>
            <TextRevealWord>задаваемые</TextRevealWord>
            <TextRevealWord>вопросы</TextRevealWord>
          </EditorialHeading>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className={`${CARD} rounded-xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-purple-500/60 shadow-xl shadow-purple-500/10' : 'border-zinc-800/90'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  className="w-full min-h-[52px] p-3.5 sm:p-5 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5">
                    <span className="text-[11px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-purple-400 shrink-0">
                      0{index + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white font-display leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-zinc-300 border-t border-zinc-800/50 pt-2.5 sm:pt-3 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* =========================================================================
   6. CONTACT SECTION
   Заявка уходит на /api/send (serverless-функция Vercel), токен бота в браузер не попадает.
   ========================================================================= */
interface ContactSectionProps {
  selectedPackage?: PackageName | null;
  onClearPackage?: () => void;
}

const FALLBACK_ERROR = `Не удалось отправить. Напишите напрямую в Telegram ${TELEGRAM_HANDLE}.`;

const INPUT_CLASS =
  'w-full min-h-[48px] px-4 py-3 sm:py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 text-white placeholder-zinc-500 text-base outline-none transition-colors';

export const ContactSection: React.FC<ContactSectionProps> = ({ selectedPackage, onClearPackage }) => {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // Скрытое поле-ловушка для ботов (человек его не видит и не заполняет)
    const website = String(new FormData(e.currentTarget).get('website') ?? '');

    if (!formData.name.trim() || !formData.contact.trim()) {
      setErrMsg('Пожалуйста, укажите имя и телефон или Telegram.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrMsg('');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    let message = FALLBACK_ERROR;

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, package: selectedPackage ?? '', website }),
        signal: controller.signal,
      });
      const data: { ok?: boolean; error?: string } | null = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setStatus('success');
        onClearPackage?.();
        return;
      }
      if (res.status === 400 && data?.error) message = data.error;
    } catch {
      /* нет сети или сервер не ответил за 12 секунд: покажем запасной вариант */
    } finally {
      window.clearTimeout(timeout);
    }

    setErrMsg(message);
    setStatus('error');
  };

  return (
    <section id="kontakty" className={SECTION}>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`${CARD} rounded-2xl p-5 sm:p-8 md:p-10`}>
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <EditorialHeading as="h2" className={H2}>
              <TextRevealWord>Обсудить</TextRevealWord>
              <TextRevealWord>проект</TextRevealWord>
            </EditorialHeading>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              Оставьте контакт — продюсер свяжется с вами в течение 30 минут и разберёт стратегию продвижения.
            </p>
          </div>

          {status === 'success' ? (
            <div className="py-8 text-center space-y-4" role="status">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">Заявка отправлена!</h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto">
                Мы уже получили ваши контакты и скоро напишем вам в Telegram или позвоним.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setFormData({ name: '', contact: '', message: '' });
                }}
                className="min-h-[44px] px-6 py-2.5 rounded-full text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 cursor-pointer active:scale-95"
              >
                Отправить ещё
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              {selectedPackage && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 pl-4 pr-1 py-1 text-xs">
                  <span className="text-purple-200">
                    Выбранный формат: <b className="text-white">{selectedPackage}</b>
                  </span>
                  <button
                    type="button"
                    onClick={onClearPackage}
                    aria-label="Убрать выбранный формат"
                    className="flex items-center justify-center w-11 h-11 shrink-0 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="lead-name" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" /> Ваше имя *
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  maxLength={80}
                  autoComplete="name"
                  enterKeyHint="next"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Александр"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lead-contact" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-purple-400" /> Телефон или Telegram *
                </label>
                <input
                  id="lead-contact"
                  name="contact"
                  type="text"
                  required
                  maxLength={80}
                  autoComplete="off"
                  enterKeyHint="next"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="@username или +7 (999) 000-00-00"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lead-message" className="text-xs font-medium text-zinc-300">
                  Ниша или ссылка на проект (необязательно)
                </label>
                <textarea
                  id="lead-message"
                  name="message"
                  rows={2}
                  maxLength={500}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Недвижимость, инвестиции, онлайн-школа..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-purple-500 text-white placeholder-zinc-500 text-base outline-none transition-colors resize-none"
                />
              </div>

              {/* Ловушка для ботов: скрыта от людей и от скринридеров */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {status === 'error' && (
                <p className="text-rose-400 text-xs text-center" role="alert">
                  {errMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full min-h-[50px] py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 active:brightness-95 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-purple-600/25 cursor-pointer disabled:opacity-50"
              >
                <span>{status === 'submitting' ? 'Отправляем...' : 'Отправить заявку'}</span>
                <Send className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-zinc-400">
                Или напишите сразу:{' '}
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  {TELEGRAM_HANDLE}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* =========================================================================
   7. FOOTER SECTION
   ========================================================================= */
export const FooterSection: React.FC = () => (
  <footer className="py-8 sm:py-10 border-t border-zinc-800/80 bg-[#050508] relative font-sans">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <MvpLogo size={32} className="sm:w-9 sm:h-9" />
          <span className="text-base sm:text-lg font-extrabold text-white font-display leading-none">
            MVP <span className="text-purple-400">AGENCY</span>
          </span>
        </div>

        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          Telegram {TELEGRAM_HANDLE}
        </a>

        <div className="text-[11px] sm:text-xs text-zinc-400 font-medium">
          © {new Date().getFullYear()} MVP AGENCY. Все права защищены.
        </div>
      </div>
    </div>
  </footer>
);
