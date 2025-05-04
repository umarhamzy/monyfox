import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmationModal, Modal, useModal } from "@/components/ui/modal";
import { useProfile } from "@/hooks/use-profile";
import { type Account } from "@monyfox/common-data";
import { toast } from "sonner";
import { ulid } from "ulid";
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
import { TrashIcon } from "lucide-react";
import { DestructiveAlert } from "../ui/alert";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export function AccountFormModal({
  isOpen,
  onClose,
  account,
}: {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
}) {
  const { createAccount, updateAccount } = useProfile();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account?.name ?? "",
    },
  });

  function onSave(values: z.infer<typeof formSchema>) {
    const fn = account !== null ? updateAccount : createAccount;
    fn.mutate(
      {
        id: account?.id ?? ulid(),
        name: values.name,
        isPersonalAsset: true,
      },
      {
        onSuccess: () => {
          toast.success("Account saved");
          onClose();
        },
        onError: (e) => {
          toast.error("Error saving account", {
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
      title="Account"
      description={
        account !== null ? "Edit the account." : "Create a new account."
      }
      footer={
        <div className="flex justify-between w-full">
          <div>{account !== null && <DeleteButton account={account} />}</div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSave)}
              variant="default"
              isLoading={createAccount.isPending || updateAccount.isPending}
            >
              {account !== null ? "Save" : "Create"}
            </Button>
          </div>
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
        </form>
      </Form>
    </Modal>
  );
}

function DeleteButton({ account }: { account: Account }) {
  const { deleteAccount, getTransactionCountByAccount } = useProfile();
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button size="icon" onClick={openModal} variant="outline" title="Delete">
        <TrashIcon />
      </Button>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Delete account"
        onConfirm={() => {
          deleteAccount.mutate(account.id, {
            onSuccess: () => {
              toast.success("Account deleted");
              closeModal();
            },
            onError: (e) => {
              toast.error("Error deleting account", {
                description: e.message,
              });
            },
          });
        }}
        confirmText="Delete"
        cancelText="Cancel"
        actionButtonVariant="destructive"
        isLoading={deleteAccount.isPending}
      >
        <div>
          {getTransactionCountByAccount(account.id) > 0 ? (
            <DestructiveAlert title="This account has transactions">
              You can't delete an account with transactions. Please delete all
              transactions associated with this account first.
            </DestructiveAlert>
          ) : (
            "Are you sure you want to delete this account?"
          )}
        </div>
      </ConfirmationModal>
    </>
  );
}
