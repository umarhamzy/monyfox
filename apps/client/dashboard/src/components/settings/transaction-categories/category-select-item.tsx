import { SelectItem } from "@/components/ui/select";
import { type TransactionCategoryWithChildren } from "@/utils/transaction-category";

export function SelectItemTransactionCategoryWithChildren({
  category,
  level,
}: {
  category: TransactionCategoryWithChildren;
  level: number;
}) {
  return (
    <>
      <SelectItem key={category.id} value={category.id}>
        {"-".repeat(level)} {category.name}
      </SelectItem>
      {category.children.map((child) => (
        <SelectItemTransactionCategoryWithChildren
          key={child.id}
          category={child}
          level={level + 1}
        />
      ))}
    </>
  );
}
