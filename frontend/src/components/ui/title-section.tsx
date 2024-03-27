"use client";

import { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TextGenerateEffect } from "./text-generate-effect";


export function AnimatedTitle() {
  const text = 'TraderML';
  const words = 'Compare your sentiment-based machine learning trading strategy with historical data';

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
    //   y: `0.25em`,
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
    <div className='graph-animation flex justify-center items-center'>
    <video autoPlay muted playsInline>
        <source src='graph-animation.mov' type="video/mp4" />
    </video>
    <div className='flex flex-col items-center justify-center'>
    <div className="flex text-8xl font-bold text-white mb-8" aria-label={text} role="heading">
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
          whileHover={{ y: '-20px'}}
          transition={{ duration: 0.5 }}
        >
          {character}
        </motion.span>
      ))}
    </div>

    <TextGenerateEffect words={words}/>
    
    </div>
    </div>
  );
}