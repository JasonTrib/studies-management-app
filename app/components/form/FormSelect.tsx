import type { FC } from "react";

type FormSelectT = {
  text?: string;
  label: string;
  values: string[];
  optionsText?: string[];
  defaultValue?: string | number;
  disabled?: boolean;
  error?: string;
  handleChange?: (e: any) => void;
};

const FormSelect: FC<FormSelectT> = ({
  text,
  label,
  values,
  optionsText,
  defaultValue,
  disabled,
  error,
  handleChange,
}) => {
  return (
    <div className="field">
      <label className="label" htmlFor={label}>
        {text && <span className="field-text">{text}</span>}
        <select
          className={`field-input select ${error ? "invalid-input" : ""}`}
          id={label}
          name={label}
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={handleChange}
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
