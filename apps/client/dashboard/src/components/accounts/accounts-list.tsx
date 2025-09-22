import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal";
import { useProfile } from "@/hooks/use-profile";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AccountFormModal } from "./account-form-modal";
import { AccountCard } from "./account-card";
import { LayoutListIcon, LayoutGridIcon } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AccountsList() {
  const [parent] = useAutoAnimate();
  const { data } = useProfile();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "list" | "grid")}
          >
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <LayoutListIcon className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <LayoutGridIcon className="h-4 w-4" />
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-2">
          <CreateAccountButton />
        </div>
      </div>

      {viewMode === "list" ? (
        <div ref={parent} className="flex flex-col gap-4">
          {data.accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <div
          ref={parent}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {data.accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
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
