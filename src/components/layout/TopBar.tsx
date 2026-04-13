import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenuButton } from "./MobileMenuButton";

interface TopBarProps {
  title: string;
}

export async function TopBar({ title }: TopBarProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const displayName = fullName ?? user?.email ?? "";

  const initials = fullName
    ? fullName
        .split(" ")
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : displayName.slice(0, 2).toUpperCase();

  return (
    <header className="flex justify-between items-center px-4 sm:px-8 lg:px-12 h-16 sm:h-20 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <MobileMenuButton />
        <h1 className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="flex items-center gap-3 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none">{fullName ?? user?.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
