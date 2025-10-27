import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import img1 from "../../assets/practice1.png";
import img2 from "../../assets/practice2.png";

export default function ResourcesSection() {
  const { t, i18n } = useTranslation();

  const resources = [
    {
      img: img1,
      title: t("resources.item1.title"),
      desc: t("resources.item1.desc"),
    },
    {
      img: img2,
      title: t("resources.item2.title"),
      desc: t("resources.item2.desc"),
    },
  ];

  return (
    <section className="px-8 py-16 bg-indigo-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className={`font-bold ${
                i18n.language === "de"
                  ? "text-[1.9rem]" // slightly smaller for German
                  : "text-3xl"
              }`}
            >
              {t("resources.title")}
            </h2>
            <p className="mt-2 text-gray-600 max-w-xl leading-relaxed">
              {t("resources.description")}
            </p>
          </motion.div>

          <motion.div
            className="mt-6 md:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base">
              {t("resources.cta")}
            </button>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {resources.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition max-w-md mx-auto p-8 cursor-pointer"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <motion.img
                src={item.img}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
              <div className="p-5 text-left">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
