import { BookOpen, Users, Star, Download } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "200+", label: "Appunti disponibili" },
  { icon: Users, value: "5.000+", label: "Studenti soddisfatti" },
  { icon: Star, value: "4.8", label: "Valutazione media" },
  { icon: Download, value: "15.000+", label: "Download totali" },
];

export function SocialProof() {
  return (
    <section className="py-6 border-y border-neutral-200 bg-neutral-100">
      <div className="container-app">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-brand bg-primary-100">
                <stat.icon size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-body-md font-bold text-neutral-900">
                  {stat.value}
                </p>
                <p className="text-caption text-neutral-400">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
