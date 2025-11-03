import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HighlightSection() {
  const { t } = useTranslation();
  
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white overflow-hidden">
      {/* Image */}
      <motion.div
        className="w-full md:w-[48%] mb-10 md:mb-0 flex justify-center"
        initial={{ x: -80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1000&q=80"
          alt="highlight"
          className="rounded-xl shadow-md w-72 sm:w-80 md:w-[420px] object-cover"
          whileHover={{ scale: 1.03 }}
        />
      </motion.div>

      {/* Text */}
      <motion.div
        className="w-full md:w-[48%] text-center md:text-left"
        initial={{ x: 80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-4">{t("features.highlight.title")}</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          {t("features.highlight.desc")}
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-black text-white rounded-lg border border-black hover:bg-white hover:text-black transition-all"
        >
          {t("features.highlight.learnMore")}
        </motion.button>
      </motion.div>
    </section>
  );
}
