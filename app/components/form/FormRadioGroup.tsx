import type { FC } from "react";
import React from "react";

type FormRadioGroupT = {
  text: string;
  label: string;
  values: string[];
  defaultChecked?: boolean;
  disabled?: boolean;
  error?: string;
};

const FormRadioGroup: FC<FormRadioGroupT> = ({ text, label, values, disabled, error }) => {
  return (
    <div className="radiogroup-field">
      <span className="field-text">{text}</span>
      <fieldset className="fieldset" id={label}>
        {values.map((value) => (
          <label key={value} className="label" htmlFor={value}>
            <input
              className="radio"
              type="radio"
              value={value}
              id={value}
              name={label}
              disabled={disabled}
            />
            <span>{value}</span>
          </label>
        ))}
      </fieldset>
      <div className="error">{error}</div>
    </div>
  );
};

export default FormRadioGroup;
