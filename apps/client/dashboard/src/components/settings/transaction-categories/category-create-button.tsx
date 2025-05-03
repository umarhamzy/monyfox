import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal";
import { TransactionCategoryFormModal } from "./category-form-modal";

export function CreateTransactionCategoryButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal}>Create transaction category</Button>
      <TransactionCategoryFormModal
        isOpen={isOpen}
        onClose={closeModal}
        category={null}
      />
    </>
  );
}
