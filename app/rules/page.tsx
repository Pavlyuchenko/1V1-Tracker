"use client";

import Link from "next/link";
import Navigation from "@/app/components/Navigation";

export default function Pravidla() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8">
          Pravidla
        </h1>

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
            brankářské oblasti (vyznačené na hřišti).
          </p>
          <p>
            <strong>2.2</strong> Rozehrávka se provádí pokaždé, když soupeř
            vstřelí gól. Hráč, který gól dostal, zahajuje novou rozehrávku ze
            své brankářské oblasti. Není nutné čekat na soupeře - rozehrávka se
            může provést okamžitě. Balón však musí stát.
          </p>
          <p>
            <strong>2.3</strong> Soupeř nesmí záměrně blokovat rozehrávku v
            bezprostřední blízkosti.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            3. Počet Doteků
          </h2>
          <p>
            <strong>3.1</strong> Každý hráč má k dispozici dva doteky, které se
            obnoví poté, co se soupeř dotkne míče.
          </p>
          <p>
            <strong>3.2</strong> Chytání v brankářské oblasti: Chycení míče v
            brankářské oblasti se počítá jako jeden dotek.
            <br />
            Chytit balón lze pouze ze vzduchu ve vlastním brankovišti po přímém
            doteku soupeře. Rukou nelze vstřelit gól. Pokud hráč drží balón v
            ruce, nesmí se s ním pohybovat.
          </p>
          <p>
            <strong>3.3</strong> Pokud hráč trefí tyč, má k dispozici jeden
            dotek (nehledě na to, zda tyč trefil svým prvním či druhým dotekem).
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            4. Míč Mimo Hřiště
          </h2>
          <p>
            <strong>4.1 Míč přeletí boční síť:</strong> Pokud míč vyletí ze
            strany hřiště, druhý hráč obdrží míč na stejném místě, kde vyletěl.
            Má k dispozici dva doteky.
          </p>
          <div>
            <strong>4.2 Míč přeletí síť za branou:</strong>
            <p style={{ marginLeft: "15px" }}>
              <strong>4.2.1 Zapřičinění soupeře: </strong>
              Pokud soupeř kopne míč přes síť za branou, hráč si jej položí
              kamkoliv na brankovou čáru a má k dispozici dva doteky.
            </p>
            <p style={{ marginLeft: "15px" }}>
              <strong>4.2.2 Zákrokem brankáře: </strong>
              Pokud po zákroku brankáře míč přeletí síť za branou, získá soupeř
              roh na straně hřiště kde míč opustil hrací plochu. K dispozici má
              dva doteky.
            </p>
          </div>
          <p>
            <strong>4.3 Čára za bránou:</strong> Pokud míč přejde čáru vlastní
            brány po doteku soupeře, hráč jej umístí na nejbližší bod na této
            čáre a hraje se dvěma doteky.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            5. Fauly
          </h2>
          <p>
            <strong>5.1</strong> Fauly se posuzují stejně jako v klasickém
            fotbale (hru rukou, drsný kontakt, podražení apod.).
          </p>
          <div>
            <strong>5.2 Typy faulů</strong>
            <p style={{ marginLeft: "15px" }}>
              <strong>5.2.1 Běžné fauly: </strong>
              Za běžný faul se považuje takový faul, za který by v běžném
              fotbale nebyla udělena červená karta. Při běžném faulu se hra
              přerušuje a hráč, který byl poškozen, obdrží míč na místě, kde
              došlo k faulu, a má k dispozici dva doteky na restart.
            </p>
            <div style={{ marginLeft: "15px" }}>
              <strong>5.2.1 Obzvlášť závažné přestupky: </strong>
              Za obzvlášť závažné přestupky se považuje:
              <ol style={{ listStyleType: "initial", marginLeft: "25px" }}>
                <li>
                  Faul, za který by v běžném fotbale byla udělena červená karta
                </li>
                <li>
                  Úmyslná hra rukou zabraňujicí přímé střele na bránu mimo
                  brankoviště
                </li>
                <li>Skluz, který zasáhne soupeře</li>
              </ol>
              <p>
                Penalizací za první obzvlášť závažný přestupek je tzv. žlutá
                karta, což znamená, že si postižený hráč položí kamkoliv do
                svého brankoviště balón a má výhodu kopu do prázdné branky.
              </p>
              <p>
                Každá další penalizace vyústí ve dva pokusy na vstřelení gólu do
                prázdné branky.
              </p>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            6. Gól
          </h2>
          <p>
            <strong>6.1</strong> Gól je vstřelen, pokud míč překročí brankovou
            čáru.
          </p>
          <p>
            <strong>6.2</strong> Po vstřelení gólu zahajuje druhý hráč novou
            rozehrávku ze své brankářské oblasti.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-3 sm:mt-4">
            7. Vítězství
          </h2>
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
