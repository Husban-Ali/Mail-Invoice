import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function AboutHeroSection() {
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
          {t("about.hero.title", "About Our Journey")}
        </h2>
        <p className="text-lg text-gray-600 font-inter leading-relaxed max-w-md mx-auto md:mx-0">
          {t(
            "about.hero.subtitle",
            "We’re a passionate team building innovative digital solutions to simplify your workflow."
          )}
        </p>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="w-full md:w-[48%] mt-10 md:mt-0 flex justify-center"
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80"
          alt="about our team"
          className="rounded-xl shadow-md w-72 sm:w-80 md:w-[420px] object-cover"
          whileHover={{ scale: 1.03 }}
        />
      </motion.div>
    </section>
  );
}
