"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { golfLocations } from "@/lib/golf-data";

/* ─── Real geographic paths (Robinson projection, MIT — simple-world-map) ─── */

const paths = {
  ireland:
    "M394.915,383.085l-0.786,5.187l-6.975,2.56h-2.223l-1.582-1.115v-0.96l3.492-2.238l-0.951-1.92l0.156-2.714l3.018,0.155l1.383-3.25l-0.183,2.887l2.344,1.858L394.915,383.085z",
  ukMainland:
    "M400.629,367.984l-1.582,2.395l0.631,0.959h3.648v1.6l-0.952,1.278l0.632,3.354l2.058,3.994l1.581,3.672l2.533,0.959l1.105,1.92l-0.155,1.755l-1.582,0.959l-0.156,0.795l1.106,0.64l-0.951,1.279l-2.221,0.959l-4.279-0.477l-6.664,3.035l-2.221-1.115l6.345-3.674l-0.796-0.477l-3.328-0.32l2.058-3.033l0.319-2.56l2.696-0.319l-0.475-4.953l-3.174-0.155l-0.95-1.115l0.155-3.674l-1.901,0.156l1.901-6.388l3.492-2.56L400.629,367.984z",
  ukNI:
    "M393.974,378.693l-2.853,0.32l-0.156,2.56l1.901,1.278l2.058-0.475l0.796-1.436L393.974,378.693z",
  netherlands:
    "M421.349,384.572l-3.915,1.928l0.829,0.752l0.088,1.928l-0.829-0.164l-0.917-1.426l-2.188,3.467l3.363,0.699l1.253,1.323l0.666,0.017l0.44-2.99l2.117-0.891L421.349,384.572z",
  belgium:
    "M414.019,391.704l-0.554,1.383l5.947,3.925l0.4,0.051l0.375-1.094l0.837-0.588l-1.336-1.499h-0.916l-1.255-1.426L414.019,391.704z",
  luxembourg:
    "M420.424,397.582l0.76,0.679l0.88,0.083l0.194-1.734l-0.253-0.974l-1.224,0.583L420.424,397.582z",
  germany:
    "M422.257,384.234l3.086-0.5v-2.178l2.584-0.425l1.418,1.427l1.495,0.164l2.334-1.012l2.083,0.588l1.832,1.592l0.251,5.955l1.832,2.438l-2.411,0.337l-4.003,2.515l0.338,0.839l3.579,3.354l-0.251,1.677l-3.328,1.677l-3.085,0.086l-0.753,1.59h-1.581l-0.752-1.676l-2.749-0.675l-0.088-2.767l-1.39-0.77l0.114-1.861l-0.406-1.328l-1.982-1.824l0.414-2.854l2.161-1.011L422.257,384.234z",
  france:
    "M412.973,393.588l-1.91,0.467l-3.82,4.158l-1.149,0.078l-1.53-1.081l-0.993,0.233l-0.762,2.386l-5.584,0.155l0.156,1.236l3.82,2.543l4.435,3.543l-0.077,4.236l-2.368,4.157l5.126,2.464l5.204,0.154l1.606-1.85l3.286,0.078l0.916,0.848l3.285-0.233l1.686-2.162l-2.145-2.541l-0.155-1.616l0.458-1.771l-1.071-1.539l-1.833,0.535l-0.232-1.383l4.054-4.469v-2.697l-2.348-0.767l-1.432-0.987L412.973,393.588z",
  corsica:
    "M428.039,418.016l-1.687,1.695l-0.154,1.538l1.374,0.847l0.536-0.076l0.303-2.24L428.039,418.016z",
  switzerland:
    "M423.787,402.82l-3.771,4.011l0.078,0.405l1.547-0.483l1.393,1.937l2.352-0.83l1.625,1.263l0.667-0.38l2.005-3.146l-0.511-0.484l-1.979-0.051l-0.959-1.963L423.787,402.82z",
  austria:
    "M430.46,403.459l-0.562,1.167l0.483,0.83l2.015-0.415h1.711l1.857,1.572l3.95-0.717l2.904-1.729l0.743-1.167l-0.112-1.504l-2.611-1.954l-3.501,0.035l-0.294,1.988l-3.683,1.797L430.46,403.459z",
  portugal:
    "M387.499,421.716l-0.536,7.478l-1.53,1.384l0.156,0.846l1.071,1.772l-0.691,2.16l1.149,0.39l2.68-0.312l-0.155-2.16l1.756-10.02l-0.382-1.383L387.499,421.716z",
  spain:
    "M402.565,416.322h-11.014l-2.222-1.004l-1.071,0.078l-1.297,2.696l0.458,2.775l4.21,0.389l0.536,1.771l-1.833,10.33l0.078,1.851l2.981,1.617l3.439,0.232l6.881-1.694l3.363-4.233l0.077-4.313l5.965-5.395l0.302-2.386l-5.428-0.078L402.565,416.322z",
  spainBalearic:
    "M413.578,426.877l-1.375,0.467l0.304,1.235h1.988l0.839-0.925L413.578,426.877z",
  italy:
    "M423.233,409.391l-0.535,1.356l0.146,1.478l2.065,2.412l3.25-0.113l7.175,8.334l4.479,1.297l2.646,2.498l0.631,5.695l1.417-0.828l1.229-3.104l-0.303-2.229l2.101-0.19l0.304-1.263l-5.922-2.834l-5.619-5.523l-2.238-3.303l-0.545-3.137l2.861-0.684l-0.734-2.066l-1.755-1.478l-1.513-0.069l-2.108,0.58l-1.99,2.781l-1.201,0.795l-1.858-1.141L423.233,409.391z",
  sicily:
    "M440.668,431.898l-1.253-0.674l-4.278,0.674l0.146,1.158l3.847,1.937l0.579,0.631l1.012,0.147L440.668,431.898z",
  sardinia:
    "M427.806,423.566l-2.289,1.158l0.303,4.469l1.833,0.311l1.374-1.312v-4.235L427.806,423.566z",
};

