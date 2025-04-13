"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SettingsIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useProfile } from "@/hooks/use-profile";

export function NavSecondary(
  props: React.ComponentPropsWithoutRef<typeof SidebarGroup>,
) {
  const {
    user: { id: profileId },
  } = useProfile();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Accounts" asChild>
              <Link to="/p/$profileId/settings" params={{ profileId }}>
                <SettingsIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
