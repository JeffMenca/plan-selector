"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShieldCheck, SlidersHorizontal, FileText } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Cotiza en tu área",
    description:
      "Ingresa tu código postal y fecha de inicio para ver los planes de seguros suplementarios y de salud disponibles en tu zona.",
  },
  {
    icon: SlidersHorizontal,
    title: "Personaliza tu cotización",
    description:
      "Elige frecuencia de pago, sexo y fecha de nacimiento para obtener una cotización ajustada a tu perfil.",
  },
  {
    icon: ShieldCheck,
    title: "Compara coberturas y primas",
    description:
      "Revisa la prima mensual, deducibles y beneficios de cada plan de seguro en un solo lugar.",
  },
  {
    icon: FileText,
    title: "Consulta el detalle del seguro",
    description:
      "Abre cualquier plan para ver su resumen completo: aseguradora, tipo de emisión, coberturas y beneficios incluidos.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 160, damping: 22 },
  },
};

export function DashboardHero() {
  return (
    <div className="px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-14 max-w-5xl mx-auto w-full">
      {/* Hero */}
      <motion.div
        className="mb-14"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Animated icon cluster */}
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0">
            {/* Outer pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-full bg-primary/15"
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Inner ring */}
            <motion.span
              className="absolute inset-1.5 rounded-full bg-primary/10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
            {/* Icon container */}
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck
                size={24}
                className="text-primary"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>

          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full">
            Cotizador de seguros
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-5"
        >
          Cotiza tu plan de seguro
          <br className="hidden sm:block" /> suplementario o de salud
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-10"
        >
          Compara opciones de seguros suplementarios y de salud disponibles en
          tu área. Obtén una cotización personalizada en segundos y elige la
          cobertura que mejor se adapta a ti.
        </motion.p>

        <motion.div
          variants={fadeUp}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Link
            href="/dashboard/search"
            className="inline-flex items-center gap-2.5 h-14 px-10 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            <Search size={18} strokeWidth={2} />
            Cotizar ahora
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {features.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={title}
            variants={fadeUp}
            custom={i}
            whileHover={{
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="bg-card rounded-2xl p-8 border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-colors"
          >
            <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mb-5">
              <Icon size={22} className="text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 160,
          damping: 22,
          delay: 0.55,
        }}
        className="mt-10 rounded-2xl bg-primary/8 border border-primary/15 px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <p className="font-heading font-bold text-foreground">
            ¿Listo para cotizar?
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Obtén tu cotización de seguro en menos de un minuto.
          </p>
        </div>
        <motion.div whileTap={{ scale: 0.98 }} className="shrink-0">
          <Link
            href="/dashboard/search"
            className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <Search size={16} strokeWidth={2} />
            Cotizar ahora
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
