/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { CustomCursor, ScrollProgressBar, Preloader, MobileBottomBar } from './components/UI';
import { Header } from './components/Header';
import {
  HeroSection,
  ModelSection,
  ServicesSection,
  CasesSection,
  FaqSection,
  ContactSection,
  FooterSection,
} from './components/Sections';
import type { PackageName } from './lib/site';

const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
);

export default function App() {
  // Формат, выбранный кнопкой "Выбрать ..." в тарифах; уходит вместе с заявкой
  const [selectedPackage, setSelectedPackage] = useState<PackageName | null>(null);
  const clearPackage = useCallback(() => setSelectedPackage(null), []);

  return (
    // reducedMotion="user": если в системе выключена анимация, движение на сайте отключается
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-[#070709] text-[#f3f4f6] selection:bg-purple-500 selection:text-white relative">
        <CustomCursor />
        <ScrollProgressBar />
        <Preloader />

        <Header />

        <main className="w-full">
          <HeroSection />

          <SectionWrapper>
            <ModelSection />
          </SectionWrapper>

          <SectionWrapper>
            <ServicesSection onSelectPackage={setSelectedPackage} />
          </SectionWrapper>

          <SectionWrapper>
            <CasesSection />
          </SectionWrapper>

          <SectionWrapper>
            <FaqSection />
          </SectionWrapper>

          <SectionWrapper>
            <ContactSection selectedPackage={selectedPackage} onClearPackage={clearPackage} />
          </SectionWrapper>
        </main>

        <FooterSection />
        <MobileBottomBar />
      </div>
    </MotionConfig>
  );
}
