import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", solid = false, hover = true, as: Component = motion.div, ...rest }) {
  return (
    <Component
      className={`${solid ? "glass-card-solid" : "glass-card"} p-6 ${
        hover ? "transition-transform duration-300 hover:-translate-y-1" : ""
      } ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </Component>
  );
}
