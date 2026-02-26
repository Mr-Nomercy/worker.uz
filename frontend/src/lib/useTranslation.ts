"use client";

import { useLocaleContext } from "@/components/LocaleProvider";

const translations = {
  uz: {
    common: {
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
      logout: "Chiqish",
      save: "Saqlash",
      cancel: "Bekor qilish",
      confirm: "Tasdiqlash",
      search: "Qidirish",
      loading: "Yuklanmoqda...",
      error: "Xatolik",
      success: "Muvaffaqiyat",
    },
    nav: {
      dashboard: "Dashboard",
      jobs: "Ishlar",
      candidates: "Nomzodlar",
      applications: "Arizalar",
      interviews: "Suhbatlar",
      vacancies: "Vakansiyalar",
      matches: "Mosliklar",
      settings: "Sozlamalar",
      profile: "Profil",
      cv: "Rezyume",
      admin: "Admin",
    },
    auth: {
      email: "Email",
      password: "Parol",
      welcome: "Xush kelibsiz",
      loginTitle: "Tizimga kirish",
      registerTitle: "Ro'yxatdan o'tish",
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Xush kelibsiz",
      totalUsers: "Jami foydalanuvchilar",
      verifiedWorkers: "Tasdiqlangan ishchilar",
      activeJobs: "Faol vakansiyalar",
    },
    candidate: {
      title: "Nomzod",
      skills: "Ko'nikmalar",
      verified: "Tasdiqlangan",
    },
    admin: {
      title: "Admin panel",
      users: "Foydalanuvchilar",
      companies: "Kompaniyalar",
      auditLogs: "Audit jurnali",
    },
    footer: {
      rights: "Barcha huquqlar himoyalangan",
    }
  },
  ru: {
    common: {
      login: "Вход",
      register: "Регистрация",
      logout: "Выйти",
      save: "Сохранить",
      cancel: "Отмена",
      confirm: "Подтвердить",
      search: "Поиск",
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успешно",
    },
    nav: {
      dashboard: "Дашборд",
      jobs: "Работа",
      candidates: "Кандидаты",
      applications: "Заявки",
      interviews: "Собеседования",
      vacancies: "Вакансии",
      matches: "Совпадения",
      settings: "Настройки",
      profile: "Профиль",
      cv: "Резюме",
      admin: "Админ",
    },
    auth: {
      email: "Электронная почта",
      password: "Пароль",
      welcome: "Добро пожаловать",
      loginTitle: "Вход в систему",
      registerTitle: "Регистрация",
    },
    dashboard: {
      title: "Дашборд",
      welcome: "Добро пожаловать",
      totalUsers: "Всего пользователей",
      verifiedWorkers: "Верифицированные работники",
      activeJobs: "Активные вакансии",
    },
    candidate: {
      title: "Кандидат",
      skills: "Навыки",
      verified: "Верифицирован",
    },
    admin: {
      title: "Админ панель",
      users: "Пользователи",
      companies: "Компании",
      auditLogs: "Журнал аудита",
    },
    footer: {
      rights: "Все права защищены",
    }
  }
};

type TranslationKeys = typeof translations.uz;

export function useTranslation() {
  const { locale } = useLocaleContext();
  
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[locale as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return { t, locale };
}
