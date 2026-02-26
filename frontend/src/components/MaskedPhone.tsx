"use client";

import { useState, useEffect } from "react";
import { matchingApi } from "@/lib/api";
import { ContactRequestButton } from "./ContactRequestButton";
import { Toast } from "./Toast";

interface MaskedPhoneProps {
  candidateId: string;
  jobId?: string;
}

type ContactStatus = "none" | "pending" | "accepted";

interface ContactData {
  hasAccess: boolean;
  contact?: {
    phoneNumber: string;
    fullName: string;
  };
  message?: string;
}

export function MaskedPhone({ candidateId, jobId }: MaskedPhoneProps) {
  const [contactStatus, setContactStatus] = useState<ContactStatus>("none");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" | "info" }>({
    visible: false,
    message: "",
    type: "info"
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ visible: true, message, type });
  };

  useEffect(() => {
    checkContactStatus();
  }, [candidateId]);

  const checkContactStatus = async () => {
    setIsLoading(true);
    try {
      const response = await matchingApi.getCandidateContactByRequest(candidateId);
      const data: ContactData = response.data.data;
      
      if (data.hasAccess && data.contact?.phoneNumber) {
        setContactStatus("accepted");
        setPhoneNumber(data.contact.phoneNumber);
      } else {
        const statusResponse = await matchingApi.getRequestStatus(candidateId);
        const statusData = statusResponse.data.data;
        
        if (statusData.status === "ACCEPTED") {
          setContactStatus("accepted");
        } else if (statusData.status === "PENDING") {
          setContactStatus("pending");
        } else {
          setContactStatus("none");
        }
      }
    } catch (error) {
      setContactStatus("none");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSuccess = () => {
    setContactStatus("pending");
    showToast("So'rov yuborildi! Nomzod tasdiqlashini kutish kerak.", "info");
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-2">
        <div className="h-4 w-20 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (contactStatus === "accepted" && phoneNumber) {
    return (
      <>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-verified-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="font-medium text-slate-800">{phoneNumber}</span>
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            Ochildi
          </span>
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

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">********</span>
        </div>
        {contactStatus === "pending" ? (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            So'rov yuborildi, javob kutmoqda...
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            <p className="mb-2">Ko'rish uchun so'rov yuboring</p>
            <ContactRequestButton 
              candidateId={candidateId} 
              jobId={jobId}
              onSuccess={handleRequestSuccess}
            />
          </div>
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
