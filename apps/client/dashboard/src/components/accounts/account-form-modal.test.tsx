import { TestContextProvider } from "@/utils/tests/contexts";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AccountFormModal } from "./account-form-modal";
import { type Account } from "@monyfox/common-data";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-profile";

test("open create modal", () => {
  const r = render(
    <TestContextProvider>
      <AccountFormModal isOpen={true} onClose={() => {}} account={null} />
    </TestContextProvider>,
  );

  expect(r.getByText("Create a new account.")).toBeInTheDocument();
});

describe("open edit modal", () => {
  test("with existing account", () => {
    const mockAccount: Account = {
      id: "1",
      name: "Test Account",
      isPersonalAsset: true,
    };

    const r = render(
      <TestContextProvider>
        <AccountFormModal
          isOpen={true}
          onClose={() => {}}
          account={mockAccount}
        />
      </TestContextProvider>,
    );

    expect(r.getByText("Edit the account.")).toBeInTheDocument();
    expect(r.getByDisplayValue("Test Account")).toBeInTheDocument();
  });
});

test("cancel the form", () => {
  const onClose = vi.fn();

  const r = render(
    <TestContextProvider>
      <AccountFormModal isOpen={true} onClose={onClose} account={null} />
    </TestContextProvider>,
  );

  fireEvent.click(r.getByText("Cancel"));

  expect(onClose).toHaveBeenCalled();
});

describe("create", () => {
  test("success", async () => {
    const onClose = vi.fn();
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const r = render(
      <TestContextProvider>
        <AccountFormModal isOpen={true} onClose={onClose} account={null} />
        <AccountsList />
      </TestContextProvider>,
    );

    expect(r.getByText("Accounts:Account 1,Account 2.")).toBeInTheDocument();

    fireEvent.change(r.getByLabelText("Name"), {
      target: { value: "New Account" },
    });
    fireEvent.click(r.getByText("Create"));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith("Account saved");
      expect(toastError).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    expect(
      r.getByText("Accounts:Account 1,Account 2,New Account."),
    ).toBeInTheDocument();
  });
});

describe("edit", () => {
  test("success", async () => {
    const onClose = vi.fn();
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const mockAccount: Account = {
      id: "ACCOUNT_1",
      name: "Account 1",
      isPersonalAsset: true,
    };

    const r = render(
      <TestContextProvider>
        <AccountFormModal
          isOpen={true}
          onClose={onClose}
          account={mockAccount}
        />
        <AccountsList />
      </TestContextProvider>,
    );

    expect(r.getByText("Accounts:Account 1,Account 2.")).toBeInTheDocument();

    fireEvent.change(r.getByLabelText("Name"), {
      target: { value: "Updated Account" },
    });
    fireEvent.click(r.getByText("Save"));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith("Account saved");
      expect(toastError).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    expect(
      r.getByText("Accounts:Updated Account,Account 2."),
    ).toBeInTheDocument();
  });
});

describe("delete", () => {
  test("success", async () => {
    const onClose = vi.fn();
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const mockAccount: Account = {
      id: "ACCOUNT_1",
      name: "Account 1",
      isPersonalAsset: true,
    };

    const r = render(
      <TestContextProvider withTransactions={false}>
        <AccountFormModal
          isOpen={true}
          onClose={onClose}
          account={mockAccount}
        />
        <AccountsList />
      </TestContextProvider>,
    );

    expect(r.getByText("Accounts:Account 1,Account 2.")).toBeInTheDocument();

    fireEvent.change(r.getByLabelText("Name"), {
      target: { value: "Updated Account" },
    });
    fireEvent.click(r.getByTitle("Delete"));
    fireEvent.click(r.getByText("Delete"));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith("Account deleted");
      expect(toastError).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    expect(r.getByText("Accounts:Account 2.")).toBeInTheDocument();
  });

  test("error - account has transactions", async () => {
    const onClose = vi.fn();
    const toastSuccess = vi.spyOn(toast, "success");
    const toastError = vi.spyOn(toast, "error");

    const mockAccount: Account = {
      id: "ACCOUNT_1",
      name: "Account 1",
      isPersonalAsset: true,
    };

    const r = render(
      <TestContextProvider>
        <AccountFormModal
          isOpen={true}
          onClose={onClose}
          account={mockAccount}
        />
        <AccountsList />
      </TestContextProvider>,
    );

    expect(r.getByText("Accounts:Account 1,Account 2.")).toBeInTheDocument();

    fireEvent.change(r.getByLabelText("Name"), {
      target: { value: "Updated Account" },
    });
    fireEvent.click(r.getByTitle("Delete"));
    fireEvent.click(r.getByText("Delete"));

    await waitFor(() => {
      expect(toastSuccess).not.toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith("Error deleting account", {
        description: "Transaction has a non-existing account.",
      });
      expect(onClose).not.toHaveBeenCalled();
    });
    expect(r.getByText("Accounts:Account 1,Account 2.")).toBeInTheDocument();
  });
});

function AccountsList() {
  const {
    data: { accounts },
  } = useProfile();
  return `Accounts:${accounts.map((a) => a.name).join(",")}.`;
}
