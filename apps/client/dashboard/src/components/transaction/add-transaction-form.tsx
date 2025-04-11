import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal, useModal } from "@/components/ui/modal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ulid } from "ulid";
import { LocalDate } from "@js-joda/core";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DestructiveAlert } from "@/components/ui/alert";

export function AddTransactionFloatingButton() {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <Button className="fixed bottom-4 right-4" size="lg" onClick={openModal}>
        <PlusIcon className="size-7" />
      </Button>
      <AddTransactionModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}

function AddTransactionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [type, setType] = useState<"expense" | "income" | "transfer">(
    "expense",
  );

  useEffect(() => {
    setType("expense");
  }, [isOpen]);

  return (
    <Modal title="Add Transaction" isOpen={isOpen} onClose={onClose}>
      <Tabs defaultValue="expense">
        <TabsList>
          <TabsTrigger value="expense" onClick={() => setType("expense")}>
            Expense
          </TabsTrigger>
          <TabsTrigger value="income" onClick={() => setType("income")}>
            Income
          </TabsTrigger>
          <TabsTrigger value="transfer" onClick={() => setType("transfer")}>
            Transfer
          </TabsTrigger>
        </TabsList>
        <TransactionForm type={type} onClose={onClose} />
      </Tabs>
    </Modal>
  );
}

const formSchema = z.object({
  description: z.string(),
  fromAccountId: z.string(),
  toAccountId: z.string(),
  amount: z.coerce.number().nonnegative(),
  symbolId: z.string(),
});

function TransactionForm({
  type,
  onClose,
}: {
  type: "expense" | "income" | "transfer";
  onClose: () => void;
}) {
  const {
    user,
    data: { accounts, assetSymbols },
    createTransaction,
  } = useProfile();
  const defaultAssetSymbol = assetSymbols[0];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      fromAccountId: "",
      toAccountId: "",
      symbolId: defaultAssetSymbol ? defaultAssetSymbol.id : "",
    },
  });

  if (defaultAssetSymbol === undefined) {
    return (
      <DestructiveAlert title="No asset symbol found">
        Please create an asset symbol (e.g., a currency like EUR or USD) before
        creating a transaction.
        <br />
        You can do this in the settings page.
      </DestructiveAlert>
    );
  }

  if (accounts.length === 0) {
    return (
      <DestructiveAlert title="No accounts found">
        Please create an account before creating a transaction.
        <br />
        <Link to="/p/$profileId/accounts" params={{ profileId: user.id }}>
          Click here to go to the Accounts page.
        </Link>
      </DestructiveAlert>
    );
  }

  const needFromAccount = type === "expense" || type === "transfer";
  const needToAccount = type === "income" || type === "transfer";

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (needFromAccount && values.fromAccountId === "") {
      form.setError("fromAccountId", { message: "Please select an account" });
      return;
    }
    if (needToAccount && values.toAccountId === "") {
      form.setError("fromAccountId", { message: "Please select an account" });
      return;
    }

    const now = LocalDate.now();
    createTransaction.mutate(
      {
        id: ulid(),
        description: values.description,
        transactionCategoryId: null,
        transactionDate: now.toString(),
        accountingDate: now.toString(),
        from: {
          amount: values.amount,
          symbolId: "EUR",
          account: needFromAccount
            ? {
                id: values.fromAccountId,
              }
            : {
                name: "N/A",
              },
        },
        to: {
          amount: values.amount,
          symbolId: "EUR",
          account: needToAccount
            ? {
                id: values.toAccountId,
              }
            : {
                name: "N/A",
              },
        },
      },
      {
        onSuccess: () => {
          onClose();
          form.reset();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          {needFromAccount && (
            <FormField
              control={form.control}
              name="fromAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay from account</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent {...field}>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {needToAccount && (
            <FormField
              control={form.control}
              name="toAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay to account</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent {...field}>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="symbolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>&nbsp;</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent {...field}>
                      {assetSymbols.map((symbol) => (
                        <SelectItem key={symbol.id} value={symbol.id}>
                          {symbol.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
