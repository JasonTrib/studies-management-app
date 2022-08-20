import type { FC } from "react";

type ModalT = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
};

const Modal: FC<ModalT> = ({ isOpen, setIsOpen, children }) => {
  const closeModal = () => setIsOpen(false);

  return (
    <div className={`modal-container ${isOpen ? "show" : ""}`} onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
export default Modal;
