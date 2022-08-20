import { Form } from "@remix-run/react";
import type { FC } from "react";
import type { z } from "zod";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import type { SchemaErrorsT } from "~/validations/formValidation.server";
import type { courseSchema } from "~/validations/schemas/courseSchema.server";
import FormCheckbox from "./FormCheckbox";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";

type SchemaT = z.infer<typeof courseSchema>;

type CourseFormType = {
  action: string;
  _action?: string;
  dep: string;
  defaultData?: CourseModelT;
  disabled: boolean;
  errors?: SchemaErrorsT<SchemaT> | null;
};

const CourseForm: FC<CourseFormType> = ({
  action,
  _action,
  dep,
  defaultData,
  disabled,
  errors,
}) => {
  return (
    <Form method="post" action={action} className="form" autoComplete="off">
      <div className="form-fields">
        <FormInput
          text="Title"
          label="title"
          type="text"
          defaultValue={defaultData?.title}
          disabled={disabled}
          error={errors?.title}
        />
        <FormTextarea
          text="Description"
          label="description"
          defaultValue={defaultData?.description || undefined}
          disabled={disabled}
          error={errors?.description}
        />
        <FormInput
          text="Semester"
          label="semester"
          type="number"
          defaultValue={defaultData?.semester}
          disabled={disabled}
          error={errors?.semester}
        />
        <FormCheckbox
          text="Elective"
          label="isElective"
          defaultChecked={defaultData?.is_elective}
          disabled={disabled}
          error={errors?.isElective}
        />
        <FormCheckbox
          text="Postgraduate"
          label="isPostgraduate"
          defaultChecked={defaultData?.is_postgraduate}
          disabled={disabled}
          error={errors?.isPostgraduate}
        />
        <FormCheckbox
          text="Public"
          label="isPublic"
          defaultChecked={defaultData?.is_public}
          disabled={disabled}
          error={errors?.isPublic}
        />
      </div>
      <div className="form-submit">
        <input type="hidden" id="dep" name="dep" value={dep} />
        <button className="form-reset" type="reset" disabled={disabled}>
          ✖
        </button>
        <button
          className="action-button primary submit-button"
          type="submit"
          disabled={disabled}
          name="_action"
          value={_action}
        >
          SUBMIT
        </button>
      </div>
    </Form>
  );
};

export default CourseForm;
