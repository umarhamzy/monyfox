import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal";
import { useProfile } from "@/hooks/use-profile";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AccountFormModal } from "./account-form-modal";
import { AccountCard } from "./account-card";

export function AccountsList() {
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

function CreateAccountButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal}>Create account</Button>
      <AccountFormModal isOpen={isOpen} onClose={closeModal} account={null} />
    </>
  );
}
