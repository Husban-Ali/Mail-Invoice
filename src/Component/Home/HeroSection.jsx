import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Hero from "../../assets/Hero.png";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 md:py-20 bg-white overflow-hidden">
      {/* Left Text */}
      <motion.div
        className="w-full md:w-[48%] space-y-5 text-center md:text-left"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold font-dm leading-tight">
          {t("hero.title")}
        </h2>
        <p className="text-lg text-gray-600 font-inter leading-relaxed max-w-md mx-auto md:mx-0">
          {t("hero.subtitle")}
        </p>
        <motion.button
          // whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-black text-white rounded-lg border border-black hover:bg-white hover:text-black transition-all"
        >
          {t("hero.button")}
        </motion.button>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="w-full md:w-[48%] mt-10 md:mt-0 flex justify-center"
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.img
          src={Hero}
          alt="hero"
          className="rounded-xl shadow-md w-72 sm:w-80 md:w-[420px] object-contain"
          whileHover={{ scale: 1.03 }}
        />
      </motion.div>
    </section>
  );
}
