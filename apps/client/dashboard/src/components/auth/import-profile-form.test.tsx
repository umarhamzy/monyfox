import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ImportProfileForm } from "./import-profile-form";
import { TestContextProvider } from "@/utils/tests/contexts";
import { toast } from "sonner";
import { generateTestProfile } from "@/utils/data";
import { useDatabase } from "@/hooks/use-database";
import { Profile } from "@monyfox/common-data";

function setup() {
  const onClose = vi.fn();
  return {
    ...render(
      <TestContextProvider>
        <ImportProfileForm onClose={onClose} />
        <ProfileIds />
      </TestContextProvider>,
    ),
    onClose,
  };
}

function ProfileIds() {
  const { profiles } = useDatabase();
  return `PROFILE_IDS:${profiles.map((p) => p.id).join(",")}.`;
}

describe("ImportProfileForm", () => {
  test("renders file input and buttons", () => {
    const { getByRole, getByLabelText } = setup();
    expect(getByRole("button", { name: "Import" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(getByLabelText("Your file")).toBeInTheDocument();
  });

  test("calls onClose when Cancel is clicked", () => {
    const { getByRole, onClose } = setup();
    fireEvent.click(getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  test("succeeds with a valid profile", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const { getByRole, getByLabelText } = setup();

    const profile = generateTestProfile();
    const fileContent = JSON.stringify(profile);
    const file = new File([fileContent], "profile.json", {
      type: "application/json",
    });

    const input = getByLabelText("Your file");
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledExactlyOnceWith(
        "Profile imported successfully",
      ),
    );
    expect(toastError).not.toHaveBeenCalled();

    // Verify that the profile has actually been added
    expect(document.body.textContent).toContain(
      `PROFILE_IDS:TEST_PROFILE_ID,${profile.id}.`,
    );
  });

  test("errors if the profile already exists", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const { getByRole, getByLabelText } = setup();

    const profile = generateTestProfile();
    profile.id = "TEST_PROFILE_ID";

    const fileContent = JSON.stringify(profile);
    const file = new File([fileContent], "profile.json", {
      type: "application/json",
    });

    const input = getByLabelText("Your file");
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledExactlyOnceWith(
        "The profile already exists",
      ),
    );
    expect(toastSuccess).not.toHaveBeenCalled();

    // Verify that the profile has not been added
    expect(document.body.textContent).toContain(`PROFILE_IDS:TEST_PROFILE_ID.`);
  });

  test("errors with invalid data", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const { getByRole, getByLabelText } = setup();

    const fileContent = JSON.stringify({
      invalid: "data",
    });
    const file = new File([fileContent], "profile.json", {
      type: "application/json",
    });

    const input = getByLabelText("Your file");
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(getByRole("button", { name: "Import" }));

    await waitFor(() => expect(toastError).toHaveBeenCalledOnce());
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  test("errors with encrypted file", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const { getByRole, getByLabelText } = setup();

    const fileContent = JSON.stringify({
      id: "TEST_PROFILE_ENCRYPTED",
      user: "",
      data: { encrypted: true, data: "" },
      schemaVersion: "1",
    } as Profile);
    const file = new File([fileContent], "profile.json", {
      type: "application/json",
    });

    const input = getByLabelText("Your file");
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledExactlyOnceWith(
        "Profile should not be encrypted",
      ),
    );
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  test("errors with unparseable JSON", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const { getByRole, getByLabelText } = setup();

    const fileContent = "not json";
    const file = new File([fileContent], "profile.json", {
      type: "application/json",
    });

    const input = getByLabelText("Your file");
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledExactlyOnceWith(
        "Unexpected token 'o', \"not json\" is not valid JSON",
      ),
    );
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  test("errors with data validation errors", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const { getByRole, getByLabelText } = setup();

    const profile = generateTestProfile();
    if (profile.data.encrypted) {
      // Let's make TypeScript happy
      throw new Error("Profile should not be encrypted for test");
    }

    // Make transactions belong to a non-existent account
    profile.data.data.accounts = [];

    const fileContent = JSON.stringify(profile);
    const file = new File([fileContent], "profile.json", {
      type: "application/json",
    });

    const input = getByLabelText("Your file");
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledExactlyOnceWith(
        "Transaction has a non-existing account.",
      ),
    );
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  test("errors if uploaded element is not a file", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const { getByRole, getByLabelText } = setup();

    const input = getByLabelText("Your file");

    const notAFile = "not a file";
    fireEvent.change(input, { target: { files: [notAFile] } });
    fireEvent.click(getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledExactlyOnceWith(
        "Failed to execute 'readAsText' on 'FileReader': parameter 1 is not of type 'Blob'.",
      ),
    );
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  test("errors with no file", async () => {
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const { getByRole, getByLabelText } = setup();

    const input = getByLabelText("Your file");
    fireEvent.change(input, { target: { files: [] } });
    fireEvent.click(getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledExactlyOnceWith("No file selected"),
    );
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
