import React from "react";
import { motion } from "framer-motion";

export default function Resources() {
  const resources = [
    {
      title: "Design Guidelines",
      desc: "Explore UI/UX best practices and modern design systems for your next project.",
      img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
      link: "#",
    },
    {
      title: "Development Tools",
      desc: "A curated list of tools and frameworks that streamline your workflow.",
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      link: "#",
    },
    {
      title: "Learning Materials",
      desc: "Access free and premium resources to sharpen your coding and design skills.",
      img: "https://images.unsplash.com/photo-1555529771-35a38b34c7e5?auto=format&fit=crop&w=800&q=80",
      link: "#",
    },
    {
      title: "Community Forums",
      desc: "Join communities and discussions to share ideas and grow together.",
      img: "https://images.unsplash.com/photo-1581092334409-21d8b7d3e1f9?auto=format&fit=crop&w=800&q=80",
      link: "#",
    },
  ];

  return (
    <section className="px-6 md:px-20 py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Resources</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover helpful tools, guides, and communities to accelerate your
          learning and productivity.
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
                Learn More →
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
