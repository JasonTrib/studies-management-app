import { Form, Link, useTransition } from "@remix-run/react";
import type { FC } from "react";
import { useState } from "react";
import DeleteIcon from "~/components/icons/DeleteIcon";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import ActionButton from "../buttons/ActionButton";
import Modal from "../Modal";

type AnnouncementsListItemT = {
  annId: AnnouncementModelT["id"];
  title: AnnouncementModelT["title"];
  body: AnnouncementModelT["body"];
  course: CourseModelT["title"];
  date: string;
  deletable?: boolean;
  landingRoute?: string;
};

const AnnouncementsListItem: FC<AnnouncementsListItemT> = ({
  annId,
  title,
  body,
  course,
  date,
  deletable,
  landingRoute,
}) => {
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="container-item announcements-list-item">
      <div className="list-item-heading">
        <div className="title link">
          <Link to={`/announcements/${annId}`}>{title}</Link>
        </div>
        {deletable && (
          <div className="delete">
            <DeleteIcon className="icon" width={20} height={20} onClick={openModal} />
          </div>
        )}
      </div>
      <div className="body ellipsis-3">{body}</div>
      <div className="metadata">
        <span className="date mr-12">{date}</span>
        <span className="course">{course}</span>
      </div>
      {deletable && (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className="modal-heading">Are you sure you want to delete this announcement?</div>
          <div className="modal-actions">
            <Form method="post" action={`/announcements/${annId}/delete`} autoComplete="off">
              <input type="hidden" id="redirectTo" name="redirectTo" value={landingRoute} />
              <ActionButton type="submit" disabled={isSubmitting} variant="danger" fullwidth>
                DELETE
              </ActionButton>
            </Form>
            <ActionButton onClick={closeModal} variant="cancel" size="lg">
              CANCEL
            </ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AnnouncementsListItem;
