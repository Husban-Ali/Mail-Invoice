import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Resources() {
  const { t } = useTranslation();
  
  const resources = [
    {
      title: t("resourcesPage.designGuidelines.title"),
      desc: t("resourcesPage.designGuidelines.desc"),
      img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
      link: "#",
    },
    {
      title: t("resourcesPage.devTools.title"),
      desc: t("resourcesPage.devTools.desc"),
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      link: "#",
    },
    {
      title: t("resourcesPage.learning.title"),
      desc: t("resourcesPage.learning.desc"),
      img: "https://images.unsplash.com/photo-1555529771-35a38b34c7e5?auto=format&fit=crop&w=800&q=80",
      link: "#",
    },
    {
      title: t("resourcesPage.community.title"),
      desc: t("resourcesPage.community.desc"),
      img: "https://images.unsplash.com/photo-1581092334409-21d8b7d3e1f9?auto=format&fit=crop&w=800&q=80",
      link: "#",
    },
  ];

  return (
    <section className="px-6 md:px-20 py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("resourcesPage.title")}</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t("resourcesPage.subtitle")}
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {resources.map((res, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={res.img}
              alt={res.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 text-left">
              <h3 className="text-lg font-semibold mb-2">{res.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{res.desc}</p>
              <a
                href={res.link}
                className="text-indigo-600 font-medium hover:underline"
              >
                {t("resourcesPage.learnMore")} →
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
