// ─── Convention d'Occupation Temporaire ──────────────────
// Full French legal HTML with {{merge_field}} placeholders

export const CONVENTION_HTML = `
<div class="document" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #1a1a1a;">

  <div style="text-align: center; margin-bottom: 48px;">
    <h1 style="font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
      Convention d'Occupation Temporaire
    </h1>
    <p style="font-size: 13px; color: #666;">Ref. TGV-CONV-{{partner_siret}}</p>
  </div>

  <h2 style="font-size: 16px; font-weight: bold; margin-top: 32px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Entre les soussignés
  </h2>

  <p>
    <strong>The Green Valet SAS</strong>, société par actions simplifiée au capital de 10 000 euros,
    immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège social est situé
    au 15 rue de la Pompe, 75016 Paris, représentée par son Président,
  </p>
  <p style="text-align: right; font-style: italic;">Ci-après dénommée « <strong>TGV</strong> »,</p>

  <p>D'une part,</p>

  <p>Et</p>

  <p>
    <strong>{{partner_name}}</strong>, SIRET n° {{partner_siret}}, dont le siège est situé
    au {{partner_address}}, représenté(e) par <strong>{{contact_name}}</strong>
    ({{contact_email}}),
  </p>
  <p style="text-align: right; font-style: italic;">Ci-après dénommé(e) « <strong>le Partenaire</strong> »,</p>

  <p>D'autre part,</p>

  <p style="margin-top: 16px;">
    TGV et le Partenaire sont ci-après désignés ensemble les « <strong>Parties</strong> »
    et individuellement une « <strong>Partie</strong> ».
  </p>

  <!-- Article 1 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 1 — Objet
  </h2>
  <p>
    Le Partenaire met à disposition de TGV un espace d'environ <strong>{{site_surface}} m²</strong>
    situé à l'adresse suivante : <strong>{{site_address}}</strong>, pour l'installation et
    l'exploitation d'un container de lavage automobile écologique à la vapeur.
  </p>
  <p>
    L'espace est exclusivement destiné à l'activité de lavage vapeur de véhicules automobiles
    et ne pourra être utilisé à d'autres fins sans accord préalable écrit du Partenaire.
  </p>

  <!-- Article 2 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 2 — Durée
  </h2>
  <p>
    La présente convention est conclue pour une durée de <strong>{{duration_months}} mois</strong>,
    à compter du <strong>{{start_date}}</strong> jusqu'au <strong>{{end_date}}</strong>.
  </p>
  <p>
    Elle est renouvelable par tacite reconduction pour des périodes successives de même durée,
    sauf dénonciation par l'une des Parties par lettre recommandée avec accusé de réception
    adressée au moins trois (3) mois avant l'échéance en cours.
  </p>

  <!-- Article 3 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 3 — Redevance
  </h2>
  <p>
    En contrepartie de la mise à disposition de l'espace, TGV versera au Partenaire une redevance
    mensuelle de <strong>{{monthly_fee}} € HT</strong> (hors taxes), payable à terme échu
    le 5 de chaque mois par virement bancaire.
  </p>
  <p>
    La redevance sera révisable annuellement selon l'indice INSEE du coût de la construction,
    à la date anniversaire du contrat.
  </p>

  <!-- Article 4 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 4 — Obligations de TGV
  </h2>
  <ul style="padding-left: 24px;">
    <li>Installer et entretenir le container de lavage en bon état de fonctionnement.</li>
    <li>Respecter les normes environnementales applicables au lavage vapeur.</li>
    <li>Souscrire et maintenir une assurance responsabilité civile professionnelle couvrant son activité.</li>
    <li>Assurer la propreté de l'espace mis à disposition et de ses abords immédiats.</li>
    <li>Ne pas modifier les installations du Partenaire sans autorisation écrite préalable.</li>
    <li>Respecter les horaires d'exploitation convenus entre les Parties.</li>
  </ul>

  <!-- Article 5 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 5 — Obligations du Partenaire
  </h2>
  <ul style="padding-left: 24px;">
    <li>Garantir l'accès à l'espace convenu pendant toute la durée de la convention.</li>
    <li>Assurer la mise à disposition d'un raccordement électrique triphasé 400V et d'un point d'eau DN15.</li>
    <li>Autoriser l'accès des véhicules de livraison pour l'installation et la maintenance du container.</li>
    <li>Informer TGV de tout événement susceptible d'affecter l'utilisation de l'espace.</li>
    <li>Maintenir une assurance couvrant le site et ses installations.</li>
  </ul>

  <!-- Article 6 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 6 — Assurances
  </h2>
  <p>
    Chaque Partie s'engage à souscrire et maintenir en vigueur pendant toute la durée de la
    convention les assurances nécessaires à la couverture de sa responsabilité civile et professionnelle.
    Les attestations d'assurance seront échangées à la signature de la présente convention
    et renouvelées à chaque échéance annuelle.
  </p>

  <!-- Article 7 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 7 — Résiliation
  </h2>
  <p>
    En cas de manquement grave par l'une des Parties à l'une quelconque de ses obligations au
    titre de la présente convention, non réparé dans un délai de trente (30) jours suivant une
    mise en demeure par lettre recommandée avec accusé de réception, l'autre Partie pourra
    résilier la convention de plein droit.
  </p>
  <p>
    En cas de résiliation anticipée, TGV s'engage à retirer le container et à remettre
    l'espace en état dans un délai de trente (30) jours.
  </p>

  <!-- Article 8 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 8 — Litiges
  </h2>
  <p>
    La présente convention est soumise au droit français. En cas de litige relatif à son
    interprétation ou à son exécution, les Parties s'engagent à rechercher une solution amiable.
    À défaut d'accord dans un délai de trente (30) jours, le litige sera soumis au tribunal
    compétent du ressort du siège social de TGV.
  </p>

  <!-- Signatures -->
  <div style="margin-top: 64px; display: flex; gap: 48px;">
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">Pour TGV</p>
      <p style="font-size: 13px; color: #666;">Le Président</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">Pour le Partenaire</p>
      <p style="font-size: 13px; color: #666;">{{contact_name}}</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
  </div>

  <p style="margin-top: 48px; font-size: 12px; color: #999; text-align: center;">
    Fait en deux exemplaires originaux, à Paris, le {{start_date}}.
  </p>
</div>
`;

