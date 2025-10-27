import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import dashboardImg from "../../assets/Dashboard.png";

export default function DashboardSection() {
  const { t, i18n } = useTranslation();

  // const features = [
  //   {
  //     title: t("dashboard.feature1.title"),
  //     desc: t("dashboard.feature1.desc"),
  //   },
  //   {
  //     title: t("dashboard.feature2.title"),
  //     desc: t("dashboard.feature2.desc"),
  //   },
  //   {
  //     title: t("dashboard.feature3.title"),
  //     desc: t("dashboard.feature3.desc"),
  //   },
  //   {
  //     title: t("dashboard.feature4.title"),
  //     desc: t("dashboard.feature4.desc"),
  //   },
  // ];

  return (
    <section className="px-6 md:px-12 py-20 bg-white text-center overflow-hidden">
      {/* Heading */}
      <motion.div
        className="max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2
          className={`font-bold leading-snug ${
            i18n.language === "de"
              ? "text-3xl md:text-[1.9rem]" // Slightly smaller for German text
              : "text-3xl md:text-4xl"
          }`}
        >
          {t("dashboard.title")} <br />
          <span className="text-indigo-600">{t("dashboard.subtitle")}</span>
        </h2>
        <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
          {t("dashboard.description")}
        </p>
      </motion.div>

      {/* Dashboard Image */}
      <motion.div
        className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src={dashboardImg}
          alt="Dashboard Preview"
          className="w-full"
          // whileHover={{ scale: 1.03, y: -5 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </motion.div>

      {/* Features */}
      {/* <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {features.map((item, index) => (
          <motion.div
            key={index}
            className="text-center space-y-3 p-4 rounded-lg hover:shadow-md transition bg-white"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-semibold">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              {t("dashboard.learnMore")} →
            </a>
          </motion.div>
        ))}
      </motion.div> */}

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          // whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base md:text-lg"
        >
          {t("dashboard.cta")}
        </motion.button>
      </motion.div>
    </section>
  );
}
