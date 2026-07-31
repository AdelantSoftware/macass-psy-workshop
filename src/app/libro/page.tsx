import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export default function LibroPage() {
  return (
    <div className="min-h-dvh bg-base-100 pb-16">
      <PageHeader
        title="Il Libro"
        subtitle="La Voce che Non Sapevo di Avere"
        backHref="/home"
      />

      <div className="layout-padding mt-10 flex flex-col items-center gap-8">
        {/* Foto completa della copertina */}
        <div className="w-full max-w-xs sm:max-w-sm">
          <div className="card bg-base-200 border border-base-300/60 overflow-hidden shadow-xl shadow-black/20">
            <figure className="relative aspect-3/4">
              <Image
                src="/img/copertina-del-libro.jpg"
                alt="Copertina del libro"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 30vw"
              />
            </figure>
          </div>
        </div>

        {/* Titolo e informazioni */}
        <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
          {/* Dove comprarlo */}
          <div className="card bg-base-200 border border-base-300/40 w-full">
            <div className="card-body items-center gap-3">
              <h2 className="card-title font-display text-lg gradient-text">
                Dove acquistarlo
              </h2>
              <p className="text-sm text-base-content/60">
                Puoi trovarlo alla libreria{" "}
                <span className="text-base-content font-semibold">
                  Libreria 100 Pagine
                </span>
              </p>
              <span className="badge badge-outline badge-accent badge-sm mt-1">
                📚 In libreria
              </span>
            </div>
          </div>

          <Link href="/home" className="btn btn-primary rounded-full px-10">
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
}