// ─── CGV Opérateur ──────────────────────────────────────

export const CGV_HTML = `
<div class="document" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #1a1a1a;">

  <div style="text-align: center; margin-bottom: 48px;">
    <h1 style="font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
      Conditions Générales de Vente
    </h1>
    <p style="font-size: 14px; color: #444; font-weight: 500;">Opérateur Laveur — The Green Valet</p>
    <p style="font-size: 13px; color: #666;">Ref. TGV-CGV-{{operator_siret}}</p>
  </div>

  <h2 style="font-size: 16px; font-weight: bold; margin-top: 32px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Entre les soussignés
  </h2>

  <p>
    <strong>The Green Valet SAS</strong>, société par actions simplifiée au capital de 10 000 euros,
    immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège social est situé
    au 15 rue de la Pompe, 75016 Paris, représentée par son Président,
  </p>
  <p style="text-align: right; font-style: italic;">Ci-après dénommée « <strong>TGV</strong> »,</p>

  <p>D'une part,</p>

  <p>Et</p>

  <p>
    <strong>{{operator_full_name}}</strong>, auto-entrepreneur immatriculé(e) sous le SIRET
    n° {{operator_siret}},
  </p>
  <p style="text-align: right; font-style: italic;">Ci-après dénommé(e) « <strong>l'Opérateur</strong> »,</p>

  <p>D'autre part.</p>

  <!-- Article 1 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 1 — Objet
  </h2>
  <p>
    Les présentes conditions générales ont pour objet de définir les modalités de collaboration
    entre TGV et l'Opérateur pour la réalisation de prestations de lavage automobile à la vapeur
    au sein des sites partenaires du réseau The Green Valet.
  </p>
  <p>
    L'Opérateur exerce son activité en qualité de travailleur indépendant (auto-entrepreneur)
    et n'est en aucun cas lié à TGV par un contrat de travail salarié.
  </p>

  <!-- Article 2 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 2 — Commission et rémunération
  </h2>
  <p>
    L'Opérateur percevra <strong>{{commission_rate}}%</strong> du chiffre d'affaires HT généré
    par ses prestations de lavage, calculé sur la base des paiements effectivement encaissés
    par TGV auprès des clients finaux.
  </p>
  <p>
    Le versement est effectué mensuellement, au plus tard le 10 du mois suivant,
    par virement bancaire sur le compte communiqué par l'Opérateur.
    Un relevé détaillé des prestations et du calcul de la commission est joint à chaque versement.
  </p>

  <!-- Article 3 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 3 — Date d'effet et durée
  </h2>
  <p>
    Les présentes CGV prennent effet à compter du <strong>{{effective_date}}</strong> et sont
    conclues pour une durée indéterminée.
  </p>
  <p>
    Chaque Partie peut y mettre fin par lettre recommandée avec accusé de réception,
    en respectant un préavis de un (1) mois.
  </p>

  <!-- Article 4 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 4 — Obligations de l'Opérateur
  </h2>
  <ul style="padding-left: 24px;">
    <li>Réaliser les prestations de lavage avec soin et professionnalisme, conformément aux procédures TGV.</li>
    <li>Respecter les horaires d'intervention convenus avec le site partenaire.</li>
    <li>Utiliser exclusivement le matériel et les produits fournis ou validés par TGV.</li>
    <li>Porter la tenue professionnelle TGV lors de chaque prestation.</li>
    <li>Maintenir le container et le matériel en bon état de propreté et de fonctionnement.</li>
    <li>Souscrire et maintenir une assurance responsabilité civile professionnelle (RC Pro).</li>
    <li>Signaler immédiatement toute anomalie, panne ou incident à TGV.</li>
    <li>Être à jour de ses obligations sociales et fiscales (URSSAF, impôts).</li>
  </ul>

  <!-- Article 5 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 5 — Matériel et équipement
  </h2>
  <p>
    TGV met à disposition de l'Opérateur le matériel nécessaire à l'exercice de son activité
    (nettoyeur vapeur, aspirateur, produits d'entretien, tenue professionnelle).
    Ce matériel reste la propriété exclusive de TGV.
  </p>
  <p>
    L'Opérateur s'engage à utiliser le matériel conformément à sa destination et aux
    instructions de TGV. En cas de dégradation résultant d'une utilisation non conforme,
    les frais de réparation ou de remplacement seront à la charge de l'Opérateur.
  </p>

  <!-- Article 6 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 6 — Résiliation
  </h2>
  <p>
    En cas de manquement grave de l'Opérateur à ses obligations (absence répétée non justifiée,
    non-respect des procédures, atteinte à l'image de TGV), TGV pourra résilier les présentes CGV
    de plein droit, après une mise en demeure restée sans effet pendant quinze (15) jours.
  </p>
  <p>
    En cas de résiliation, l'Opérateur restitue l'intégralité du matériel mis à disposition
    dans un délai de sept (7) jours.
  </p>

  <!-- Article 7 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 7 — Litiges
  </h2>
  <p>
    Les présentes CGV sont soumises au droit français. Tout litige sera d'abord soumis à une
    tentative de règlement amiable. À défaut d'accord dans un délai de trente (30) jours,
    le litige sera porté devant le tribunal compétent du ressort du siège social de TGV.
  </p>

  <!-- Signatures -->
  <div style="margin-top: 64px; display: flex; gap: 48px;">
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">Pour TGV</p>
      <p style="font-size: 13px; color: #666;">Le Président</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">L'Opérateur</p>
      <p style="font-size: 13px; color: #666;">{{operator_full_name}}</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
  </div>

  <p style="margin-top: 48px; font-size: 12px; color: #999; text-align: center;">
    Fait en deux exemplaires originaux, à Paris, le {{effective_date}}.
  </p>
</div>
`;
