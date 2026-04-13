import { TopBar } from "@/components/layout/TopBar";
import { PlanSearch } from "@/components/plans/PlanSearch";

export default function SearchPage() {
  return (
    <>
      <TopBar title="Cotizar planes" />
      <main className="flex-1 dot-grid">
        <PlanSearch />
      </main>
    </>
  );
}
