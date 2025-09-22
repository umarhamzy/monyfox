import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DefaultSymbolSelect } from "../default-symbol-select";
import { useProfile } from "@/hooks/use-profile";
import { useMatchRoute } from "@tanstack/react-router";

export function SiteHeader() {
  const {
    data: { assetSymbols },
    user: { id: profileId },
  } = useProfile();

  const matchRoute = useMatchRoute();

  // Determine the active page title
  const getPageTitle = () => {
    if (
      matchRoute({ to: "/p/$profileId", params: { profileId }, fuzzy: false })
    ) {
      return "Dashboard";
    }
    if (
      matchRoute({
        to: "/p/$profileId/charts",
        params: { profileId },
        fuzzy: false,
      })
    ) {
      return "Charts";
    }
    if (
      matchRoute({
        to: "/p/$profileId/accounts",
        params: { profileId },
        fuzzy: false,
      })
    ) {
      return "Accounts";
    }
    if (
      matchRoute({
        to: "/p/$profileId/transactions",
        params: { profileId },
        fuzzy: false,
      })
    ) {
      return "Transactions";
    }
    if (
      matchRoute({
        to: "/p/$profileId/settings",
        params: { profileId },
        fuzzy: false,
      })
    ) {
      return "Settings";
    }
    return "Dashboard"; // default
  };

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
        {assetSymbols.length > 1 && (
          <>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <DefaultSymbolSelect />
          </>
        )}
      </div>
    </header>
  );
}
