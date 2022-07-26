import type { FC } from "react";

type FormInputT = {
  text: string;
  label: string;
  type: "text" | "password" | "number" | "email" | "tel";
  defaultValue?: string | number;
  disabled?: boolean;
  error?: string;
};

const FormInput: FC<FormInputT> = ({ text, label, type, defaultValue, disabled, error }) => {
  return (
    <div className="field">
      <label className="label" htmlFor={label}>
        <span className="field-text">{text}</span>
        <input
          className={`field-input ${error ? "invalid-input" : ""}`}
          type={type}
          id={label}
          name={label}
          defaultValue={defaultValue}
          disabled={disabled}
        />
      </label>
      <div className="error">{error}</div>
    </div>
  );
};

export default FormInput;
