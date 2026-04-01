import type { FC } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const DeleteModal: FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Delete item?",
  description = "This action cannot be undone.",
}) => {
  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box bg-gray-200 dark:bg-neutral-800">
        <h3 className="font-bold text-lg text-center">{title}</h3>

        <p className="py-4 text-center">{description}</p>

        <div className="modal-action flex justify-around">
          <button
            className="btn btn-outline "
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn btn-error text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteModal;
