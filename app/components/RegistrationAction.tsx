import { Form } from "@remix-run/react";
import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";

type RegistrationActionT = {
  courseId: CourseModelT["id"];
  isDisabled: boolean;
  variant: "draft" | "undraft";
};

const RegistrationAction: FC<RegistrationActionT> = ({ isDisabled, courseId, variant }) => {
  return (
    <Form method="post" action={`edit`}>
      <input type="hidden" id="courseId" name="courseId" value={courseId} />
      <input type="hidden" id="_action" name="_action" value={variant} />
      <button type="submit" disabled={isDisabled}>
        {variant === "draft" ? "+" : "-"}
      </button>
    </Form>
  );
};

export default RegistrationAction;
