import type { FC } from "react";

const BarePage: FC = ({ children }) => {
  return (
    <div className="bare-page-layout">
      <div className="topbar">
        <h1>Unilumnus</h1>
      </div>
      <div className="page">{children}</div>
    </div>
  );
};

export default BarePage;
