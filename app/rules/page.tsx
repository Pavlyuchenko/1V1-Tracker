"use client";

import Link from "next/link";
import Navigation from "@/app/components/Navigation";

export default function Pravidla() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8">Pravidla</h1>

        <div className="bg-gray-50 border border-gray-200 p-5 sm:p-8 space-y-5 sm:space-y-6 text-gray-800 text-sm sm:text-base">
          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            1. Základní Principy
          </h2>
          <p>
            Hra se hraje mezi dvěma hráči na hřišti s vyznačenými hranicemi.
            Cílem je vstřelit pět gólů bez časového omezení.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            2. Zahájení a Rozehrávka
          </h2>
          <p>
            <strong>2.1</strong> Hru zahajuje jeden z hráčů kopem z jeho
            brankářské oblasti (vyznačené na hřišti). Míč musí překročit
            středovou čáru.
          </p>
          <p>
            <strong>2.2</strong> Pokud míč středovou čáru nepřekročí, hráč,
            který zahajoval, provádí nový pokus.
          </p>
          <p>
            <strong>2.3</strong> Rozehrávka se provádí pokaždé, když soupeř
            vstřelí gól. Hráč, který gól dostal, zahajuje novou rozehrávku z své
            brankářské oblasti. Není nutné čekat na soupeře - rozehrávka se může
            provést okamžitě.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            3. Počet Dotyků
          </h2>
          <p>
            <strong>3.1</strong> Každý hráč má k dispozici dva dotyky, které se
            obnoví poté, co se soupeř dotkne míče.
          </p>
          <p>
            <strong>3.2 Chytání v brankářské oblasti:</strong> Chycení míče v
            brankářské oblasti se počítá jako jeden dotyk.
          </p>
          <p>
            <strong>3.3</strong> Pokud hráč trefí tyč, obdrží jeden dodatečný
            dotyk k dispozici.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            4. Míč Mimo Hřiště
          </h2>
          <p>
            <strong>4.1 Boční čára:</strong> Pokud míč vyletí ze strany hřiště,
            druhý hráč obdrží míč na stejném místě, kde vyletěl. Má k dispozici
            dva dotyky.
          </p>
          <p>
            <strong>4.2 Čára za bránou:</strong> Pokud míč přejde čáru za
            bránou, hráč jej umístí na čáru tam, kde ji míč přešel a hraje se
            dvěma dotyky.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">5. Fauly</h2>
          <p>
            <strong>5.1</strong> Fauly se posuzují stejně jako v klasickém
            fotbale (hru rukou, drsný kontakt, podražení apod.).
          </p>
          <p>
            <strong>5.2</strong> Při faulu se hra přerušuje a hráč, který byl
            poškozen, obdrží míč na místě, kde došlo k faulu, a má k dispozici
            dva dotyky na restart.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">6. Gól</h2>
          <p>
            <strong>6.1</strong> Gól je vstřelen, pokud míč překročí čáru za
            bránou soupeře.
          </p>
          <p>
            <strong>6.2</strong> Po vstřelení gólu zahajuje druhý hráč novou
            rozehrávku ze své brankářské oblasti.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">7. Vítězství</h2>
          <p>První hráč, který vstřelí pět gólů, je vítězem zápasu.</p>
        </div>

        <Link
          href="/"
          className="inline-block mt-6 sm:mt-8 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
        >
          ← Zpět na domovskou stránku
        </Link>
      </div>
    </div>
  );
}
