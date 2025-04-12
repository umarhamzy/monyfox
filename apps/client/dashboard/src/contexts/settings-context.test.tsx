import { describe, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSettings } from "@/hooks/use-settings";
import { ReactNode } from "react";
import { TestContextProvider } from "@/utils/tests/contexts";

describe("SettingsProvider", () => {
  test("set default symbol", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TestContextProvider>{children}</TestContextProvider>
    );
    const settings = renderHook(() => useSettings(), { wrapper });
    expect(settings.result.current.defaultSymbolId).toBe("EUR");

    act(() => {
      settings.result.current.setDefaultSymbolId("USD");
    });

    expect(settings.result.current.defaultSymbolId).toBe("USD");

    act(() => {
      settings.result.current.setDefaultSymbolId("INVALID");
    });

    expect(settings.result.current.defaultSymbolId).toBe("EUR");
  });
});
