import { useTranslations } from "next-intl";
import { CheckSquareOutlined } from "@ant-design/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { TodoList } from "@/components/todo-list";

export default function Home() {
  const t = useTranslations("app");

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquareOutlined style={{ fontSize: 22 }} />
            <div>
              <h1 className="text-xl font-bold leading-tight m-0">{t("title")}</h1>
              <p className="text-xs text-gray-500 m-0">{t("subtitle")}</p>
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
