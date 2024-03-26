"use client";

import { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";


export function AnimatedTitle() {
  const text = 'TraderML';
  
  const ctrls = useAnimation();
  
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView) {
      ctrls.start("visible");
    }
    if (!inView) {
      ctrls.start("hidden");
    }
  }, [ctrls, inView]);
  
  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: `0.5em`,
    },
    visible: (custom: number) => ({
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        delay: custom * 0.1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  };
  
  return (
    <div className="flex justify-center text-6xl font-semibold" aria-label={text} role="heading">
      {text.split("").map((character, index) => (
        <motion.span
          ref={ref}
          aria-hidden="true"
          key={index}
          initial="hidden"
          animate={ctrls}
          variants={characterAnimation}
          custom={index}
          className="inline-block mr-[0.05em]"
        >
          {character}
        </motion.span>
      ))}
    </div>
  );
}