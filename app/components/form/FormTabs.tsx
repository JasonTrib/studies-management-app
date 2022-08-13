import type { FC } from "react";

type FormTabsT = {
  tabs: string[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const FormTabs: FC<FormTabsT> = ({ tabs, selected, setSelected }) => {
  const handleClick = (e: any) => {
    setSelected(e.target.innerText);
  };

  return (
    <div className="form-tabs">
      {tabs.map((tab) => (
        <h2
          className={`heading tab-option ${tab === selected ? "selected" : ""}`}
          onClick={handleClick}
          key={tab}
        >
          {tab}
        </h2>
      ))}
    </div>
  );
};

export default FormTabs;
