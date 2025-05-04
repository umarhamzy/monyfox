import { ChartsPage } from "@/components/charts/charts-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$profileId/_profile/charts/")({
  component: ChartsPage,
});
