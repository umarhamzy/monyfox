import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { InputWithLabel } from "@/components/ui/input";
import { ConfirmationModal, Modal, useModal } from "@/components/ui/modal";
import { useProfile } from "@/hooks/use-profile";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type Account } from "@monyfox/common-data";
import { createFileRoute } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ulid } from "ulid";

export const Route = createFileRoute("/p/$profileId/_profile/accounts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [parent] = useAutoAnimate();
  const { data } = useProfile();

  return (
    <div ref={parent} className="flex flex-col gap-4">
      <CreateAccountButton />
      {data.accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}

function AccountCard({ account }: { account: Account }) {
  const { deleteAccount } = useProfile();
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <CardTitle>{account.name}</CardTitle>
          <div className="flex gap-2">
            <Button size="icon" onClick={openModal} variant="outline">
              <TrashIcon />
            </Button>
          </div>
          <ConfirmationModal
            isOpen={isOpen}
            onClose={closeModal}
            title="Delete account"
            onConfirm={() => {
              deleteAccount.mutate(account.id, {
                onSuccess: () => {
                  toast.success("Account deleted successfully");
                  closeModal();
                },
                onError: (e) => {
                  toast.error("Failed to delete account", {
                    description: e.message,
                  });
                },
              });
              closeModal();
            }}
            confirmText="Delete"
            cancelText="Cancel"
            actionButtonVariant="destructive"
            isLoading={deleteAccount.isPending}
          >
            <span>
              Are you sure you want to delete this account? All the transactions
              associated with this account will <b>NOT</b> be deleted.
            </span>
          </ConfirmationModal>
        </div>
      </CardHeader>
    </Card>
  );
}

function CreateAccountButton() {
  const { createAccount } = useProfile();
  const { isOpen, openModal, closeModal } = useModal();
  const [accountName, setAccountName] = useState("");

  function onSave() {
    createAccount.mutate(
      {
        id: ulid(),
        name: accountName,
        isPersonalAsset: true,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
          closeModal();
        },
        onError: (e) => {
          toast.error("Failed to create account", {
            description: e.message,
          });
        },
      },
    );
  }

  return (
    <>
      <Button onClick={openModal}>Create Account</Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create Account"
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={closeModal} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={onSave}
              variant="default"
              isLoading={createAccount.isPending}
            >
              Create
            </Button>
          </div>
        }
      >
        <InputWithLabel
          id="name"
          label="Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
      </Modal>
    </>
  );
}
