import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Hero from "../../assets/Hero.png";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24 py-16 bg-white overflow-hidden">
      {/* Left Text */}
      <motion.div
        className="w-full md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left flex flex-col justify-center"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-dm leading-tight text-gray-900">
          {t("hero.title")}
        </h2>
        <p className="text-base md:text-lg text-gray-600 font-inter leading-relaxed max-w-xl mx-auto md:mx-0">
          {t("hero.subtitle")}
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-black text-white rounded-lg border border-black hover:bg-white hover:text-black transition-all self-center md:self-start"
        >
          {t("hero.button")}
        </motion.button>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <motion.img
          src={Hero}
          alt="hero"
          className="w-[600px] md:w-[700px] h-auto object-contain drop-shadow-lg"
          whileHover={{ scale: 1.02 }}
        />
      </motion.div>
    </section>
  );
}