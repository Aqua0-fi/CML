import type { Metadata } from "next";
import ApplyForm from "./ApplyForm";

export const metadata: Metadata = {
  title: "Aqua0 Residency Application",
  description:
    "Three weeks living and building with a small group obsessed with DeFi. October 11 to November 1, at Edge City in Goa.",
};

export default function ApplyPage() {
  return <ApplyForm />;
}
