import type { FC } from "react";
import { useRef } from "react";

type FormInputT = {
  text: string;
  label: string;
  defaultValue?: string | number;
  disabled?: boolean;
  error?: string;
};

const FormInput: FC<FormInputT> = ({ text, label, defaultValue, disabled, error }) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="field">
      <label className="label" htmlFor={label}>
        <span className="field-text">{text}</span>
        <input
          className={`field-input ${error ? "invalid-input" : ""}`}
          id={label}
          ref={ref}
          name={label}
          type="date"
          disabled={disabled}
          defaultValue={defaultValue}
          onClick={() => ref.current?.showPicker()}
        />
      </label>
      <div className="error">{error}</div>
    </div>
  );
};

export default FormInput;
