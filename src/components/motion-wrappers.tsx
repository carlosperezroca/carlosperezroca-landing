'use client';

import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export function FloatingOrb({ className }: { className: string }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], opacity: [0.35, 0.55, 0.35] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute rounded-full blur-3xl ${className}`}
    />
  );
}

export function FadeInUp({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInScale({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
