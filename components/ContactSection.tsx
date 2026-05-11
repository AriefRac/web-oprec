"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ContactPerson } from "@/types/contact";
import ContactCard from "./ContactCard";

export default function ContactSection() {
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const { data, error: fetchError } = await supabase
          .from("contact_person")
          .select("*");

        if (fetchError) {
          setError("Gagal memuat data contact person.");
          return;
        }

        setContacts(data ?? []);
      } catch {
        setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  return (
    <section id="contact" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Contact Person
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Hubungi panitia jika ada pertanyaan terkait open recruitment.
        </p>

        {loading && (
          <p className="text-center text-gray-500">Memuat data...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && contacts.length === 0 && (
          <p className="text-center text-gray-500">
            Belum ada data contact person.
          </p>
        )}

        {!loading && !error && contacts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                nama={contact.nama}
                nomor_wa={contact.nomor_wa}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
