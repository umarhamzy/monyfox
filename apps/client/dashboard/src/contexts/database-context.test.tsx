import "fake-indexeddb/auto";

import { afterEach, describe, expect, test } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { useDatabase } from "@/hooks/use-database";
import { DatabaseProvider } from "./database-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function TestProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseProvider>{children}</DatabaseProvider>
    </QueryClientProvider>
  );
}

const TestComponent = () => {
  const { profiles, saveProfile, deleteProfile } = useDatabase();
  return (
    <div>
      <p>Profiles: {profiles.map((profile) => profile.id).join(", ")}.</p>
      <button
        onClick={() =>
          saveProfile.mutate({
            id: "NEW_PROFILE_1",
            user: "NEW_PROFILE_1",
            data: { encrypted: true, data: "" },
            schemaVersion: "1",
          })
        }
      >
        Save Profile
      </button>
      <button onClick={() => deleteProfile.mutate("NEW_PROFILE_1")}>
        Delete Profile
      </button>
    </div>
  );
};

afterEach(() => {
  indexedDB.deleteDatabase("monyfox");
});

describe("DatabaseProvider", () => {
  test("renders loading state initially", () => {
    const { getByTitle } = render(
      <TestProvider>
        <TestComponent />
      </TestProvider>,
    );
    expect(getByTitle("Loading...")).toBeDefined();
  });

  test("renders profiles after loading", async () => {
    const { getByText, queryByTitle } = render(
      <TestProvider>
        <TestComponent />
      </TestProvider>,
    );

    await waitFor(() => expect(queryByTitle("Loading...")).toBeNull());
    await waitFor(() => expect(getByText("Profiles: .")).toBeInTheDocument());
  });

  test("saves a profile", async () => {
    const { getByText, queryByTitle } = render(
      <TestProvider>
        <TestComponent />
      </TestProvider>,
    );

    await waitFor(() => expect(queryByTitle("Loading...")).toBeNull());
    await waitFor(() => expect(getByText("Profiles: .")).toBeInTheDocument());

    fireEvent.click(getByText("Save Profile"));

    await waitFor(() =>
      expect(getByText("Profiles: NEW_PROFILE_1.")).toBeInTheDocument(),
    );
  });

  test("deletes a profile", async () => {
    const { getByText, queryByTitle } = render(
      <TestProvider>
        <TestComponent />
      </TestProvider>,
    );

    await waitFor(() => expect(queryByTitle("Loading...")).toBeNull());
    fireEvent.click(getByText("Save Profile"));

    await waitFor(() =>
      expect(getByText("Profiles: NEW_PROFILE_1.")).toBeInTheDocument(),
    );

    const deleteButton = getByText("Delete Profile");
    deleteButton.click();

    await waitFor(() => expect(getByText("Profiles: .")).toBeInTheDocument());
  });
});
