import type { FC } from "react";

type ActionButtonT = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const ActionButton: FC<ActionButtonT> = ({ onClick, children }) => {
  return (
    <button className="action-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default ActionButton;
