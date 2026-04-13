"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const tiles = [
  { className: "col-span-2 row-span-2 bg-primary rounded-2xl" },
  { className: "col-span-1 row-span-1 bg-[#d2d9f8] rounded-2xl" },
  { className: "col-span-2 row-span-1 bg-[#ff8b9a]/40 rounded-2xl" },
  { className: "col-span-1 row-span-2 bg-[#e5e1e6] rounded-2xl mt-8" },
  { className: "col-span-2 row-span-2 bg-[#e2e9ec] rounded-2xl -mt-12" },
  { className: "col-span-2 row-span-1 bg-[#ffb7a1] rounded-2xl" },
  { className: "col-span-2 row-span-1 bg-[#e2dfff] rounded-2xl" },
];

export function AuthMosaic() {
  return (
    <section className="hidden lg:flex lg:w-1/2 bg-card relative items-center justify-center p-20 overflow-hidden border-r border-border">
      <div className="z-10 w-full max-w-2xl">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 20,
            delay: 0.1,
          }}
        >
          <Image
            src="/plan-selector-logo.svg"
            alt="Logo"
            width={36}
            height={36}
          />
          <span className="font-heading font-bold text-lg text-foreground">
            Cotizador
          </span>
        </motion.div>

        {/* Mosaic Grid */}
        <div
          className="grid mb-16 opacity-90"
          style={{
            gridTemplateColumns: "repeat(6, 1fr)",
            gridAutoRows: "100px",
            gap: "1.5rem",
          }}
        >
          {tiles.map((tile, i) => (
            <motion.div
              key={i}
              className={tile.className}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: i * 0.06,
              }}
            />
          ))}
        </div>

        {/* Headline */}
        <motion.h1
          className="font-heading text-5xl font-extrabold tracking-tight text-foreground leading-tight max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 20,
            delay: 0.4,
          }}
        >
          Encuentra el plan perfecto para ti en segundos.
        </motion.h1>
        <motion.p
          className="mt-6 text-muted-foreground text-lg max-w-sm leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 20,
            delay: 0.52,
          }}
        >
          Descubre tu plan ideal en segundos. Compara opciones y elige la mejor
          para ti.
        </motion.p>
      </div>

      {/* Ambient glow */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
