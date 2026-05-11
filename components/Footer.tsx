import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Contact & Social */}
        <div className="flex flex-col items-center gap-8">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-hmps.png"
              alt="Logo HMPS"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-lg font-semibold text-gray-100">
              HMPS Informatika
            </span>
          </div>

          {/* Contact Person */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">Hubungi Kami</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* WhatsApp */}
              <a
                href="https://wa.me/6285163741320"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-all duration-300 group bg-slate-800/60 px-4 py-2 rounded-full border border-slate-700 hover:border-green-500/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.149-2.868.852.852-2.868-.149-.252A8 8 0 1112 20z" />
                </svg>
                <span className="text-sm font-medium">085163741320</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/hmpsinformatikaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-all duration-300 group bg-slate-800/60 px-4 py-2 rounded-full border border-slate-700 hover:border-pink-500/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span className="text-sm font-medium">@hmpsinformatikaa</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; 2026 HMPS Informatika UIN SMH Banten
          </p>
        </div>
      </div>
    </footer>
  );
}
