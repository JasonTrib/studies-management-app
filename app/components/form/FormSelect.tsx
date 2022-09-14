import type { FC } from "react";

type FormSelectT = {
  text: string;
  label: string;
  values: string[];
  optionsText?: string[];
  defaultValue?: string | number;
  disabled?: boolean;
  error?: string;
};

const FormSelect: FC<FormSelectT> = ({
  text,
  label,
  values,
  optionsText,
  defaultValue,
  disabled,
  error,
}) => {
  return (
    <div className="field">
      <label className="label" htmlFor={label}>
        <span className="field-text">{text}</span>
        <select
          id={label}
          name={label}
          disabled={disabled}
          defaultValue={defaultValue}
          className={`field-input select ${error ? "invalid-input" : ""}`}
        >
          {values.map((value, idx) => (
            <option key={value} value={value}>
              {optionsText?.[idx] || value}
            </option>
          ))}
        </select>
      </label>
      <div className="error">{error}</div>
    </div>
  );
};

export default FormSelect;
