"use client";

import { ChangeEvent } from "react";
import { useLocaleContext } from "@/components/LocaleProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value);
    window.location.reload();
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={onSelectChange}
        className="appearance-none bg-transparent text-slate-600 hover:text-slate-800 px-3 py-2 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
      >
        <option value="uz">O'zbek</option>
        <option value="ru">Русский</option>
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
