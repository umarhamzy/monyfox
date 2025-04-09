import {
  Modal as ModalComponent,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  type ButtonProps,
} from "@nextui-org/react";
import { useState } from "react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </ModalComponent>
  );
}

export function ConfirmationModal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText,
  cancelText,
  actionButtonColor,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
  actionButtonColor?: ButtonProps["color"];
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button onPress={onClose}>{cancelText}</Button>
          <Button onPress={onConfirm} color={actionButtonColor ?? "primary"}>
            {confirmText}
          </Button>
        </div>
      }
    >
      {children}
    </Modal>
  );
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return { isOpen, openModal, closeModal };
}
