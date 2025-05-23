"use client";

import { useTranslations } from "next-intl";
import "@/components/landing/landingStyles.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { LandingNav } from "./landingnav";
gsap.registerPlugin(TextPlugin);

const HeroSection = () => {
  const t = useTranslations("Landing");
  const videoRef = useRef(null);
  const animationsInitialized = useRef(false);

  // Initialize animations when video is loaded
  const initializeAnimations = () => {
    if (animationsInitialized.current) return;
    animationsInitialized.current = true;

    // Labels animations
    gsap.to("#lumaFeaturesLabel", {
      text: t('headerLumaDescription'),
      duration: 1
    });

    gsap.to("#astroFacilities", {
      text: t('headerAstroFacilities'),
      duration: 1
    });

    // Circles animations
    [...Array(6)].forEach((_, index) => {
      gsap.to(`#circle-${index}`, {
        x: -100 + index * 20, // Posición final
        duration: 0.6,
        ease: "back.inOut(1.7)"
      });
    });

    ["L", "U", "M", "A"].forEach((letter, index) => {
      gsap.to(`#letter-${letter}`, {
        y: 0, // Posición final (restablecida)
        duration: 0.6 + index * 0.3,
        ease: "back.inOut(1.7)"
      });
    });
  };

  useEffect(() => {
    // Add event listener to ensure video loads completely
    const video = videoRef.current;
    
    if (video) {
      // When video can play through, it means it's fully loaded
      const handleVideoReady = () => {
        initializeAnimations();
      };
      
      video.addEventListener('canplaythrough', handleVideoReady);
      
      // If video is already loaded (from cache)
      if (video.readyState >= 3) {
        initializeAnimations();
      }
      
      return () => {
        video.removeEventListener('canplaythrough', handleVideoReady);
      };
    }
  }, []);

  return (
    <header className="relative w-svw h-svh flex overflow-hidden select-none text-white">
      <div className="block z-10 w-full h-full mix-blend-exclusion antialiased text-white">
        <LandingNav />
        <div className="absolute flex flex-row items-center text-[25vw] md:text-[20vw] font-clash font-semibold
             top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden h-[1em]">
          {"LUMA".split("").map((letter, index) =>
            <p
              id={`letter-${letter}`}
              key={index}
              className="transform translate-y-[100%]"
            >
              {letter}
            </p>
          )}
        </div>

        <div className="absolute bottom-4 md:bottom-6 flex flex-row w-full justify-between items-end px-4 md:px-6">
          <div>
            <p
              id="lumaFeaturesLabel"
              className="font-archivo font-light text-xs max-w-[40vw] md:max-w-[20vw] leading-3"
            />
          </div>
          <div>
            <div className="flex w-full justify-end items-baseline">
              <div className="relative w-8 h-8 md:w-16 md:h-16 mb-2">
                {[...Array(6)].map((_, index) =>
                  <div
                    key={index}
                    id={`circle-${index}`}
                    className="absolute top-0 left-0 w-8 h-8 md:w-16 md:h-16 bg-none border-white border-2 rounded-full"
                  />
                )}
              </div>
            </div>
            <p
              id="astroFacilities"
              className="text-end font-archivo font-light text-xs max-w-[40vw] md:max-w-[20vw] leading-3"
            />
          </div>
        </div>
      </div>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/bgSunVideo.mp4" type="video/mp4" />
      </video>
    </header>
  );
};

export default HeroSection;