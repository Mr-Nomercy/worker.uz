"use client";

import { useState, useRef } from "react";
import { matchingApi } from "@/lib/api";
import { Toast } from "./Toast";

interface ContactRequestButtonProps {
  candidateId: string;
  jobId?: string;
  onSuccess?: () => void;
}

type ButtonState = "idle" | "loading" | "sent" | "error";

export function ContactRequestButton({ candidateId, jobId, onSuccess }: ContactRequestButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" | "info" }>({
    visible: false,
    message: "",
    type: "info"
  });
  const isRequestInProgress = useRef(false);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ visible: true, message, type });
  };

  const handleRequest = async () => {
    if (isRequestInProgress.current) {
      return;
    }

    isRequestInProgress.current = true;
    setState("loading");
    setErrorMessage("");

    try {
      await matchingApi.requestContact(candidateId, { jobId });
      setState("sent");
      showToast("So'rov muvaffaqiyatli yuborildi! Nomzod javobini kutishiga roziman.", "success");
      onSuccess?.();
    } catch (error: any) {
      setState("error");
      const message = error?.message || "Xatolik yuz berdi";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      isRequestInProgress.current = false;
    }
  };

  const isDisabled = state === "loading" || state === "sent";

  if (state === "sent") {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 cursor-default"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        So'rov yuborildi
      </button>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={handleRequest}
          disabled={isDisabled}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {state === "loading" ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Yuborilmoqda...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Bog'lanish
            </>
          )}
        </button>
        {state === "error" && errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </>
  );
}
