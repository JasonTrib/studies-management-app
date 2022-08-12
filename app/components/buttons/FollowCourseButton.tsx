import { Form, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { FC } from "react";

type FollowCourseButtonT = {
  courseId: number;
  variant: "follow" | "unfollow";
};

const FollowCourseButton: FC<FollowCourseButtonT> = ({ courseId, variant }) => {
  const transition = useTransition();
  const isBusy = transition.state !== "idle";

  return (
    <Form method="post" action={"#"}>
      <input type="hidden" id="courseId" name="courseId" value={courseId} />
      <input type="hidden" id="_action" name="_action" value={variant} />
      <button className="action-button" type="submit" disabled={isBusy}>
        {_.startCase(variant)}
      </button>
    </Form>
  );
};

export default FollowCourseButton;
