/* ─── Golf location data ─── */

export interface GolfLocation {
  slug: string;
  name: string;
  city: string;
  address: string;
  coordinates: { lat: number; lng: number };
  /* Robinson projection coords for the SVG map */
  mapX: number;
  mapY: number;
  active: boolean;
  phone?: string;
  openingHours?: string;
  startingPrice?: number;
  description?: string;
  parkingInstructions?: string;
  golfDescription?: string;
  holes?: number;
  par?: number;
  golfWebsiteUrl?: string;
  golfAmenities?: string[];
  photos?: { src: string; alt: string }[];
}

export const golfLocations: GolfLocation[] = [
  {
    slug: "golf-de-dinard",
    name: "Golf de Dinard",
    city: "Saint-Briac-sur-Mer",
    address: "53 Boulevard de la Houle, 35800 Saint-Briac-sur-Mer",
    coordinates: { lat: 48.6308, lng: -2.1355 },
    mapX: 400,
    mapY: 397.5,
    active: true,
    phone: "06 XX XX XX XX",
    openingHours: "Lun–Dim · 7h–19h",
    startingPrice: 29,
    description:
      "The Green Valet est présent au Golf de Dinard. Déposez votre véhicule sur le parking visiteur, confiez vos clés à notre opérateur certifié et retrouvez votre voiture impeccable après votre partie.",
    parkingInstructions:
      "Parking visiteur accessible depuis le Boulevard de la Houle. Notre container se trouve à l'entrée du parking principal.",
    golfDescription:
      "Fondé en 1887, le Golf de Dinard est le deuxième plus ancien golf de France. Situé en bord de mer sur la pointe de la Garde Guérin, il offre un cadre exceptionnel entre falaises et plages, avec une vue panoramique sur la côte d'Émeraude.",
    holes: 18,
    par: 68,
    golfWebsiteUrl: "https://www.dinardgolf.com",
    golfAmenities: ["Restaurant", "Pro-shop", "Practice", "École de golf"],
    photos: [
      { src: "/images/formule-integrale.jpg", alt: "Lavage intégral sur le parking" },
      { src: "/images/formule-essentielle.jpg", alt: "Lavage extérieur vapeur" },
      { src: "/images/formule-prestige.jpg", alt: "Finition prestige" },
    ],
  },
  {
    slug: "golf-de-val-queven",
    name: "Golf de Val Quéven",
    city: "Quéven",
    address: "Kerruisseau, 56530 Quéven",
    coordinates: { lat: 47.793, lng: -3.414 },
    mapX: 398,
    mapY: 401,
    active: false,
  },
  {
    slug: "golf-de-rennes",
    name: "Golf de Rennes",
    city: "Saint-Jacques-de-la-Lande",
    address: "Le Temple du Cerisier, 35136 Saint-Jacques-de-la-Lande",
    coordinates: { lat: 48.067, lng: -1.726 },
    mapX: 402,
    mapY: 399,
    active: false,
  },
  {
    slug: "golf-de-nantes",
    name: "Golf de Nantes",
    city: "Vigneux-de-Bretagne",
    address: "Domaine de la Gascherie, 44360 Vigneux-de-Bretagne",
    coordinates: { lat: 47.314, lng: -1.673 },
    mapX: 401,
    mapY: 403,
    active: false,
  },
  {
    slug: "golf-national",
    name: "Golf National",
    city: "Guyancourt",
    address: "2 Avenue du Golf, 78280 Guyancourt",
    coordinates: { lat: 48.754, lng: 2.073 },
    mapX: 411,
    mapY: 396,
    active: false,
  },
  {
    slug: "golf-de-lyon",
    name: "Golf de Lyon",
    city: "Villette-d'Anthon",
    address: "Domaine de Gavaudun, 38280 Villette-d'Anthon",
    coordinates: { lat: 45.781, lng: 5.083 },
    mapX: 420,
    mapY: 409,
    active: false,
  },
  {
    slug: "golf-de-bordeaux",
    name: "Golf de Bordeaux",
    city: "Bordeaux",
    address: "Domaine de Cameyrac, 33450 Saint-Sulpice-et-Cameyrac",
    coordinates: { lat: 44.852, lng: -0.449 },
    mapX: 404,
    mapY: 412,
    active: false,
  },
  {
    slug: "golf-de-biarritz",
    name: "Golf de Biarritz",
    city: "Biarritz",
    address: "2 Avenue Edith Cavell, 64200 Biarritz",
    coordinates: { lat: 43.469, lng: -1.559 },
    mapX: 404,
    mapY: 416,
    active: false,
  },
  {
    slug: "golf-aix-marseille",
    name: "Golf d'Aix-Marseille",
    city: "Les Milles",
    address: "Domaine de Riquetti, 13290 Aix-en-Provence",
    coordinates: { lat: 43.493, lng: 5.382 },
    mapX: 419,
    mapY: 417,
    active: false,
  },
  {
    slug: "golf-de-strasbourg",
    name: "Golf de Strasbourg",
    city: "Illkirch-Graffenstaden",
    address: "Route du Rhin, 67400 Illkirch-Graffenstaden",
    coordinates: { lat: 48.528, lng: 7.718 },
    mapX: 422,
    mapY: 399,
    active: false,
  },
  {
    slug: "golf-du-touquet",
    name: "Golf du Touquet",
    city: "Le Touquet-Paris-Plage",
    address: "Avenue du Golf, 62520 Le Touquet-Paris-Plage",
    coordinates: { lat: 50.519, lng: 1.585 },
    mapX: 411,
    mapY: 393.5,
    active: false,
  },
  {
    slug: "golf-de-toulouse",
    name: "Golf de Toulouse",
    city: "Vieille-Toulouse",
    address: "Château de la Borde, 31320 Vieille-Toulouse",
    coordinates: { lat: 43.539, lng: 1.443 },
    mapX: 409,
    mapY: 416,
    active: false,
  },
];

export function getGolfBySlug(slug: string): GolfLocation | undefined {
  return golfLocations.find((g) => g.slug === slug);
}
