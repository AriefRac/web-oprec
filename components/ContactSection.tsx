"use client";

import React from "react";

export default function ContactSection() {
  const contactName = "HMPS Informatika";
  const contactWa = "6285163741320";
  const waLink = `https://wa.me/${contactWa}`;

  return (
    <section id="contact" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">
          Contact Person
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Hubungi panitia jika ada pertanyaan terkait open recruitment.
        </p>

        <div className="flex justify-center">
          <div className="bg-slate-800/80 rounded-xl border border-slate-700 p-8 max-w-md w-full text-center hover:border-green-500/50 transition-colors">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">{contactName}</h3>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-green-400 hover:text-green-300 font-medium transition-colors group"
            >
              {/* WhatsApp Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 group-hover:scale-110 transition-transform"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.149-2.868.852.852-2.868-.149-.252A8 8 0 1112 20z" />
              </svg>
              <span className="text-base">085163741320</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
