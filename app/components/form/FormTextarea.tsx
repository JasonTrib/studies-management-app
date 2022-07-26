import type { FC } from "react";

type FormTextareaT = {
  text: string;
  label: string;
  defaultValue?: string | number;
  disabled?: boolean;
  error?: string;
};

const FormTextarea: FC<FormTextareaT> = ({ text, label, defaultValue, disabled, error }) => {
  return (
    <div className="field">
      <label className="label" htmlFor={label}>
        <span className="field-text">{text}</span>
        <textarea
          className={`field-input textarea ${error ? "invalid-input" : ""}`}
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

export default FormTextarea;
