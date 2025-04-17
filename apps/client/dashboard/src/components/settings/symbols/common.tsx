import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DefaultSymbolSelect } from "@/components/default-symbol-select";

export function DefaultSymbolCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Default currency</CardTitle>
      </CardHeader>
      <CardContent>
        While transactions are shown in their original currency, account
        balances are summed up to a single currency. You can use select the
        default currency to use here.
        <br />
        Note: for this to work properly, you need to set up the exchange rates
        correctly. If an exchange rate is missing, a 1x conversion rate will be
        used.
      </CardContent>
      <CardFooter>
        <DefaultSymbolSelect />
      </CardFooter>
    </Card>
  );
}

export function DeleteSymbolButton({ symbolId }: { symbolId: string }) {
  const { deleteAssetSymbol } = useProfile();
  const { getTransactionCountBySymbol } = useProfile();

  function handleDelete() {
    if (getTransactionCountBySymbol(symbolId) > 0) {
      toast.error("Cannot delete symbol with transactions");
      return;
    }

    deleteAssetSymbol.mutate(symbolId);
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete">
      <TrashIcon />
    </Button>
  );
}
