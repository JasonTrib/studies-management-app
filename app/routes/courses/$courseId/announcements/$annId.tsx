import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import Announcement, { links as AnnouncementLinks } from "~/components/announcements/Announcement";
import ActionButton from "~/components/buttons/ActionButton";
import DeleteIcon from "~/components/icons/DeleteIcon";
import Page from "~/components/layout/Page";
import Modal from "~/components/Modal";
import { getAnnouncement } from "~/DAO/announcementDAO.server";
import {
  getIsProfessorFollowingCourse,
  getIsProfessorLecturingCourse,
  getIsStudentFollowingCourse,
} from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { bc_courses_id_anns_id } from "~/utils/breadcrumbs";
import { paramToInt } from "~/utils/utils";
import { logout, requireUser } from "~/utils/session.server";

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_id_anns_id>>;
  announcement: Exclude<Awaited<ReturnType<typeof getAnnouncement>>, null>;
  canDeleteAnn: boolean;
};

export const links: LinksFunction = () => {
  return [...AnnouncementLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const annId = paramToInt(params.annId);
  const courseId = paramToInt(params.courseId);
  if (annId === null || courseId === null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);

  const announcement = await getAnnouncement(annId);
  if (!announcement || announcement.course_id !== courseId) {
    throw new Response("Not Found", { status: 404 });
  }

  let isFollowing: boolean;
  let canDeleteAnn = false;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      canDeleteAnn = true;
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      isFollowing = await getIsProfessorFollowingCourse(prof.id, announcement.course_id);
      if (!isFollowing) throw new Response("Forbidden", { status: 403 });

      canDeleteAnn = await getIsProfessorLecturingCourse(prof.id, announcement.course_id);
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();

      isFollowing = await getIsStudentFollowingCourse(student.id, announcement.course_id);
      if (!isFollowing) throw new Response("Forbidden", { status: 403 });
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_id_anns_id(path);

  return json({ announcement, canDeleteAnn, breadcrumbData });
};

const AnnouncementDetailsPage = () => {
  const { announcement, canDeleteAnn, breadcrumbData } = useLoaderData() as LoaderDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const headingActions = (): JSX.Element | null => {
    return canDeleteAnn ? (
      <div className="svg-danger">
        <DeleteIcon className="icon" width={24} height={24} onClick={openModal} />
      </div>
    ) : null;
  };

  return (
    <Page wide breadcrumbs={breadcrumbData} Actions={headingActions()}>
      <>
        <Announcement data={announcement} />
        {canDeleteAnn && (
          <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="modal-heading">Are you sure you want to delete this announcement?</div>
            <div className="modal-actions">
              <Form
                method="post"
                action={`/announcements/${announcement.id}/delete`}
                autoComplete="off"
              >
                <input
                  type="hidden"
                  id="redirectTo"
                  name="redirectTo"
                  value={`/courses/${announcement.course_id}/announcements`}
                />
                <ActionButton type="submit" disabled={isBusy} variant="danger" fullwidth>
                  DELETE
                </ActionButton>
              </Form>
              <ActionButton onClick={closeModal} variant="cancel" size="lg">
                CANCEL
              </ActionButton>
            </div>
          </Modal>
        )}
      </>
    </Page>
  );
};

export default AnnouncementDetailsPage;
