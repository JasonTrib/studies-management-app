import type { FC } from "react";
import { useRef } from "react";

type FormInputT = {
  text?: string;
  label: string;
  min?: string;
  max?: string;
  defaultValue?: string | number;
  disabled?: boolean;
  error?: string;
};

const FormInput: FC<FormInputT> = ({ text, label, min, max, defaultValue, disabled, error }) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="field">
      <label className="label" htmlFor={label}>
        {text && <span className="field-text">{text}</span>}
        <input
          className={`field-input date ${error ? "invalid-input" : ""}`}
          id={label}
          ref={ref}
          name={label}
          type="date"
          min={min}
          max={max}
          defaultValue={defaultValue}
          disabled={disabled}
          onClick={() => ref.current?.showPicker()}
        />
      </label>
      <div className="error">{error}</div>
    </div>
  );
};

export default FormInput;
