import { Form, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { FC } from "react";
import ActionButton from "./ActionButton";

type FollowCourseButtonT = {
  courseId: number;
  variant: "follow" | "unfollow";
};

const FollowCourseButton: FC<FollowCourseButtonT> = ({ courseId, variant }) => {
  const transition = useTransition();
  const isBusy = transition.state !== "idle";

  return (
    <Form method="put" action={`/courses/${courseId}?index`}>
      <input type="hidden" id="_action" name="_action" value={variant} />
      <ActionButton type="submit" disabled={isBusy} size="md">
        {_.startCase(variant)}
      </ActionButton>
    </Form>
  );
};

export default FollowCourseButton;
