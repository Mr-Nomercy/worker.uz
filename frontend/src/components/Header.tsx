"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { NotificationCenter } from "./NotificationCenter";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  type: "candidate" | "employer" | "admin";
  onMenuClick?: () => void;
  user?: {
    id: string;
    profile?: { fullName?: string };
    company?: { name?: string };
    email?: string;
  };
  company?: {
    name: string;
  };
}

export function Header({ type, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isCandidate = type === "candidate";
  const isAdmin = type === "admin";

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = mounted 
    ? (user?.profile?.fullName || user?.company?.name || user?.email?.split("@")[0] || "User")
    : "User";
  const initials = mounted 
    ? getInitials(userName)
    : "U";

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {/* Hamburger menu - visible only on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div
          className={`${
            isCandidate
              ? "w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600"
              : isAdmin
              ? "w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900"
              : "w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900"
          } flex items-center justify-center text-white font-semibold text-lg`}
        >
          {initials}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {userName}
          </h2>
          <p className="text-sm text-slate-500">
            {isCandidate ? "Verified Candidate" : isAdmin ? "Administrator" : "Employer"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <LanguageSwitcher />
        {(isCandidate || type === "employer") && (
          <NotificationCenter userId={user?.id} />
        )}
        <div className="hidden sm:flex items-center gap-2 bg-verified-light border border-verified-green/30 px-4 py-2 rounded-xl">
          <svg className="w-5 h-5 text-verified-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm font-semibold text-verified-green">
            {isCandidate ? "Verified by My.Gov.uz" : "Verified Business"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Sign Out"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
