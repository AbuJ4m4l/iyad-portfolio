"use client";

import { motion } from "framer-motion";
import { Youtube } from "lucide-react";
import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-zinc-300 border-t border-zinc-800 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* اسمك وشعارك */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
            Iyad Almsara
          </h2>
          <p className="text-sm mt-2 text-zinc-400">Creative Motion Editor.</p>
        </motion.div>

        {/* Follow Me */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center md:text-right"
        >
          <h3 className="text-lg font-semibold mb-3 text-white">Follow Me</h3>
          <div className="flex space-x-6 justify-center md:justify-end">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="hover:text-yellow-400"
            >
              <FaInstagram size={22} />
            </Link>
            <Link
              href="https://tiktok.com"
              target="_blank"
              className="hover:text-yellow-400"
            >
              <FaTiktok size={22} />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              className="hover:text-yellow-400"
            >
              <Youtube size={22} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* خط تحتاني */}
      <div className="border-t border-zinc-800 py-4 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} HardwareZone. All rights reserved.
      </div>
    </footer>
  );
}
