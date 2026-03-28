"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "antd";
import { TranslationOutlined } from "@ant-design/icons";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "zh" : "en";
    const withoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${nextLocale}${withoutLocale}`);
  };

  return (
    <Button
      icon={<TranslationOutlined />}
      onClick={toggleLocale}
      title={t("switch")}
    >
      {locale === "en" ? t("zh") : t("en")}
    </Button>
  );
}
