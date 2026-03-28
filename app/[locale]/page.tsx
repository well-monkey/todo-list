import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { TodoList } from "@/components/todo-list";
import { CheckSquare } from "lucide-react";

export default function Home() {
  const t = useTranslations("app");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold leading-tight">{t("title")}</h1>
              <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main>
          <TodoList />
        </main>
      </div>
    </div>
  );
}
