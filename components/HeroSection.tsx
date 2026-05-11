import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="py-20 sm:py-28 px-4 text-center">
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-hmps.png"
            alt="Logo HMPS Informatika"
            width={120}
            height={120}
            className="rounded-xl"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 tracking-tight">
          Open Recruitment{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">
            HMPS Informatika
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-lg text-amber-400/90 font-medium">
          UIN SMH Banten
        </p>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-400 leading-relaxed animate-fade-in-delay-1">
          Bergabunglah bersama kami dalam Himpunan Mahasiswa Program Studi
          Informatika. Temukan departemen yang sesuai dengan minat dan bakatmu,
          kembangkan potensi, dan jadilah bagian dari perubahan.
        </p>

        {/* Group Photo */}
        <div className="mt-12 animate-fade-in-delay-2">
          <Image
            src="/foto-hmps.jpg"
            alt="Foto Keluarga HMPS Informatika"
            width={800}
            height={450}
            className="rounded-2xl shadow-2xl shadow-violet-900/20 border border-slate-800 mx-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
