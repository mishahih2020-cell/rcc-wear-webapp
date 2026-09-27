import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./Button.module.css";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface ButtonProps extends NativeButtonProps {
  variant?: "primary" | "dark" | "outline" | "ghost";
  size?: "default" | "small";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  className,
  children,
  ...rest
}: ButtonProps) {
  const variantClass = styles[variant];
  const sizeClass = size === "small" ? styles.small : "";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`${styles.button} ${variantClass} ${sizeClass} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
