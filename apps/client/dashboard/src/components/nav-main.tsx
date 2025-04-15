"use client";

import {
  ArrowLeftRightIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useProfile } from "@/hooks/use-profile";

export function NavMain() {
  const {
    user: { id: profileId },
  } = useProfile();
  const { onSidebarLinkClick } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dashboard" asChild>
              <Link
                to="/p/$profileId"
                params={{ profileId }}
                onClick={onSidebarLinkClick}
              >
                <LayoutDashboardIcon />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Accounts" asChild>
              <Link
                to="/p/$profileId/accounts"
                params={{ profileId }}
                onClick={onSidebarLinkClick}
              >
                <LibraryBigIcon />
                <span>Accounts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Transactions" asChild>
              <Link
                to="/p/$profileId/transactions"
                params={{ profileId }}
                onClick={onSidebarLinkClick}
              >
                <ArrowLeftRightIcon />
                <span>Transactions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
