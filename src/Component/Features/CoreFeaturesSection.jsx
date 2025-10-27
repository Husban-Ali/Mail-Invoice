import React from "react";
import { motion } from "framer-motion";

export default function CoreFeaturesSection() {
  const features = [
    {
      icon: "⚡",
      title: "Fast Performance",
      desc: "Optimized for speed, ensuring smooth experiences even with large datasets.",
    },
    {
      icon: "🔒",
      title: "Secure by Design",
      desc: "Your data is protected with the latest encryption and privacy standards.",
    },
    {
      icon: "🤝",
      title: "Collaboration Tools",
      desc: "Work with your team in real time with shared dashboards and activity tracking.",
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      desc: "Visualize insights instantly with detailed charts and custom reports.",
    },
    {
      icon: "☁️",
      title: "Cloud Integrated",
      desc: "Seamlessly connect with cloud services to keep your workflow in sync.",
    },
    {
      icon: "⚙️",
      title: "Customizable Workflows",
      desc: "Adapt the platform to your needs with flexible configuration options.",
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
          Key Features
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Each feature is built to save you time, enhance productivity, and bring simplicity to complex workflows.
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
