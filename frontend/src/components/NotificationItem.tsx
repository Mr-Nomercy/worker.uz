"use client";

import { matchingApi } from "@/lib/api";

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

interface NotificationItemProps {
  notification: NotificationData;
  onAction?: (action: "accept" | "reject", requestId: string) => void;
  onRead?: (id: string) => void;
}

export function NotificationItem({ notification, onAction, onRead }: NotificationItemProps) {
  const handleAccept = () => {
    if (notification.message.includes("bog'lanmoqchi")) {
      const requestId = notification.id;
      onAction?.("accept", requestId);
    }
  };

  const handleReject = () => {
    if (notification.message.includes("bog'lanmoqchi")) {
      const requestId = notification.id;
      onAction?.("reject", requestId);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Hozir";
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;
    return date.toLocaleDateString("uz-UZ");
  };

  const getTypeStyles = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const isContactRequest = notification.message.includes("bog'lanmoqchi");

  return (
    <div
      className={`p-4 rounded-xl border ${getTypeStyles()} ${!notification.isRead ? 'ring-2 ring-primary-500/20' : ''}`}
      onClick={() => !notification.isRead && onRead?.(notification.id)}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-slate-800 text-sm">{notification.title}</h4>
            <span className="text-xs text-slate-400 whitespace-nowrap">{formatTime(notification.createdAt)}</span>
          </div>
          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>

          {isContactRequest && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="flex-1 py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Tasdiqlash
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Rad etish
              </button>
            </div>
          )}
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
}
