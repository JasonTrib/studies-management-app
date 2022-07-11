import type { FC } from "react";

const ActionButton: FC = ({ children }) => {
  return <button className="action-button">{children}</button>;
};

export default ActionButton;
