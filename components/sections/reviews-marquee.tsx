import { Star } from "lucide-react";

const reviews = [
  {
    name: "Marco R.",
    faculty: "Economia",
    text: "Appunti chiarissimi, ho passato l'esame al primo colpo!",
    rating: 5,
  },
  {
    name: "Giulia T.",
    faculty: "Giurisprudenza",
    text: "Finalmente riassunti ben fatti. Mi hanno salvato la sessione.",
    rating: 5,
  },
  {
    name: "Alessandro M.",
    faculty: "Ingegneria",
    text: "Schematici e completi. Consiglio a tutti i colleghi.",
    rating: 5,
  },
  {
    name: "Sara L.",
    faculty: "Lettere",
    text: "Ottimo rapporto qualità-prezzo. Download immediato.",
    rating: 4,
  },
  {
    name: "Federico B.",
    faculty: "Economia",
    text: "Ho migliorato i miei voti grazie a questi appunti. Top!",
    rating: 5,
  },
  {
    name: "Chiara P.",
    faculty: "Giurisprudenza",
    text: "Molto meglio dei miei appunti. Precisi e aggiornati.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < count ? "text-accent-400 fill-accent-400" : "text-neutral-300"}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  return (
    <div className="flex-shrink-0 w-[260px] p-4 rounded-brand bg-white border border-neutral-200 shadow-card snap-start">
      <Stars count={review.rating} />
      <p className="text-body-sm text-neutral-700 mt-2 mb-3 line-clamp-3">
        &ldquo;{review.text}&rdquo;
      </p>
      <div>
        <p className="text-caption font-bold text-neutral-900">{review.name}</p>
        <p className="text-caption text-neutral-400">{review.faculty}</p>
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  return (
    <section className="py-12 overflow-hidden">
      <div className="container-app mb-6">
        <h2 className="text-display-md text-center">
          Cosa dicono gli studenti
        </h2>
      </div>
      <div className="relative flex">
        <div className="flex animate-marquee-slow gap-4 pr-4">
          {[...reviews, ...reviews].map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
        <div className="flex animate-marquee-slow2 gap-4 pr-4 absolute top-0">
          {[...reviews, ...reviews].map((review, i) => (
            <ReviewCard key={`${review.name}-dup-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