const allCountryKeys = [
  "ireland", "ukMainland", "ukNI", "netherlands", "belgium", "luxembourg",
  "germany", "france", "switzerland", "austria", "portugal", "spain",
  "spainBalearic", "italy", "sicily", "sardinia", "corsica",
] as const;

function GolfDot({
  golf,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  golf: (typeof golfLocations)[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const x = golf.mapX;
  const y = golf.mapY;
  const r = golf.active ? 2 : 1.3;

  /* Tooltip sizing — clamp within viewBox 392–432 × 389–423 */
  const label = golf.name;
  const ttW = label.length * 1.35 + 5;
  const ttH = 5.5;
  const rawTtX = x - ttW / 2;
  const ttX = Math.max(392.5, Math.min(rawTtX, 431.5 - ttW));
  const fitsAbove = y - ttH - 4 >= 389;
  const ttY = fitsAbove ? y - ttH - 3 : y + 3.5;

  return (
    <g
      role="link"
      tabIndex={0}
      aria-label={`${golf.name}, ${golf.city}${golf.active ? "" : " — bientôt disponible"}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer outline-none"
    >
      {/* Hover glow */}
      {isHovered && (
        <circle
          cx={x}
          cy={y}
          r={r + 2}
          className={golf.active ? "fill-green-500/10" : "fill-charcoal-200/30"}
        />
      )}

      {/* Active pulse */}
      {golf.active && (
        <circle
          cx={x}
          cy={y}
          r={3}
          className="fill-green-500/20 animate-ping"
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      )}

      {/* Dot */}
      <circle
        cx={x}
        cy={y}
        r={isHovered ? r + 0.5 : r}
        className={
          golf.active
            ? "fill-green-600 stroke-white stroke-[0.5]"
            : isHovered
              ? "fill-charcoal-500 stroke-white stroke-[0.4]"
              : "fill-charcoal-300 stroke-white stroke-[0.3]"
        }
      />

      {/* Tooltip */}
      {isHovered && (
        <g>
          <rect
            x={ttX}
            y={ttY}
            width={ttW}
            height={ttH}
            rx={1}
            className="fill-charcoal-900"
          />
          {fitsAbove ? (
            <polygon
              points={`${x - 1},${ttY + ttH} ${x + 1},${ttY + ttH} ${x},${ttY + ttH + 1.3}`}
              className="fill-charcoal-900"
            />
          ) : (
            <polygon
              points={`${x - 1},${ttY} ${x + 1},${ttY} ${x},${ttY - 1.3}`}
              className="fill-charcoal-900"
            />
          )}
          <text
            x={ttX + ttW / 2}
            y={ttY + 3.6}
            textAnchor="middle"
            className="fill-white font-medium"
            fontSize="2.2"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

export function GolfMapSection() {
  const router = useRouter();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const activeCount = golfLocations.filter((g) => g.active).length;
  const comingSoonCount = golfLocations.filter((g) => !g.active).length;

  return (
    <section id="book" className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Nos golfs"
          title="Trouvez un golf près de chez vous"
          description="Premiers déploiements en Bretagne. D'autres sites arrivent bientôt partout en France."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Map — zoomed on France */}
          <div className="lg:col-span-2 relative">
            <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-sm overflow-hidden">
              <svg
                viewBox="392 389 40 34"
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Carte des golfs The Green Valet en France"
              >
                <rect x="392" y="389" width="40" height="34" fill="#fafcfa" />

                {/* Neighboring countries — muted */}
                {allCountryKeys
                  .filter((k) => k !== "france" && k !== "corsica")
                  .map((key) => (
                    <path
                      key={key}
                      d={paths[key]}
                      fill="#f3f3f3"
                      stroke="#dcdcdc"
                      strokeWidth={0.2}
                      strokeLinejoin="round"
                    />
                  ))}

                {/* France + Corsica — highlighted */}
                {(["france", "corsica"] as const).map((key) => (
                  <path
                    key={key}
                    d={paths[key]}
                    fill="#eaefea"
                    stroke="#b5c4b9"
                    strokeWidth={0.4}
                    strokeLinejoin="round"
                  />
                ))}

                <text
                  x="410"
                  y="408"
                  fontSize="2"
                  fill="#c5c5c5"
                  fontWeight="500"
                  textAnchor="middle"
                  letterSpacing={0.3}
                >
                  FRANCE
                </text>

                {/* Dots — non-hovered first for z-order */}
                {golfLocations.map(
                  (golf, i) =>
                    hoveredIdx !== i && (
                      <GolfDot
                        key={golf.slug}
                        golf={golf}
                        isHovered={false}
                        onHover={() => setHoveredIdx(i)}
                        onLeave={() => setHoveredIdx(null)}
                        onClick={() =>
                          router.push(
                            golf.active
                              ? `/golfs/${golf.slug}`
                              : "/golf#simulator",
                          )
                        }
                      />
                    ),
                )}

                {/* Hovered dot — rendered last (on top) */}
                {hoveredIdx !== null && (
                  <GolfDot
                    key={`hover-${golfLocations[hoveredIdx].slug}`}
                    golf={golfLocations[hoveredIdx]}
                    isHovered
                    onHover={() => setHoveredIdx(hoveredIdx)}
                    onLeave={() => setHoveredIdx(null)}
                    onClick={() =>
                      router.push(
                        golfLocations[hoveredIdx].active
                          ? `/golfs/${golfLocations[hoveredIdx].slug}`
                          : "/golf#simulator",
                      )
                    }
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Legend + CTA */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Actif</p>
                    <p className="text-xs text-muted-foreground">Service disponible</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-full h-3 w-3 bg-charcoal-300" />
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Bientôt</p>
                    <p className="text-xs text-muted-foreground">En cours de déploiement</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-3xl font-bold text-green-900">{activeCount}</p>
                <p className="text-sm text-muted-foreground">golf actif</p>
                <p className="mt-2 text-3xl font-bold text-charcoal-400">{comingSoonCount}</p>
                <p className="text-sm text-muted-foreground">en préparation</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-green-50 p-6">
              <p className="text-sm font-semibold text-green-900">
                Votre golf n&apos;est pas sur la carte ?
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Proposez-le et soyez prévenu dès l&apos;ouverture du service.
              </p>
              <Button size="sm" className="mt-4 w-full" asChild>
                <Link href="/golf#simulator">
                  Suggérer mon golf
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
