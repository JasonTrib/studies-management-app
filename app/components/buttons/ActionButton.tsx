import type { FC, ReactNode } from "react";

type ActionButtonT = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "cancel";
  fullwidth?: boolean;
  size?: "sm" | "md" | "lg" | "custom";
  children: ReactNode;
};

const ActionButton: FC<ActionButtonT> = ({
  className,
  type = "button",
  variant = "primary",
  fullwidth,
  size,
  children,
  ...props
}) => {
  const classFullwidth = fullwidth ? "full-width" : "";
  if (type === "submit" && !size) {
    size = "lg";
  } else if (!size) {
    size = "md";
  }

  return (
    <button
      className={`action-button ${variant} ${classFullwidth} btn-${size} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
