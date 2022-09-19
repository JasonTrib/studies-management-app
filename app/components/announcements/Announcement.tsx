import type { LinksFunction } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import type { FC } from "react";
import { useState } from "react";
import DeleteIcon from "~/components/icons/DeleteIcon";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import styles from "~/styles/announcements.css";
import modalStyles from "~/styles/modal.css";
import { formatDate } from "~/utils/dateUtils";
import ActionButton from "../buttons/ActionButton";
import Modal from "../Modal";

type AnnouncementT = {
  data: AnnouncementModelT;
  showDelete?: boolean;
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: modalStyles },
  ];
};

const Announcement: FC<AnnouncementT> = ({ data, showDelete }) => {
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="announcement-container">
      <div className="heading">
        <div className="title">{data.title}</div>
        {showDelete && (
          <div className="delete">
            <DeleteIcon className="icon" width={24} height={24} onClick={openModal} />
          </div>
        )}
      </div>
      <div className="content">
        <div className="body">{data.body}</div>
        <div className="meta-data">{formatDate(new Date(data.updated_at))}</div>
      </div>
      {showDelete && (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className="modal-heading">Are you sure you want to delete this announcement?</div>
          <div className="modal-actions">
            <Form method="post" action={`/announcements/${data.id}/delete`} autoComplete="off">
              <input
                type="hidden"
                id="redirectTo"
                name="redirectTo"
                value={`/courses/${data.course_id}/announcements`}
              />
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

export default Announcement;
