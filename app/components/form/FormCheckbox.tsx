import type { FC } from "react";

type FormCheckboxT = {
  text: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  error?: string;
};

const FormCheckbox: FC<FormCheckboxT> = ({ text, label, defaultChecked, disabled, error }) => {
  return (
    <div className="checkbox-field">
      <label className="label" htmlFor={label}>
        <input
          className={`checkbox ${error ? "invalid-input" : ""}`}
          type="checkbox"
          id={label}
          name={label}
          defaultChecked={defaultChecked}
          disabled={disabled}
        />
        <span className="field-text">{text}</span>
      </label>
      <div className="error">{error}</div>
    </div>
  );
};

export default FormCheckbox;
