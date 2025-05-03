import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useProfile } from "@/hooks/use-profile";
import { type TransactionCategory } from "@monyfox/common-data";
import { toast } from "sonner";
import { ulid } from "ulid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getTransactionCategoriesWithChildren } from "@/utils/transaction-category";
import { SelectItemTransactionCategoryWithChildren } from "./category-select-item";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentTransactionCategoryId: z.string(),
});

export function TransactionCategoryFormModal({
  isOpen,
  onClose,
  category,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: TransactionCategory | null;
}) {
  const { createTransactionCategory, updateTransactionCategory } = useProfile();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? "",
      parentTransactionCategoryId: category?.parentTransactionCategoryId ?? "-",
    },
  });

  const {
    data: { transactionCategories },
  } = useProfile();
  const rootCategories = getTransactionCategoriesWithChildren(
    transactionCategories,
  );

  function onSave(values: z.infer<typeof formSchema>) {
    const fn =
      category !== null ? updateTransactionCategory : createTransactionCategory;
    fn.mutate(
      {
        id: category?.id ?? ulid(),
        name: values.name,
        parentTransactionCategoryId:
          values.parentTransactionCategoryId === "-"
            ? null
            : values.parentTransactionCategoryId,
      },
      {
        onSuccess: () => {
          toast.success("Category saved");
          onClose();
        },
        onError: (e) => {
          toast.error("Error saving category", {
            description: e.message,
          });
        },
      },
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Category"
      description={
        category !== null ? "Edit the category." : "Create a new category."
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSave)}
            variant="default"
            isLoading={
              createTransactionCategory.isPending ||
              updateTransactionCategory.isPending
            }
          >
            {category !== null ? "Save" : "Create"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentTransactionCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent {...field}>
                      <SelectItem value="-">(None)</SelectItem>
                      {rootCategories.map((cat) => (
                        <SelectItemTransactionCategoryWithChildren
                          key={cat.id}
                          category={cat}
                          level={0}
                        />
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
}
