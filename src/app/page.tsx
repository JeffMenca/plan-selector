import { redirect } from "next/navigation";

// Root page redirects to the dashboard.
// Middleware handles auth protection for the (protected) group.
export default function RootPage() {
  redirect("/dashboard");
}
