import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CoreFeaturesSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: "⚡",
      title: t("features.core.performance.title"),
      desc: t("features.core.performance.desc"),
    },
    {
      icon: "🔒",
      title: t("features.core.secure.title"),
      desc: t("features.core.secure.desc"),
    },
    {
      icon: "🤝",
      title: t("features.core.collaboration.title"),
      desc: t("features.core.collaboration.desc"),
    },
    {
      icon: "📊",
      title: t("features.core.analytics.title"),
      desc: t("features.core.analytics.desc"),
    },
    {
      icon: "☁️",
      title: t("features.core.cloud.title"),
      desc: t("features.core.cloud.desc"),
    },
    {
      icon: "⚙️",
      title: t("features.core.workflows.title"),
      desc: t("features.core.workflows.desc"),
    },
  ];

  return (
    <section className="px-8 py-16 bg-indigo-50 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t("features.core.title")}
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {t("features.core.subtitle")}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
