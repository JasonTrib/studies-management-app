import type { FC, MouseEventHandler, ReactNode } from "react";

type ActionButtonT = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "reset" | "submit";
};

const ActionButton: FC<ActionButtonT> = ({ children, onClick, type = "button" }) => {
  return (
    <button className="action-button primary" onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default ActionButton;
