import React from "react";
import { motion } from "framer-motion";

export default function MissionSection() {
  const items = [
    {
      title: "Our Mission",
      desc: "To empower teams and individuals through accessible and impactful software solutions.",
    },
    {
      title: "Our Vision",
      desc: "To become a global leader in innovation-driven digital transformation.",
    },
  ];

  return (
    <section className="px-8 py-16 bg-indigo-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-3">What Drives Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We believe in crafting software that makes everyday work simpler, faster, and smarter.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-8"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
