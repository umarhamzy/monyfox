import { TestContextProvider } from "@/utils/tests/contexts";
import { render, fireEvent } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { PrivacyLink } from "./privacy";
import { useAnalytics } from "@/hooks/use-analytics";

vi.mock("@/hooks/use-analytics");

const mockUseAnalytics = {
  isConfigured: true,
  isTracking: false,
  toggleTracking: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAnalytics).mockReturnValue(mockUseAnalytics);
});

test("renders PrivacyLink when analytics is configured", () => {
  const r = render(
    <TestContextProvider>
      <PrivacyLink />
    </TestContextProvider>,
  );

  expect(r.getByText("Privacy")).toBeInTheDocument();
});

test("does not render PrivacyLink when analytics is not configured", () => {
  vi.mocked(useAnalytics).mockReturnValue({
    ...mockUseAnalytics,
    isConfigured: false,
  });

  const r = render(
    <TestContextProvider>
      <PrivacyLink />
    </TestContextProvider>,
  );

  expect(r.queryByText("Privacy")).not.toBeInTheDocument();
});

test("opens PrivacyModal when PrivacyLink is clicked", () => {
  const r = render(
    <TestContextProvider>
      <PrivacyLink />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Privacy"));

  expect(r.queryAllByText("Privacy").length).toBe(2);
  expect(r.getByText("Manage your privacy preferences.")).toBeInTheDocument();
});

test("closes PrivacyModal when Close button is clicked", () => {
  const r = render(
    <TestContextProvider>
      <PrivacyLink />
    </TestContextProvider>,
  );

  expect(
    r.queryByText("Manage your privacy preferences."),
  ).not.toBeInTheDocument();

  fireEvent.click(r.getByText("Privacy"));

  expect(r.queryByText("Manage your privacy preferences.")).toBeInTheDocument();

  // Two close buttons because one is sr-only
  const closeButtons = r.queryAllByText("Close");
  expect(closeButtons.length).toBe(2);
  fireEvent.click(closeButtons[0]);

  expect(
    r.queryByText("Manage your privacy preferences."),
  ).not.toBeInTheDocument();
});

test("toggles analytics tracking when Switch is clicked", () => {
  const r = render(
    <TestContextProvider>
      <PrivacyLink />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Privacy"));

  expect(mockUseAnalytics.toggleTracking).toHaveBeenCalledTimes(0);

  fireEvent.click(r.getByLabelText("Analytics"));

  expect(mockUseAnalytics.toggleTracking).toHaveBeenCalledTimes(1);

  fireEvent.click(r.getByLabelText("Analytics"));

  expect(mockUseAnalytics.toggleTracking).toHaveBeenCalledTimes(2);
});
