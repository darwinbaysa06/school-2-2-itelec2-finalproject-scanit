import { ActionAlertModal } from "@/app/component/ActionAlertModal";
import { type HistoryEntry } from "@/db/database";
import React from "react";

interface Props {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  item: HistoryEntry;
  title?: string;
  message?: string;
}

export const ConfirmDeleteModal = ({
  isVisible,
  onConfirm,
  onCancel,
  item,
  title = "Confirm Deletion",
  message = `Are you sure you want to delete "${item.qrname}"? This action cannot be undone.`,
}: Props) => {
  return (
    <ActionAlertModal
      isVisible={isVisible}
      title={title}
      message={message}
      cancelLabel="Cancel"
      actionLabel="Delete"
      actionButtonColor="#E51400"
      onCancel={onCancel}
      onAction={onConfirm}
    />
  );
};
