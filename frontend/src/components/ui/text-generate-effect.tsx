"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    const timer = setTimeout(() => {
      animate(
        "span",
        {
          opacity: 1,
        },
        {
          duration: 2,
          delay: stagger(0.2),
        }
      );
    }, 3300); // Delay in milliseconds
  
    return () => clearTimeout(timer); // Clean up on component unmount
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div className='flex flex-wrap' ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-white opacity-0 flex mr-2"
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("", className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
