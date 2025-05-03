import { useProfile } from "@/hooks/use-profile";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { getTransactionCategoriesWithChildren } from "@/utils/transaction-category";
import { TransactionCategoryCard } from "./category-card";
import { CreateTransactionCategoryButton } from "./category-create-button";

export function TransactionCategoriesList() {
  const [parent] = useAutoAnimate();
  const {
    data: { transactionCategories },
  } = useProfile();
  const rootCategories = getTransactionCategoriesWithChildren(
    transactionCategories,
  );
  return (
    <div ref={parent} className="flex flex-col gap-4">
      <CreateTransactionCategoryButton />
      {rootCategories.map((category) => (
        <TransactionCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
