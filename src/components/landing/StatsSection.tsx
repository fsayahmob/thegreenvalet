const stats = [
  {
    value: "6L",
    label: "d'eau par véhicule",
    detail: "vs 200L en station classique",
  },
  {
    value: "0",
    label: "produit chimique",
    detail: "vapeur haute pression uniquement",
  },
  {
    value: "0€",
    label: "d'investissement",
    detail: "pour le golf partenaire",
  },
  {
    value: "48h",
    label: "d'installation",
    detail: "livré, branché, opérationnel",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 sm:py-24 bg-green-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-base font-medium text-green-300">
                {stat.label}
              </p>
              <p className="mt-1 text-sm text-green-200/80">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
