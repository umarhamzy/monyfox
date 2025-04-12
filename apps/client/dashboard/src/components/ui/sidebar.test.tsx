import { describe, test } from "vitest";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Sidebar", () => {
  test("render", () => {
    render(
      <SidebarProvider>
        <Sidebar />
        <SidebarTrigger data-testid="sidebar-trigger" />
      </SidebarProvider>,
    );
    fireEvent.click(screen.getByTestId("sidebar-trigger"));
  });
});
