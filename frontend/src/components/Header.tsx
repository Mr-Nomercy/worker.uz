"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/login/page";

interface HeaderProps {
  type: "candidate" | "employer" | "admin";
}

export function Header({ type }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCandidate = type === "candidate";
  const isAdmin = type === "admin";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.profile?.fullName || user?.company?.name || user?.email?.split("@")[0] || "User";
  const initials = getInitials(userName);

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
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
      <div className="flex items-center gap-4">
        {isCandidate && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 bg-verified-light border border-verified-green/30 px-4 py-2 rounded-xl">
          <svg
            className="w-5 h-5 text-verified-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="text-sm font-semibold text-verified-green">
            {isCandidate ? "Verified by My.Gov.uz" : "Verified Business"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
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
