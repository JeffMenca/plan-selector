import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { PageTransition } from "@/components/layout/PageTransition";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedShell>
      <PageTransition>{children}</PageTransition>
    </ProtectedShell>
  );
}
