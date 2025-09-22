"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

export function NavSecondary(
  props: React.ComponentPropsWithoutRef<typeof SidebarGroup>,
) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
