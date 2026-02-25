"use client";

import { useState, useRef, useEffect } from "react";

interface UserInfo {
  name: string;
  role: string;
  initials: string;
}

interface CompanyInfo {
  name: string;
  industry: string;
  initials: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface HeaderProps {
  type: "candidate" | "employer";
  user?: UserInfo;
  company?: CompanyInfo;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Job Match",
    message: "A new Full Stack Developer position matches your profile",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Interview Scheduled",
    message: "TechCorp Uzbekistan scheduled an interview for tomorrow",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "Application Update",
    message: "Your application to Payme Solutions is under review",
    time: "1 day ago",
    read: true,
  },
];

export function Header({ type, user, company }: HeaderProps) {
  const isCandidate = type === "candidate";
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div
          className={`${
            isCandidate
              ? "w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600"
              : "w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900"
          } flex items-center justify-center text-white font-semibold text-lg`}
        >
          {isCandidate ? user?.initials : company?.initials}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {isCandidate ? user?.name : company?.name}
          </h2>
          <p className="text-sm text-slate-500">
            {isCandidate ? user?.role : company?.industry}
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
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-b-0 ${
                        !notification.read ? "bg-primary-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "bg-primary-500" : "bg-transparent"}`} />
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 text-sm">{notification.title}</p>
                          <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                  <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
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
      </div>
    </header>
  );
}
