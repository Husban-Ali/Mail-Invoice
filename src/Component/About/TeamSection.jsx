import React from "react";
import { motion } from "framer-motion";

export default function TeamSection() {
  const team = [
    {
      img: "https://images.pexels.com/photos/27333761/pexels-photo-27333761/free-photo-of-a-man-with-his-arms-crossed.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      name: "Sebestan",
      role: "Founder & CEO",
    },
    {
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
      name: "David",
      role: "UI/UX Designer",
    },
    {
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      name: "Robert",
      role: "Lead Developer",
    },
  ];

  return (
    <section className="px-8 py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="bg-indigo-50 rounded-xl p-6 shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 object-cover border-4 border-white shadow-md"
              />
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
