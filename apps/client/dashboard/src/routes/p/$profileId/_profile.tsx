import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProfileProvider } from "../../../contexts/ProfileContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";

export const Route = createFileRoute("/p/$profileId/_profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profileId } = Route.useParams();
  return (
    <ProfileProvider profileId={profileId}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <Outlet />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  );
}
