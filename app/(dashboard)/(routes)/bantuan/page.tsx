"use client";

import { LifeBuoy, Mail, MessageSquare, Phone, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function BantuanDanDukunganPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const faqData = [
    {
      question: "Bagaimana cara mengubah kata sandi?",
      answer: "Anda dapat mengubah kata sandi melalui halaman Pengaturan Akun.",
    },
    {
      question: "Bagaimana cara mengakses materi pembelajaran?",
      answer: "Materi pembelajaran dapat diakses melalui menu 'Kursus' di dashboard Anda.",
    },
    {
      question: "Apa yang harus dilakukan jika lupa kata sandi?",
      answer: "Gunakan fitur 'Lupa Kata Sandi' di halaman login untuk mereset kata sandi Anda.",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Judul Halaman */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <LifeBuoy className="w-6 h-6 text-indigo-600 mr-2" />
        Bantuan dan Dukungan
      </h1>

      {/* Deskripsi */}
      <p className="text-sm text-gray-600 mb-8">
        Kami siap membantu Anda! Temukan solusi untuk masalah Anda atau hubungi tim
        dukungan kami melalui kontak di bawah ini.
      </p>

      {/* Section: Pertanyaan Umum dengan Accordion */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 text-indigo-600 mr-2" />
          Pertanyaan Umum
        </h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center text-left focus:outline-none"
              >
                <h3 className="text-sm font-medium text-gray-600">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openAccordion === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === index && (
                <p className="text-xs text-gray-500 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section: Hubungi Kami dengan Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card Email */}
        <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Mail className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-600">Email</h3>
              <p className="text-xs text-gray-500">dukungan@lmsanda.com</p>
            </div>
          </div>
        </div>

        {/* Card Telepon */}
        <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Phone className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-600">Telepon</h3>
              <p className="text-xs text-gray-500">+62 123 4567 890</p>
            </div>
          </div>
        </div>

        {/* Card Jam Operasional */}
        <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Settings className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-600">Jam Operasional</h3>
              <p className="text-xs text-gray-500">
                Senin - Jumat, 08:00 - 17:00 WIB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Panduan Penggunaan dengan Tombol CTA */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
          <LifeBuoy className="w-5 h-5 text-indigo-600 mr-2" />
          Panduan Penggunaan
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Cara Menggunakan LMS
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Temukan panduan lengkap tentang cara menggunakan LMS di halaman panduan kami.
            </p>
            <a
              href="/panduan"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              Buka Panduan
            </a>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Video Tutorial
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Tonton video tutorial kami untuk panduan visual.
            </p>
            <a
              href="/video-tutorial"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              Tonton Video
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}