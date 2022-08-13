import type { FC, MouseEventHandler, ReactNode } from "react";

type ActionButtonT = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const ActionButton: FC<ActionButtonT> = ({ children, onClick }) => {
  return (
    <button className="action-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default ActionButton;
