import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import thumbnail from "../../assets/thumbnail.png";
import vid from "../../assets/video.mp4";
import play from "../../assets/play.png";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="px-6 md:px-12 py-12 md:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative rounded-2xl border-4 border-gray-200 overflow-hidden shadow-lg"
        >
          <AnimatePresence mode="wait">
            {!isPlaying ? (
              <motion.div
                key="thumbnail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Thumbnail */}
                <img
                  src={thumbnail}
                  alt="demo video"
                  className="w-full h-auto rounded-xl"
                />

                {/* Play Button */}
                <motion.button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="rounded-full w-16 h-16 sm:w-20 sm:h-20 bg-black bg-opacity-60 flex items-center justify-center"
                  >
                    <img src={play} alt="play" className="w-8 sm:w-10" />
                  </motion.div>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative pb-[56.25%] h-0"
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src={vid}
                  title="Demo Video"
                  frameBorder="0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                ></iframe>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
