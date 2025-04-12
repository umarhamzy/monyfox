import { render, screen } from "@testing-library/react";
import { test } from "vitest";
import { Alert, AlertDescription, AlertTitle, DestructiveAlert } from "./alert";

test("Alert", () => {
  render(
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>,
  );
  screen.getByText("Heads up!");
});

test("DestructiveAlert", () => {
  render(
    <DestructiveAlert title="Error">
      This is a destructive alert.
    </DestructiveAlert>,
  );
  screen.getByText("Error");
  screen.getByText("This is a destructive alert.");
});
