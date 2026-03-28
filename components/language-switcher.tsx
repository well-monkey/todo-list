"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "zh" : "en";
    // pathname from next/navigation includes the locale prefix, e.g. /en/foo
    // Replace just the first segment (the locale)
    const withoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${nextLocale}${withoutLocale}`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      className="h-9 gap-2"
      title={t("switch")}
    >
      <Languages className="h-4 w-4" />
      <span>{locale === "en" ? t("zh") : t("en")}</span>
    </Button>
  );
}
