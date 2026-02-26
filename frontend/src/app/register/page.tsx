"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  pinfl?: string;
  passportSeries?: string;
  fullName?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    pinfl: "",
    passportSeries: "",
    fullName: "",
    birthDate: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email kiritish majburiy";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "To'g'ri email formatini kiriting";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Parol kiritish majburiy";
    if (password.length < 6) return "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword) return "Parolni tasdiqlash majburiy";
    if (confirmPassword !== formData.password) return "Parollar mos kelmadi";
    return undefined;
  };

  const validatePinfl = (pinfl: string): string | undefined => {
    if (!pinfl) return "PINFL kiritish majburiy";
    if (!/^\d{14}$/.test(pinfl)) return "PINFL 14 ta raqamdan iborat bo'lishi kerak";
    return undefined;
  };

  const validatePassport = (passport: string): string | undefined => {
    if (!passport) return "Pasport seria kiritish majburiy";
    if (!/^[A-Z]{2}\d{7}$/.test(passport)) return "Masalan: AA1234567";
    return undefined;
  };

  const validateFullName = (fullName: string): string | undefined => {
    if (!fullName) return "To'liq ism kiritish majburiy";
    if (fullName.length < 2) return "To'liq ism kiriting";
    return undefined;
  };

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "email": return validateEmail(value);
      case "password": return validatePassword(value);
      case "confirmPassword": return validateConfirmPassword(value);
      case "pinfl": return validatePinfl(value);
      case "passportSeries": return validatePassport(value);
      case "fullName": return validateFullName(value);
      default: return undefined;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, formData[field as keyof typeof formData]) }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
      pinfl: validatePinfl(formData.pinfl),
      passportSeries: validatePassport(formData.passportSeries),
      fullName: validateFullName(formData.fullName),
    };
    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      pinfl: true,
      passportSeries: true,
      fullName: true,
    });
    return !Object.values(newErrors).some(e => e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await authApi.register({
        email: formData.email,
        password: formData.password,
        pinfl: formData.pinfl,
        passportSeries: formData.passportSeries,
        fullName: formData.fullName,
        birthDate: formData.birthDate || "1990-01-01",
      });
      setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err?.message || "Ro'yxatdan o'tish muvaffaqiyatsiz. Qayta urinib ko'ring.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
      errors[field] && touched[field]
        ? "border-red-500 bg-red-50 focus:border-red-500"
        : "border-slate-200 focus:border-primary-500 bg-white"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Worker</h1>
          <p className="text-slate-400">Ro'yxatdan o'tish</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To'liq ism</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                onBlur={() => handleBlur("fullName")}
                className={inputClass("fullName")}
                placeholder="Aziz Karimov"
                disabled={isLoading}
              />
              {errors.fullName && touched.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={inputClass("email")}
                placeholder="email@example.com"
                disabled={isLoading}
              />
              {errors.email && touched.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PINFL</label>
                <input
                  type="text"
                  value={formData.pinfl}
                  onChange={(e) => handleChange("pinfl", e.target.value.replace(/\D/g, "").slice(0, 14))}
                  onBlur={() => handleBlur("pinfl")}
                  className={inputClass("pinfl")}
                  placeholder="12345678901234"
                  disabled={isLoading}
                />
                {errors.pinfl && touched.pinfl && <p className="mt-1 text-sm text-red-500">{errors.pinfl}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pasport</label>
                <input
                  type="text"
                  value={formData.passportSeries}
                  onChange={(e) => handleChange("passportSeries", e.target.value.toUpperCase().slice(0, 9))}
                  onBlur={() => handleBlur("passportSeries")}
                  className={inputClass("passportSeries")}
                  placeholder="AA1234567"
                  disabled={isLoading}
                />
                {errors.passportSeries && touched.passportSeries && <p className="mt-1 text-sm text-red-500">{errors.passportSeries}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Parol</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={inputClass("password")}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && touched.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Parolni tasdiqlang</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                className={inputClass("confirmPassword")}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && touched.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/25 flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ro'yxatdan o'tish...
                </>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Allaqachon hisobingiz bormi?{" "}
              <button onClick={() => router.push("/login")} className="text-primary-600 hover:text-primary-700 font-medium">
                Kirish
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
