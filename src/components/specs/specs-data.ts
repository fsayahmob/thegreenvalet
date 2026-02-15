import {
  Box,
  PanelTop,
  Zap,
  Droplets,
  Wrench,
  LayoutDashboard,
  Scale,
  Leaf,
  ShieldCheck,
  FileText,
} from "lucide-react";

export interface SpecTable {
  headers: string[];
  rows: string[][];
}

export interface SpecSection {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  content: Array<{
    subtitle?: string;
    text?: string;
    table?: SpecTable;
    note?: string;
  }>;
}

export const specs: SpecSection[] = [
  {
    id: "container",
    icon: Box,
    title: "Container — Dimensions",
    description: "Cotes extérieures, intérieures et hors-tout du container de base",
    content: [
      {
        subtitle: "Cotes extérieures",
        table: {
          headers: ["Dimension", "Valeur"],
          rows: [
            ["Longueur extérieure", "3 802 mm"],
            ["Largeur extérieure", "2 210 mm"],
            ["Hauteur extérieure", "2 240 mm"],
            ["Surface au sol", "~8,4 m²"],
          ],
        },
      },
      {
        subtitle: "Cotes intérieures",
        table: {
          headers: ["Dimension", "Valeur"],
          rows: [
            ["Longueur intérieure", "3 727 mm"],
            ["Largeur intérieure", "2 135 mm"],
            ["Hauteur intérieure", "2 100 mm"],
            ["Surface utile", "~7,96 m²"],
            ["Volume intérieur", "~16,7 m³"],
          ],
        },
      },
      {
        subtitle: "Ouvertures",
        table: {
          headers: ["Élément", "Valeur"],
          rows: [
            ["Porte (pignon A) — largeur totale", "1 750 mm"],
            ["Porte — vantail droit / gauche", "937 / 813 mm"],
            ["Porte — hauteur", "2 050 mm"],
            ["Ouverture face longue — largeur", "2 910 mm"],
            ["Ouverture — offset côté porte", "850 mm de mur plein"],
            ["Ouverture — offset côté opposé", "~42 mm (poteau structurel)"],
          ],
        },
        note: "L'ouverture n'est PAS centrée. Elle est décalée vers le pignon sans porte (pignon B).",
      },
      {
        subtitle: "Dimensions hors-tout",
        table: {
          headers: ["Dimension", "Valeur"],
          rows: [
            ["Longueur hors-tout (pièces d'angle)", "3 882 mm"],
            ["Hauteur hors-tout (pieds inclus)", "2 290 mm"],
          ],
        },
      },
    ],
  },
  {
    id: "volet",
    icon: PanelTop,
    title: "Double volet — Auvent & Terrasse",
    description: "Mécanisme d'ouverture double : volet haut (auvent) et volet bas (terrasse rabattable)",
    content: [
      {
        subtitle: "Volet haut — Auvent",
        table: {
          headers: ["Spécification", "Détail"],
          rows: [
            ["Mécanisme", "Vérins à gaz (d'origine, conservés)"],
            ["Ouverture", "Vers le haut, maintenu par vérins (~30°)"],
            ["Dimensions", "2 910 × 1 026 mm"],
            ["Fonction", "Protection intempéries au-dessus de la terrasse"],
            ["Finition extérieure", "Bardage bois"],
          ],
        },
      },
      {
        subtitle: "Volet bas — Terrasse rabattable (à créer)",
        table: {
          headers: ["Spécification", "Détail"],
          rows: [
            ["Mécanisme", "Charnière piano (bord inférieur) + pieds dépliables"],
            ["Dimensions déployé", "~2 910 mm (largeur) × ~962 mm (profondeur)"],
            ["Surface", "~2,8 m²"],
            ["Charge admissible", "Minimum 200 kg/m²"],
            ["Pieds", "4 pieds tubulaires acier galvanisé Ø40-50 mm"],
            ["Hauteur des pieds", "~100 mm (alignement châssis)"],
            ["Réglage", "Embout fileté ±30 mm"],
            ["Sécurité", "2 câbles inox Ø4 mm (retenue latérale)"],
            ["Face extérieure", "Bardage bois"],
            ["Face intérieure (surface de marche)", "Caillebotis antidérapant"],
          ],
        },
      },
    ],
  },
  {
    id: "electrical",
    icon: Zap,
    title: "Électricité — Installation triphasée",
    description: "Alimentation 400V triphasée, TGBT, circuits et protections",
    content: [
      {
        subtitle: "Machine Optima Steamer XE-18K",
        table: {
          headers: ["Caractéristique", "Valeur"],
          rows: [
            ["Puissance", "18,2 kW"],
            ["Alimentation", "Triphasé 208-600V"],
            ["Débit vapeur", "300–900 cc/min"],
            ["Pression vapeur", "8,5 bar (max 9,5 bar)"],
            ["Température vapeur", "135°C"],
            ["Température chaudière", "174°C"],
            ["Réservoir intégré", "72 litres"],
            ["Dimensions", "66 × 100 × H89 cm"],
            ["Poids", "~82 kg"],
            ["Préchauffage", "6-7 min"],
          ],
        },
      },
      {
        subtitle: "Circuits électriques",
        table: {
          headers: ["Circuit", "Protection", "Type", "Usage"],
          rows: [
            ["C1 — Machine vapeur", "Disj. C32A triphasé", "CEE 32A / 5 broches", "Optima XE-18K (18,2 kW)"],
            ["C2 — Réserve triphasé", "Disj. C20A triphasé", "CEE 16A / 5 broches", "Machine complémentaire future"],
            ["C3 — Prises 230V", "Disj. C16A", "3× prises IP55", "Aspirateur, polisseuse, outils"],
            ["C4 — Éclairage", "Disj. C10A", "Direct", "2× projecteurs LED 30W IP65 + bandeau intérieur"],
            ["C5 — Digital", "Disj. C10A", "2× prises IP44", "Routeur 4G, tablette, TPE"],
          ],
        },
      },
      {
        subtitle: "Câble d'alimentation",
        table: {
          headers: ["Élément", "Spécification"],
          rows: [
            ["Type câble", "U1000R2V 5G6 mm² (3P+N+T)"],
            ["Protection amont", "Disjoncteur dédié sur TGBT du golf"],
            ["Mise à la terre", "Piquet de terre + liaison équipotentielle"],
            ["Entrée container", "Presse-étoupe IP68"],
          ],
        },
      },
      {
        note: "Consuel obligatoire : attestation de conformité NF C 15-100 requise si raccordé au réseau du golf.",
      },
    ],
  },
  {
    id: "water",
    icon: Droplets,
    title: "Eau & Recyclage — Circuit fermé",
    description: "Réservoir 50L, filtration 3 étages, circuit de recyclage en boucle fermée",
    content: [
      {
        subtitle: "Principe du circuit fermé",
        text: "Réseau golf → Réservoir 50L → Filtre + Adoucisseur → Steamer → Vapeur sur véhicule → Condensation → Tapis de récupération → Pompe → Filtration 3 étages → Retour réservoir. Le réseau golf ne compense que les pertes par évaporation.",
      },
      {
        subtitle: "Consommation d'eau",
        table: {
          headers: ["Type de lavage", "Consommation", "Avec recyclage"],
          rows: [
            ["Lavage extérieur simple", "4-5 litres", "~1 litre"],
            ["Extérieur + intérieur", "6-8 litres", "~1-2 litres"],
            ["Detailing complet", "8-10 litres", "~2 litres"],
            ["Station classique haute pression", "150-300 litres", "—"],
          ],
        },
        note: "Économie de 95% d'eau par rapport à un lavage haute pression classique.",
      },
      {
        subtitle: "Filtration recyclage — 3 étages",
        table: {
          headers: ["Étage", "Type", "Microns", "Fonction", "Coût"],
          rows: [
            ["1 — Pré-filtre", "Filtre tamis lavable", "100µm", "Sable, terre, débris grossiers", "~25€"],
            ["2 — Sédiments fins", "Cartouche bobinée", "25µm", "Particules fines, boues", "~15€"],
            ["3 — Charbon actif", "Cartouche charbon", "10µm + adsorption", "Produits chimiques, couleur, odeur", "~25€"],
          ],
        },
      },
      {
        subtitle: "Tapis de récupération",
        table: {
          headers: ["Produit", "Dimensions", "Type boudins", "Prix TTC"],
          rows: [
            ["Addict Auto 6×3,1m", "6 000 × 3 100 mm", "Mousse 7 cm (pas de gonflage)", "~900€"],
            ["Addict Auto 6,5×3,8m", "6 500 × 3 800 mm", "Mousse 7 cm", "~1 100€"],
            ["Chemical Guys Heavy Duty", "~4 900 × 2 700 mm", "Gonflable 10 cm", "~600€"],
          ],
        },
      },
      {
        subtitle: "Réservoir tampon 50L",
        table: {
          headers: ["Élément", "Spécification"],
          rows: [
            ["Capacité", "50 litres"],
            ["Matériau", "PEHD alimentaire"],
            ["Remplissage", "Auto par flotteur (réseau + retour recyclé)"],
            ["Dimensions", "~40 × 40 × H40 cm"],
            ["Indicateur de niveau", "Voyant extérieur"],
          ],
        },
        note: "Adoucisseur obligatoire avant la machine : le calcaire est l'ennemi n°1 des chaudières vapeur.",
      },
    ],
  },
  {
    id: "equipment",
    icon: Wrench,
    title: "Équipements & Budget",
    description: "Liste complète des équipements avec budget estimatif",
    content: [
      {
        subtitle: "Budget principal",
        table: {
          headers: ["Catégorie", "Estimation HT"],
          rows: [
            ["Optima Steamer XE-18K", "8 000 – 12 000€"],
            ["Outillage lavage (aspirateur, polisseuse...)", "~487€"],
            ["Réservoir 50L + pré-filtres", "~250€"],
            ["Tapis de récupération (Addict Auto 6×3,1m)", "~750€"],
            ["Kit filtration recyclage (3 étages)", "~155€"],
            ["Pompe vide-cave 250W inox", "~109€"],
            ["Anti-vol machine (platine + chaîne + cadenas)", "~170€"],
            ["Tableau électrique + câblage triphasé", "800 – 1 200€"],
            ["Compteurs (MID triphasé + eau DN15)", "~200€"],
            ["Aménagement intérieur (caillebotis, étagères, éclairage)", "~500€"],
            ["Bardage bois + ossature + peinture", "~260€"],
            ["Sécurité (caméra, serrures, extincteur)", "~152€"],
            ["Digital (routeur, tablette, TPE)", "~257€"],
            ["Consommables initiaux", "~152€"],
          ],
        },
      },
      {
        subtitle: "Coûts complémentaires (à chiffrer)",
        text: "Achat container • Transformation volet bas → terrasse (découpe, charnière, pieds, câbles) • Main d'œuvre bardage • Raccordement triphasé depuis TGBT golf • Raccordement eau depuis réseau golf • Transport / livraison",
      },
    ],
  },
  {
    id: "layout",
    icon: LayoutDashboard,
    title: "Aménagement intérieur",
    description: "Plan d'implantation des équipements par zone",
    content: [
      {
        subtitle: "Convention",
        text: "Pignon A = côté porte (1 750 mm de porte sur 2 135 mm de mur). Pignon B = mur plein (sans porte, toute la surface disponible). L'ouverture sur la face longue est décalée : 850 mm de mur plein côté pignon A, ~42 mm de poteau structurel côté pignon B.",
      },
      {
        subtitle: "Répartition par zone",
        table: {
          headers: ["Zone", "Équipements", "Raison"],
          rows: [
            ["Mur du fond", "Réservoir 50L, Steamer (ancré), étagères inox", "Éléments lourds/fixes, éloignés de l'ouverture"],
            ["Pignon B (mur plein)", "TGBT, routeur 4G, filtration recyclage, pompe, aspirateur, polisseuse, crochets", "Seul mur entièrement disponible (2 135 mm)"],
            ["Pignon A (porte)", "Porte, extincteur ABC 6kg", "Obligation réglementaire près de la sortie"],
            ["Montant 812 mm (entre ouverture et porte)", "Tablette + TPE, enrouleur tuyau 15m", "Zone accessible depuis la terrasse (accueil client)"],
            ["Extérieur pignon B", "Compteurs eau + électricité", "Relevé sans ouvrir le container"],
            ["Extérieur pignon A", "Boîte à clés sécurisée", "Accès clés sans ouvrir"],
            ["Extérieur linteau ouverture", "Caméra IP WiFi", "Vue dégagée sur zone de lavage + parking"],
          ],
        },
      },
      {
        subtitle: "Éclairage",
        table: {
          headers: ["Équipement", "Spécification", "Quantité"],
          rows: [
            ["Bandeau LED intérieur", "IP65, 36W, 120 cm, blanc neutre 4000K", "1"],
            ["Projecteur LED extérieur", "30W IP65, orientable, sous auvent", "2"],
          ],
        },
      },
    ],
  },
  {
    id: "regulations",
    icon: Scale,
    title: "Réglementation",
    description: "PLU, Loi Littoral, Déclaration Préalable, Consuel, ICPE",
    content: [
      {
        subtitle: "Contexte réglementaire",
        table: {
          headers: ["Élément", "Détail"],
          rows: [
            ["Golf", "Golf de Dinard"],
            ["Commune", "Saint-Briac-sur-Mer (35800)"],
            ["Zone applicable", "Commune littorale → Loi Littoral"],
            ["PLU", "Plan Local d'Urbanisme de Saint-Briac"],
          ],
        },
      },
      {
        subtitle: "Régime — Container temporaire mobile",
        text: "Article R421-5 : structure < 20 m² (container = 8,4 m²), sans fondation, durée < 3 mois consécutifs → AUCUNE autorisation requise. En zone protégée (ABF, site classé) : exemption réduite à 15 jours. Recommandation : déposer une Déclaration Préalable (DP) dans tous les cas pour sécuriser l'exploitation.",
      },
      {
        subtitle: "Contraintes Loi Littoral",
        table: {
          headers: ["Contrainte", "Impact"],
          rows: [
            ["Bande des 100 m", "Construction interdite. Vérifier que le parking N'EST PAS dans cette zone"],
            ["Espaces remarquables", "Dunes, landes, zones humides = interdiction stricte"],
            ["Extension d'urbanisation", "Doit être en continuité du bâti existant"],
            ["Zonage PLU", "Si zone N (naturelle) ou A (agricole) = restrictions possibles"],
          ],
        },
      },
      {
        subtitle: "Processus recommandé",
        table: {
          headers: ["Étape", "Action"],
          rows: [
            ["1 — Vérifier le PLU", "Consulter le zonage du parking sur geoportail-urbanisme.gouv.fr"],
            ["2 — Contacter l'urbanisme", "Service urbanisme de Saint-Briac → question sur installation temporaire"],
            ["3 — Déposer la DP", "Cerfa 13703 + plan de situation + plan de masse + photos"],
            ["4 — Consuel", "Attestation conformité électrique NF C 15-100"],
          ],
        },
      },
      {
        subtitle: "Autres obligations",
        table: {
          headers: ["Sujet", "Obligation"],
          rows: [
            ["Eaux usées", "Pas de rejet direct → récupération obligatoire (circuit fermé)"],
            ["Électricité", "Conforme NF C 15-100, installée par électricien qualifié"],
            ["ICPE", "Rubrique 2563 (nettoyage vapeur) — en dessous du seuil de déclaration"],
            ["Assurance", "RC Professionnelle obligatoire"],
            ["Convention golf", "Accord d'occupation définissant durée, loyer, facturation fluides"],
          ],
        },
      },
    ],
  },
  {
    id: "environment",
    icon: Leaf,
    title: "Impact environnemental",
    description: "Économie d'eau, zéro rejet, bilan carbone",
    content: [
      {
        subtitle: "Comparaison consommation d'eau",
        table: {
          headers: ["Méthode", "Eau / véhicule", "Économie"],
          rows: [
            ["Station haute pression classique", "150-300 litres", "—"],
            ["Lavage vapeur (sans recyclage)", "4-8 litres", "95%"],
            ["Lavage vapeur (avec recyclage)", "1-2 litres", "99%"],
          ],
        },
      },
      {
        subtitle: "Avantages vapeur vs haute pression",
        table: {
          headers: ["Avantage", "Détail"],
          rows: [
            ["Ultra-économe en eau", "4-8L vs 150-300L → 95% d'économie"],
            ["Zéro rejet chimique", "Vapeur seule à 135°C — dégraisse sans produit"],
            ["Zéro micro-rayure", "Pas de pression agressive → véhicules premium"],
            ["Polyvalence", "Extérieur, intérieur, moteur, jantes, cuir — une seule machine"],
            ["Désinfection naturelle", "135°C élimine bactéries et acariens (intérieur, climatisation)"],
            ["Image environnementale", "Rejet quasi nul → idéal pour les golfs"],
          ],
        },
      },
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Sécurité",
    description: "Anti-vol, incendie, surveillance, EPI",
    content: [
      {
        subtitle: "Dispositifs de sécurité",
        table: {
          headers: ["Élément", "Spécification"],
          rows: [
            ["Anti-vol machine", "Platine d'ancrage au sol + chaîne acier Ø10 mm + cadenas haute sécurité"],
            ["Serrures container", "Serrures renforcées sur porte + cadenas sur volets"],
            ["Caméra IP", "WiFi, extérieure IP66, vision nocturne, sur linteau ouverture"],
            ["Extincteur", "ABC 6 kg, intérieur, près de la porte (pignon A)"],
            ["Boîte à clés", "Sécurisée, extérieur pignon A"],
            ["Éclairage extérieur", "2× projecteurs LED 30W IP65 (dissuasion + visibilité)"],
          ],
        },
      },
    ],
  },
  {
    id: "documents",
    icon: FileText,
    title: "Documents requis",
    description: "Documents administratifs et opérationnels nécessaires",
    content: [
      {
        subtitle: "Documents obligatoires",
        table: {
          headers: ["Document", "Producteur", "Destinataire"],
          rows: [
            ["Déclaration Préalable (DP)", "Opérateur ou golf", "Mairie de Saint-Briac"],
            ["Convention d'occupation", "Golf + opérateur", "Les deux parties"],
            ["Attestation Consuel", "Électricien qualifié", "Opérateur / golf"],
            ["RC Professionnelle", "Assureur de l'opérateur", "Clients + golf"],
            ["K-Bis ou URSSAF", "Auto-entrepreneur ou société", "Golf"],
            ["Fiche technique Optima Steamer", "Optima France", "Dossier technique"],
          ],
        },
      },
      {
        subtitle: "Documents recommandés",
        table: {
          headers: ["Document", "Contenu"],
          rows: [
            ["DUERP", "Évaluation des risques : vapeur, produits, électricité, manutention"],
            ["Fiches de Données de Sécurité (FDS)", "Pour chaque produit chimique utilisé"],
            ["Plan de situation", "Emplacement container, zone de lavage, raccordements"],
            ["Grille tarifaire", "Services et prix"],
            ["CGV", "Conditions générales, responsabilités, limites"],
            ["Carnet de maintenance", "Entretien steamer, changement filtres, relevés compteurs"],
          ],
        },
      },
    ],
  },
];
