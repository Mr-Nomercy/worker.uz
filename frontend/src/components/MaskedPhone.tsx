"use client";

import { matchingApi } from "@/lib/api";
import { ContactRequestButton } from "./ContactRequestButton";

interface MaskedPhoneProps {
  candidateId: string;
  jobId?: string;
}

type ContactStatus = "none" | "pending" | "accepted";

export function MaskedPhone({ candidateId, jobId }: MaskedPhoneProps) {
  const [contactStatus, setContactStatus] = React.useState<ContactStatus>("none");
  const [phoneNumber, setPhoneNumber] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkContactStatus();
  }, [candidateId]);

  const checkContactStatus = async () => {
    setIsLoading(true);
    try {
      const response = await matchingApi.getRequestStatus(candidateId);
      const data = response.data.data;
      
      if (data.status === "ACCEPTED") {
        setContactStatus("accepted");
        const contactResponse = await matchingApi.requestContact(candidateId, { jobId });
        setPhoneNumber(contactResponse.data.data.contact?.phoneNumber || null);
      } else if (data.status === "PENDING") {
        setContactStatus("pending");
      } else {
        setContactStatus("none");
      }
    } catch (error) {
      setContactStatus("none");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSuccess = () => {
    setContactStatus("pending");
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
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-verified-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="font-medium text-slate-800">{phoneNumber}</span>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
          Ochildi
        </span>
      </div>
    );
  }

  return (
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
  );
}

import React from "react";
