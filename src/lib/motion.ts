import { Variants, Transition } from "framer-motion";

/**
 * Standard enterprise easing & spring transitions
 */
export const transitions: Record<string, Transition> = {
  snappy: {
    type: "spring",
    stiffness: 380,
    damping: 28,
  },
  gentle: {
    type: "spring",
    stiffness: 220,
    damping: 22,
  },
  smooth: {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1], // easeOutExpo
  },
};

/**
 * Standard container variants for staggered children
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

/**
 * Fade in variant
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

/**
 * Slide up with fade variant (Ideal for metric cards & tables)
 */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: transitions.snappy,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
};

/**
 * Scale in variant (Dialogs, popovers, badges)
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: transitions.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.12 },
  },
};

/**
 * Interactive card hover effect
 */
export const cardInteractive = {
  rest: { y: 0, transition: transitions.smooth },
  hover: { y: -2, transition: transitions.snappy },
};
