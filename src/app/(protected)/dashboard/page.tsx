import { TopBar } from "@/components/layout/TopBar";
import { DashboardHero } from "@/components/layout/DashboardHero";

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Inicio" />
      <main className="flex-1 dot-grid">
        <DashboardHero />
      </main>
    </>
  );
}
