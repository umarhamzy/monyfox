"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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
  const { onSidebarLinkClick } = useSidebar();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>{/* Settings moved to NavUser component */}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
