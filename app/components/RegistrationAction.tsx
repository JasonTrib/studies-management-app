import { Form } from "@remix-run/react";
import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import ActionButton from "./buttons/ActionButton";

type RegistrationActionT = {
  courseId: CourseModelT["id"];
  isDisabled: boolean;
  action: "draft" | "undraft";
};

const RegistrationAction: FC<RegistrationActionT> = ({ isDisabled, courseId, action }) => {
  return (
    <div className="action-box">
      <Form method="post" action={`edit`}>
        <input type="hidden" id="courseId" name="courseId" value={courseId} />
        <input type="hidden" id="_action" name="_action" value={action} />
        <ActionButton
          className="action-button"
          type="submit"
          variant={action === "draft" ? "primary" : "danger"}
          disabled={isDisabled}
        >
          {action === "draft" ? "+" : "-"}
        </ActionButton>
      </Form>
    </div>
  );
};

export default RegistrationAction;
