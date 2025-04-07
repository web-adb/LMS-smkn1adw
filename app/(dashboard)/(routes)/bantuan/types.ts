import { ReactNode } from "react";

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: "umum" | "teknis" | "pembayaran" | "akun";
  icon: ReactNode;
};

export type ContactMethod = {
  id: string;
  name: string;
  value: string;
  description?: string;
  icon: ReactNode;
  action?: string;
  href?: string;
  available?: string;
};

export type GuideResource = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  cta: string;
  href: string;
  type: "doc" | "video" | "troubleshoot" | "api";
};

export type AISuggestion = {
  question: string;
  answer: string;
  relevantFAQ?: string;
};