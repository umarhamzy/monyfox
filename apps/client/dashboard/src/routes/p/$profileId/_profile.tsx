import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProfileProvider } from "../../../contexts/profile-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { SettingsProvider } from "@/contexts/settings-context";
import { AssetSymbolExchangeRateProvider } from "@/contexts/asset-symbol-exchange-rate-context";

export const Route = createFileRoute("/p/$profileId/_profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profileId } = Route.useParams();
  return (
    <ProfileProvider profileId={profileId}>
      <AssetSymbolExchangeRateProvider>
        <SettingsProvider>
          <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
              <SiteHeader />
              <div className="@container/main flex justify-center p-4">
                <div className="w-full max-w-5xl">
                  <Outlet />
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </SettingsProvider>
      </AssetSymbolExchangeRateProvider>
    </ProfileProvider>
  );
}
