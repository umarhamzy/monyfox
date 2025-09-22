"use client";

import {
  ArrowLeftRightIcon,
  ChartPieIcon,
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
import { Link, useMatchRoute } from "@tanstack/react-router";
import { useProfile } from "@/hooks/use-profile";

export function NavMain() {
  const {
    user: { id: profileId },
  } = useProfile();
  const { onSidebarLinkClick } = useSidebar();
  const matchRoute = useMatchRoute();

  const isActiveDashboard = !!matchRoute({
    to: "/p/$profileId",
    params: { profileId },
    fuzzy: false,
  });
  const isActiveCharts = !!matchRoute({
    to: "/p/$profileId/charts",
    params: { profileId },
    fuzzy: false,
  });
  const isActiveAccounts = !!matchRoute({
    to: "/p/$profileId/accounts",
    params: { profileId },
    fuzzy: false,
  });
  const isActiveTransactions = !!matchRoute({
    to: "/p/$profileId/transactions",
    params: { profileId },
    fuzzy: false,
  });

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dashboard"
              asChild
              isActive={isActiveDashboard}
            >
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
            <SidebarMenuButton
              tooltip="Charts"
              asChild
              isActive={isActiveCharts}
            >
              <Link
                to="/p/$profileId/charts"
                params={{ profileId }}
                onClick={onSidebarLinkClick}
              >
                <ChartPieIcon />
                <span>Charts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Accounts"
              asChild
              isActive={isActiveAccounts}
            >
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
            <SidebarMenuButton
              tooltip="Transactions"
              asChild
              isActive={isActiveTransactions}
            >
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
