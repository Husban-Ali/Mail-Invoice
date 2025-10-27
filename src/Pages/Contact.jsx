import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white overflow-hidden">
      {/* Left Text */}
      <motion.div
        className="w-full md:w-[48%] space-y-5 text-center md:text-left"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold font-dm leading-tight">
          Get in Touch With Us
        </h2>
        <p className="text-lg text-gray-600 font-inter leading-relaxed max-w-md mx-auto md:mx-0">
          Have questions, feedback, or ideas? We’d love to hear from you.
          Reach out and our team will get back to you as soon as possible.
        </p>

         <div className="space-y-3 mt-6">
          <p className="text-gray-700">
            📍 <span className="font-medium">Address:</span>  
            Alexanderplatz 5, 10178 Berlin, Germany
          </p>
          <p className="text-gray-700">
            📞 <span className="font-medium">Phone:</span> +49 30 1234567
          </p>
          <p className="text-gray-700">
            📧 <span className="font-medium">Email:</span> hello@digitalhaus.de
          </p>
        </div>
      </motion.div>

      {/* Right Contact Form */}
      <motion.div
        className="w-full md:w-[48%] mt-10 md:mt-0 bg-indigo-50 rounded-xl shadow p-6"
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Write your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </section>
  );
}
