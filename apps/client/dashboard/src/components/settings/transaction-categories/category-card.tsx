import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationModal, useModal } from "@/components/ui/modal";
import { useProfile } from "@/hooks/use-profile";
import { TrashIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { type TransactionCategoryWithChildren } from "@/utils/transaction-category";
import { TransactionCategoryFormModal } from "./category-form-modal";
import { MutationResult } from "@/contexts/profile-provider";

export function TransactionCategoryCard({
  category,
}: {
  category: TransactionCategoryWithChildren;
}) {
  const { deleteTransactionCategory, getTransactionCountByCategory } =
    useProfile();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const transactionsCount = getTransactionCountByCategory(category.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>{transactionsCount} transactions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              onClick={openEditModal}
              variant="outline"
              title="Edit"
            >
              <PencilIcon />
            </Button>
            <Button
              size="icon"
              onClick={openDeleteModal}
              variant="outline"
              title="Delete"
            >
              <TrashIcon />
            </Button>
            <TransactionCategoryFormModal
              isOpen={isEditOpen}
              onClose={closeEditModal}
              category={category}
            />
          </div>
          <DeleteConfirmationModal
            isDeleteOpen={isDeleteOpen}
            closeDeleteModal={closeDeleteModal}
            deleteTransactionCategory={deleteTransactionCategory}
            category={category}
          />
        </div>
      </CardHeader>
      {category.children.length > 0 && (
        <CardContent className="space-y-4">
          {category.children.map((child) => (
            <TransactionCategoryCard key={child.id} category={child} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
function DeleteConfirmationModal({
  isDeleteOpen,
  closeDeleteModal,
  deleteTransactionCategory,
  category,
}: {
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
  deleteTransactionCategory: MutationResult<string>;
  category: TransactionCategoryWithChildren;
}) {
  return (
    <ConfirmationModal
      isOpen={isDeleteOpen}
      onClose={closeDeleteModal}
      title="Delete transaction category"
      onConfirm={() => {
        deleteTransactionCategory.mutate(category.id, {
          onSuccess: () => {
            toast.success("Category deleted");
            closeDeleteModal();
          },
          onError: (e) => {
            toast.error("Error deleting category", {
              description: e.message,
            });
          },
        });
        closeDeleteModal();
      }}
      confirmText="Delete"
      cancelText="Cancel"
      actionButtonVariant="destructive"
      isLoading={deleteTransactionCategory.isPending}
    >
      <span>
        Are you sure you want to delete this transaction category? All the
        transactions associated with this category will <b>NOT</b> be deleted
        and will remain uncategorized.
      </span>
    </ConfirmationModal>
  );
}
