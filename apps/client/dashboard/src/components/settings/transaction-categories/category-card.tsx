import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModal } from "@/components/ui/modal";
import { useProfile } from "@/hooks/use-profile";
import { PencilIcon } from "lucide-react";
import { type TransactionCategoryWithChildren } from "@/utils/transaction-category";
import { TransactionCategoryFormModal } from "./category-form-modal";

export function TransactionCategoryCard({
  category,
}: {
  category: TransactionCategoryWithChildren;
}) {
  const { getTransactionCountByCategory } = useProfile();
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
            <TransactionCategoryFormModal
              isOpen={isEditOpen}
              onClose={closeEditModal}
              category={category}
            />
          </div>
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
