// ─── Convention d'Occupation Temporaire ──────────────────
// Commission model: 10% CA HT + electricity/water reimbursement on meters

export const CONVENTION_HTML = `
<div class="document" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #1a1a1a;">

  <div style="text-align: center; margin-bottom: 48px;">
    <h1 style="font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
      Convention d'Occupation Temporaire
    </h1>
    <p style="font-size: 13px; color: #666;">Ref. TGV-CONV-{{partner_siret}}</p>
  </div>

  <h2 style="font-size: 16px; font-weight: bold; margin-top: 32px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Entre les soussign&eacute;s
  </h2>

  <p>
    <strong>The Green Valet SAS</strong>, soci&eacute;t&eacute; par actions simplifi&eacute;e au capital de 10&nbsp;000 euros,
    immatricul&eacute;e au RCS de Paris sous le num&eacute;ro 123&nbsp;456&nbsp;789, dont le si&egrave;ge social est situ&eacute;
    au 15 rue de la Pompe, 75016 Paris, repr&eacute;sent&eacute;e par son Pr&eacute;sident,
  </p>
  <p style="text-align: right; font-style: italic;">Ci-apr&egrave;s d&eacute;nomm&eacute;e &laquo;&nbsp;<strong>TGV</strong>&nbsp;&raquo;,</p>

  <p>D&rsquo;une part,</p>

  <p>Et</p>

  <p>
    <strong>{{partner_name}}</strong>, SIRET n&deg; {{partner_siret}}, dont le si&egrave;ge est situ&eacute;
    au {{partner_address}}, repr&eacute;sent&eacute;(e) par <strong>{{contact_name}}</strong>
    ({{contact_email}}), d&ucirc;ment habilit&eacute;(e) aux fins des pr&eacute;sentes,
  </p>
  <p style="text-align: right; font-style: italic;">Ci-apr&egrave;s d&eacute;nomm&eacute;(e) &laquo;&nbsp;<strong>le Partenaire</strong>&nbsp;&raquo;,</p>

  <p>D&rsquo;autre part,</p>

  <p style="margin-top: 16px;">
    TGV et le Partenaire sont ci-apr&egrave;s d&eacute;sign&eacute;s ensemble les &laquo;&nbsp;<strong>Parties</strong>&nbsp;&raquo;
    et individuellement une &laquo;&nbsp;<strong>Partie</strong>&nbsp;&raquo;.
  </p>

  <!-- Article 1 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 1 &mdash; Objet
  </h2>
  <p>
    Le Partenaire met &agrave; disposition de TGV un espace d&rsquo;environ <strong>{{site_surface}} m&sup2;</strong>
    situ&eacute; &agrave; l&rsquo;adresse suivante : <strong>{{site_address}}</strong>, pour l&rsquo;installation et
    l&rsquo;exploitation d&rsquo;un container de lavage automobile &eacute;cologique &agrave; la vapeur
    (ci-apr&egrave;s le &laquo;&nbsp;Container&nbsp;&raquo;).
  </p>
  <p>
    L&rsquo;espace est exclusivement destin&eacute; &agrave; l&rsquo;activit&eacute; de lavage vapeur de v&eacute;hicules automobiles
    et ne pourra &ecirc;tre utilis&eacute; &agrave; d&rsquo;autres fins sans accord pr&eacute;alable &eacute;crit du Partenaire.
  </p>

  <!-- Article 2 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 2 &mdash; Dur&eacute;e
  </h2>
  <p>
    La pr&eacute;sente convention est conclue pour une dur&eacute;e de <strong>{{duration_months}} mois</strong>,
    &agrave; compter du <strong>{{start_date}}</strong> jusqu&rsquo;au <strong>{{end_date}}</strong>.
  </p>
  <p>
    Elle est renouvelable par tacite reconduction pour des p&eacute;riodes successives de m&ecirc;me dur&eacute;e,
    sauf d&eacute;nonciation par l&rsquo;une des Parties par lettre recommand&eacute;e avec accus&eacute; de r&eacute;ception
    adress&eacute;e au moins trois (3) mois avant l&rsquo;&eacute;ch&eacute;ance en cours.
  </p>

  <!-- Article 3 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 3 &mdash; Commission
  </h2>
  <p>
    En contrepartie de la mise &agrave; disposition de l&rsquo;espace, TGV versera au Partenaire une commission
    &eacute;gale &agrave; <strong>{{commission_rate}}&nbsp;% du chiffre d&rsquo;affaires hors taxes (CA&nbsp;HT)</strong>
    g&eacute;n&eacute;r&eacute; par l&rsquo;activit&eacute; de lavage sur le site du Partenaire.
  </p>
  <p>
    Le versement est effectu&eacute; mensuellement, au plus tard le dix (10) du mois suivant le mois
    de r&eacute;f&eacute;rence, par virement bancaire sur le compte communiqu&eacute; par le Partenaire.
    Un relev&eacute; d&eacute;taill&eacute; des prestations r&eacute;alis&eacute;es et du calcul de la commission est joint
    &agrave; chaque versement.
  </p>
  <p>
    Le CA HT est calcul&eacute; sur la base des paiements effectivement encaiss&eacute;s par TGV aupr&egrave;s des
    clients finaux au cours du mois de r&eacute;f&eacute;rence. En cas de contestation, le Partenaire dispose
    d&rsquo;un d&eacute;lai de quinze (15) jours &agrave; compter de la r&eacute;ception du relev&eacute; pour formuler ses
    observations par &eacute;crit.
  </p>

  <!-- Article 4 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 4 &mdash; Charges (&eacute;lectricit&eacute; et eau)
  </h2>
  <p>
    <strong>4.1 Compteurs d&eacute;di&eacute;s.</strong> TGV installera &agrave; ses frais des compteurs d&eacute;di&eacute;s
    (un compteur &eacute;lectrique et un compteur d&rsquo;eau) permettant de mesurer avec pr&eacute;cision les
    consommations li&eacute;es &agrave; l&rsquo;activit&eacute; de lavage. Les compteurs resteront la propri&eacute;t&eacute; de TGV.
  </p>
  <p>
    <strong>4.2 &Eacute;lectricit&eacute;.</strong> TGV remboursera au Partenaire la consommation &eacute;lectrique
    sur la base d&rsquo;un prix unitaire de <strong>{{prix_kwh}}&nbsp;&euro;/kWh</strong>, multipli&eacute; par le
    relev&eacute; du compteur d&eacute;di&eacute; au cours du mois de r&eacute;f&eacute;rence.
  </p>
  <p>
    <strong>4.3 Eau.</strong> TGV remboursera au Partenaire la consommation d&rsquo;eau sur la base d&rsquo;un
    prix unitaire de <strong>{{prix_m3}}&nbsp;&euro;/m&sup3;</strong>, multipli&eacute; par le relev&eacute; du compteur
    d&eacute;di&eacute; au cours du mois de r&eacute;f&eacute;rence.
  </p>
  <p>
    <strong>4.4 Relev&eacute;s contradictoires.</strong> Les relev&eacute;s des compteurs sont effectu&eacute;s
    conjointement par un repr&eacute;sentant de chaque Partie le dernier jour ouvr&eacute; de chaque mois.
    En cas d&rsquo;absence d&rsquo;une Partie d&ucirc;ment convoqu&eacute;e, le relev&eacute; effectu&eacute; par l&rsquo;autre Partie
    sera r&eacute;put&eacute; contradictoire.
  </p>
  <p>
    <strong>4.5 Facturation.</strong> Le remboursement des charges est joint au relev&eacute; de commission
    mensuel pr&eacute;vu &agrave; l&rsquo;article&nbsp;3. La commission et les charges sont compens&eacute;es et donnent lieu
    &agrave; un r&egrave;glement net unique.
  </p>
  <p>
    <strong>4.6 R&eacute;vision annuelle.</strong> Les prix unitaires (kWh et m&sup3;) sont r&eacute;visables &agrave;
    chaque date anniversaire de la convention, sur la base des indices suivants :
  </p>
  <ul style="padding-left: 24px;">
    <li>&Eacute;lectricit&eacute; : tarifs r&eacute;glement&eacute;s de vente (TRV) publi&eacute;s par la Commission de R&eacute;gulation de l&rsquo;&Eacute;nergie (CRE).</li>
    <li>Eau : indice des prix &agrave; la consommation (IPC) &mdash; poste &laquo;&nbsp;eau et assainissement&nbsp;&raquo; publi&eacute; par l&rsquo;INSEE.</li>
  </ul>
  <p>
    La r&eacute;vision est appliqu&eacute;e de plein droit. Chaque Partie peut demander la communication
    des indices de r&eacute;f&eacute;rence et du calcul de la r&eacute;vision.
  </p>

  <!-- Article 5 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 5 &mdash; Obligations de TGV
  </h2>
  <ul style="padding-left: 24px;">
    <li>Installer et entretenir le Container en bon &eacute;tat de fonctionnement, &agrave; ses frais exclusifs.</li>
    <li>Installer les compteurs d&eacute;di&eacute;s (&eacute;lectricit&eacute; et eau) avant le d&eacute;but d&rsquo;exploitation.</li>
    <li>Respecter les normes environnementales applicables au lavage vapeur (consommation inf&eacute;rieure &agrave; 5 litres d&rsquo;eau par v&eacute;hicule, absence de rejet chimique).</li>
    <li>Souscrire et maintenir une assurance responsabilit&eacute; civile professionnelle couvrant son activit&eacute;, le Container et les op&eacute;rateurs intervenant sur le site.</li>
    <li>Assurer la propret&eacute; de l&rsquo;espace mis &agrave; disposition et de ses abords imm&eacute;diats.</li>
    <li>Ne pas modifier les installations du Partenaire sans autorisation &eacute;crite pr&eacute;alable.</li>
    <li>Respecter les horaires d&rsquo;exploitation convenus entre les Parties.</li>
    <li>Fournir un relev&eacute; mensuel d&eacute;taill&eacute; de l&rsquo;activit&eacute; au Partenaire.</li>
  </ul>

  <!-- Article 6 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 6 &mdash; Obligations du Partenaire
  </h2>
  <ul style="padding-left: 24px;">
    <li>Garantir l&rsquo;acc&egrave;s &agrave; l&rsquo;espace convenu pendant toute la dur&eacute;e de la convention.</li>
    <li>Assurer la mise &agrave; disposition d&rsquo;un raccordement &eacute;lectrique triphas&eacute; 400V (32A minimum) et d&rsquo;un point d&rsquo;eau DN15 (pression 2 &agrave; 4 bars).</li>
    <li>Autoriser l&rsquo;acc&egrave;s des v&eacute;hicules de livraison pour l&rsquo;installation et la maintenance du Container.</li>
    <li>Informer TGV sans d&eacute;lai de tout &eacute;v&eacute;nement susceptible d&rsquo;affecter l&rsquo;utilisation de l&rsquo;espace (travaux, inondation, coupure &eacute;lectrique, etc.).</li>
    <li>Maintenir une assurance responsabilit&eacute; civile d&rsquo;exploitation couvrant le site et ses installations.</li>
    <li>Permettre l&rsquo;acc&egrave;s aux compteurs d&eacute;di&eacute;s pour les relev&eacute;s mensuels contradictoires.</li>
  </ul>

  <!-- Article 7 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 7 &mdash; &Eacute;ligibilit&eacute; technique
  </h2>
  <p>
    Le Partenaire d&eacute;clare que le site situ&eacute; au {{site_address}} dispose des &eacute;quipements et
    caract&eacute;ristiques techniques suivants :
  </p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
    <thead>
      <tr style="background: #f9f9f9;">
        <th style="text-align: left; padding: 8px 12px; border: 1px solid #e5e5e5;">Crit&egrave;re</th>
        <th style="text-align: center; padding: 8px 12px; border: 1px solid #e5e5e5; width: 100px;">Conforme</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Alimentation &eacute;lectrique triphas&eacute;e 400V (32A)</td><td style="text-align: center; padding: 8px 12px; border: 1px solid #e5e5e5;">&square;</td></tr>
      <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Point d&rsquo;eau DN15 (2-4 bars)</td><td style="text-align: center; padding: 8px 12px; border: 1px solid #e5e5e5;">&square;</td></tr>
      <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Surface disponible &ge; 30 m&sup2;</td><td style="text-align: center; padding: 8px 12px; border: 1px solid #e5e5e5;">&square;</td></tr>
      <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Acc&egrave;s camion livraison</td><td style="text-align: center; padding: 8px 12px; border: 1px solid #e5e5e5;">&square;</td></tr>
      <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Zone PLU constructible</td><td style="text-align: center; padding: 8px 12px; border: 1px solid #e5e5e5;">&square;</td></tr>
      <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Hors bande des 100 m du littoral</td><td style="text-align: center; padding: 8px 12px; border: 1px solid #e5e5e5;">&square;</td></tr>
    </tbody>
  </table>
  <p style="margin-top: 12px; font-size: 13px; color: #666;">
    Le Partenaire atteste de l&rsquo;exactitude des informations ci-dessus et s&rsquo;engage &agrave; informer TGV
    de toute modification ult&eacute;rieure.
  </p>

  <!-- Article 8 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 8 &mdash; Assurances
  </h2>
  <p>
    Chaque Partie s&rsquo;engage &agrave; souscrire et maintenir en vigueur pendant toute la dur&eacute;e de la
    convention les assurances n&eacute;cessaires &agrave; la couverture de sa responsabilit&eacute; civile et professionnelle,
    incluant notamment :
  </p>
  <ul style="padding-left: 24px;">
    <li><strong>TGV</strong> : assurance RC Professionnelle couvrant l&rsquo;activit&eacute; de lavage, le Container, et les op&eacute;rateurs intervenant sur le site du Partenaire.</li>
    <li><strong>Le Partenaire</strong> : assurance RC Exploitation couvrant le site, les installations et les dommages caus&eacute;s aux tiers dans l&rsquo;enceinte du golf.</li>
  </ul>
  <p>
    Les attestations d&rsquo;assurance seront &eacute;chang&eacute;es &agrave; la signature de la pr&eacute;sente convention
    et renouvel&eacute;es &agrave; chaque &eacute;ch&eacute;ance annuelle. Le d&eacute;faut de production d&rsquo;une attestation
    &agrave; jour constitue un manquement au sens de l&rsquo;article&nbsp;9.
  </p>

  <!-- Article 9 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 9 &mdash; R&eacute;siliation
  </h2>
  <p>
    En cas de manquement grave par l&rsquo;une des Parties &agrave; l&rsquo;une quelconque de ses obligations au
    titre de la pr&eacute;sente convention, non r&eacute;par&eacute; dans un d&eacute;lai de trente (30) jours suivant une
    mise en demeure par lettre recommand&eacute;e avec accus&eacute; de r&eacute;ception, l&rsquo;autre Partie pourra
    r&eacute;silier la convention de plein droit, sans pr&eacute;judice de tous dommages et int&eacute;r&ecirc;ts.
  </p>
  <p>
    En cas de r&eacute;siliation anticip&eacute;e, TGV s&rsquo;engage &agrave; retirer le Container et &agrave; remettre
    l&rsquo;espace en &eacute;tat dans un d&eacute;lai de trente (30) jours. Les commissions dues jusqu&rsquo;&agrave; la
    date effective de r&eacute;siliation restent exigibles.
  </p>

  <!-- Article 10 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 10 &mdash; Confidentialit&eacute;
  </h2>
  <p>
    Chaque Partie s&rsquo;engage &agrave; traiter comme strictement confidentielles toutes les informations
    commerciales, financi&egrave;res et techniques &eacute;chang&eacute;es dans le cadre de la pr&eacute;sente convention.
    Cette obligation de confidentialit&eacute; subsiste pendant une dur&eacute;e de deux (2) ans apr&egrave;s
    l&rsquo;expiration ou la r&eacute;siliation de la convention.
  </p>

  <!-- Article 11 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 11 &mdash; Litiges
  </h2>
  <p>
    La pr&eacute;sente convention est soumise au droit fran&ccedil;ais. En cas de litige relatif &agrave; son
    interpr&eacute;tation ou &agrave; son ex&eacute;cution, les Parties s&rsquo;engagent &agrave; rechercher pr&eacute;alablement une
    solution amiable par voie de m&eacute;diation dans un d&eacute;lai de trente (30) jours.
    &Agrave; d&eacute;faut d&rsquo;accord, le litige sera soumis au tribunal comp&eacute;tent du ressort du si&egrave;ge
    social de TGV.
  </p>

  <!-- Signatures -->
  <div style="margin-top: 64px; display: flex; gap: 48px;">
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">Pour The Green Valet SAS</p>
      <p style="font-size: 13px; color: #666;">Le Pr&eacute;sident</p>
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
    Fait en deux exemplaires originaux, &agrave; Paris, le {{start_date}}.
  </p>
</div>
`;

// ─── CGV Op&eacute;rateur ──────────────────────────────────────

export const CGV_HTML = `
<div class="document" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #1a1a1a;">

  <div style="text-align: center; margin-bottom: 48px;">
    <h1 style="font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
      Conditions G&eacute;n&eacute;rales de Vente
    </h1>
    <p style="font-size: 14px; color: #444; font-weight: 500;">Op&eacute;rateur Laveur &mdash; The Green Valet</p>
    <p style="font-size: 13px; color: #666;">Ref. TGV-CGV-{{operator_siret}}</p>
  </div>

  <h2 style="font-size: 16px; font-weight: bold; margin-top: 32px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Entre les soussign&eacute;s
  </h2>

  <p>
    <strong>The Green Valet SAS</strong>, soci&eacute;t&eacute; par actions simplifi&eacute;e au capital de 10&nbsp;000 euros,
    immatricul&eacute;e au RCS de Paris sous le num&eacute;ro 123&nbsp;456&nbsp;789, dont le si&egrave;ge social est situ&eacute;
    au 15 rue de la Pompe, 75016 Paris, repr&eacute;sent&eacute;e par son Pr&eacute;sident,
  </p>
  <p style="text-align: right; font-style: italic;">Ci-apr&egrave;s d&eacute;nomm&eacute;e &laquo;&nbsp;<strong>TGV</strong>&nbsp;&raquo;,</p>

  <p>D&rsquo;une part,</p>

  <p>Et</p>

  <p>
    <strong>{{operator_full_name}}</strong>, auto-entrepreneur immatricul&eacute;(e) sous le SIRET
    n&deg; {{operator_siret}}, domicili&eacute;(e) au {{operator_address}},
  </p>
  <p style="text-align: right; font-style: italic;">Ci-apr&egrave;s d&eacute;nomm&eacute;(e) &laquo;&nbsp;<strong>l&rsquo;Op&eacute;rateur</strong>&nbsp;&raquo;,</p>

  <p>D&rsquo;autre part.</p>

  <!-- Article 1 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 1 &mdash; Objet
  </h2>
  <p>
    Les pr&eacute;sentes conditions g&eacute;n&eacute;rales ont pour objet de d&eacute;finir les modalit&eacute;s de collaboration
    entre TGV et l&rsquo;Op&eacute;rateur pour la r&eacute;alisation de prestations de lavage automobile &agrave; la vapeur
    au sein des sites partenaires du r&eacute;seau The Green Valet.
  </p>
  <p>
    L&rsquo;Op&eacute;rateur exerce son activit&eacute; en qualit&eacute; de travailleur ind&eacute;pendant (auto-entrepreneur)
    et n&rsquo;est en aucun cas li&eacute; &agrave; TGV par un contrat de travail salari&eacute;.
  </p>

  <!-- Article 2 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 2 &mdash; Commission et r&eacute;mun&eacute;ration
  </h2>
  <p>
    L&rsquo;Op&eacute;rateur percevra <strong>{{commission_rate}}%</strong> du chiffre d&rsquo;affaires HT g&eacute;n&eacute;r&eacute;
    par ses prestations de lavage, calcul&eacute; sur la base des paiements effectivement encaiss&eacute;s
    par TGV aupr&egrave;s des clients finaux.
  </p>
  <p>
    Le versement est effectu&eacute; mensuellement, au plus tard le 10 du mois suivant,
    par virement bancaire sur le compte communiqu&eacute; par l&rsquo;Op&eacute;rateur.
    Un relev&eacute; d&eacute;taill&eacute; des prestations et du calcul de la commission est joint &agrave; chaque versement.
  </p>

  <!-- Article 3 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 3 &mdash; Date d&rsquo;effet et dur&eacute;e
  </h2>
  <p>
    Les pr&eacute;sentes CGV prennent effet &agrave; compter du <strong>{{effective_date}}</strong> et sont
    conclues pour une dur&eacute;e ind&eacute;termin&eacute;e.
  </p>
  <p>
    Chaque Partie peut y mettre fin par lettre recommand&eacute;e avec accus&eacute; de r&eacute;ception,
    en respectant un pr&eacute;avis de un (1) mois.
  </p>

  <!-- Article 4 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 4 &mdash; Obligations de l&rsquo;Op&eacute;rateur
  </h2>
  <ul style="padding-left: 24px;">
    <li>R&eacute;aliser les prestations de lavage avec soin et professionnalisme, conform&eacute;ment aux proc&eacute;dures TGV.</li>
    <li>Respecter les horaires d&rsquo;intervention convenus avec le site partenaire.</li>
    <li>Utiliser exclusivement le mat&eacute;riel et les produits fournis ou valid&eacute;s par TGV.</li>
    <li>Porter la tenue professionnelle TGV lors de chaque prestation.</li>
    <li>Maintenir le container et le mat&eacute;riel en bon &eacute;tat de propret&eacute; et de fonctionnement.</li>
    <li>Souscrire et maintenir une assurance responsabilit&eacute; civile professionnelle (RC Pro).</li>
    <li>Signaler imm&eacute;diatement toute anomalie, panne ou incident &agrave; TGV.</li>
    <li>&Ecirc;tre &agrave; jour de ses obligations sociales et fiscales (URSSAF, imp&ocirc;ts).</li>
  </ul>

  <!-- Article 5 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 5 &mdash; Mat&eacute;riel et &eacute;quipement
  </h2>
  <p>
    TGV met &agrave; disposition de l&rsquo;Op&eacute;rateur le mat&eacute;riel n&eacute;cessaire &agrave; l&rsquo;exercice de son activit&eacute;
    (nettoyeur vapeur, aspirateur, produits d&rsquo;entretien, tenue professionnelle).
    Ce mat&eacute;riel reste la propri&eacute;t&eacute; exclusive de TGV.
  </p>
  <p>
    L&rsquo;Op&eacute;rateur s&rsquo;engage &agrave; utiliser le mat&eacute;riel conform&eacute;ment &agrave; sa destination et aux
    instructions de TGV. En cas de d&eacute;gradation r&eacute;sultant d&rsquo;une utilisation non conforme,
    les frais de r&eacute;paration ou de remplacement seront &agrave; la charge de l&rsquo;Op&eacute;rateur.
  </p>

  <!-- Article 6 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 6 &mdash; R&eacute;siliation
  </h2>
  <p>
    En cas de manquement grave de l&rsquo;Op&eacute;rateur &agrave; ses obligations (absence r&eacute;p&eacute;t&eacute;e non justifi&eacute;e,
    non-respect des proc&eacute;dures, atteinte &agrave; l&rsquo;image de TGV), TGV pourra r&eacute;silier les pr&eacute;sentes CGV
    de plein droit, apr&egrave;s une mise en demeure rest&eacute;e sans effet pendant quinze (15) jours.
  </p>
  <p>
    En cas de r&eacute;siliation, l&rsquo;Op&eacute;rateur restitue l&rsquo;int&eacute;gralit&eacute; du mat&eacute;riel mis &agrave; disposition
    dans un d&eacute;lai de sept (7) jours.
  </p>

  <!-- Article 7 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 7 &mdash; Litiges
  </h2>
  <p>
    Les pr&eacute;sentes CGV sont soumises au droit fran&ccedil;ais. Tout litige sera d&rsquo;abord soumis &agrave; une
    tentative de r&egrave;glement amiable. &Agrave; d&eacute;faut d&rsquo;accord dans un d&eacute;lai de trente (30) jours,
    le litige sera port&eacute; devant le tribunal comp&eacute;tent du ressort du si&egrave;ge social de TGV.
  </p>

  <!-- Signatures -->
  <div style="margin-top: 64px; display: flex; gap: 48px;">
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">Pour The Green Valet SAS</p>
      <p style="font-size: 13px; color: #666;">Le Pr&eacute;sident</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">L&rsquo;Op&eacute;rateur</p>
      <p style="font-size: 13px; color: #666;">{{operator_full_name}}</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
  </div>

  <p style="margin-top: 48px; font-size: 12px; color: #999; text-align: center;">
    Fait en deux exemplaires originaux, &agrave; Paris, le {{effective_date}}.
  </p>
</div>
`;

// ─── D&eacute;charge Responsabilit&eacute; Automobile ──────────────────

export const DECHARGE_AUTO_HTML = `
<div class="document" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #1a1a1a;">

  <div style="text-align: center; margin-bottom: 48px;">
    <h1 style="font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
      D&eacute;charge de Responsabilit&eacute; &mdash; Dommages Automobiles
    </h1>
    <p style="font-size: 14px; color: #444; font-weight: 500;">Op&eacute;rateur Laveur &mdash; The Green Valet</p>
    <p style="font-size: 13px; color: #666;">Ref. TGV-DRA-{{operator_siret}}</p>
  </div>

  <h2 style="font-size: 16px; font-weight: bold; margin-top: 32px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Entre les soussign&eacute;s
  </h2>

  <p>
    <strong>The Green Valet SAS</strong>, soci&eacute;t&eacute; par actions simplifi&eacute;e, immatricul&eacute;e au RCS de Paris
    sous le num&eacute;ro 123&nbsp;456&nbsp;789, dont le si&egrave;ge social est situ&eacute; au 15 rue de la Pompe,
    75016 Paris, repr&eacute;sent&eacute;e par son Pr&eacute;sident,
  </p>
  <p style="text-align: right; font-style: italic;">Ci-apr&egrave;s d&eacute;nomm&eacute;e &laquo;&nbsp;<strong>TGV</strong>&nbsp;&raquo;,</p>

  <p>D&rsquo;une part,</p>

  <p>Et</p>

  <p>
    <strong>{{operator_full_name}}</strong>, auto-entrepreneur immatricul&eacute;(e) sous le SIRET
    n&deg; {{operator_siret}}, domicili&eacute;(e) au {{operator_address}},
  </p>
  <p style="text-align: right; font-style: italic;">Ci-apr&egrave;s d&eacute;nomm&eacute;(e) &laquo;&nbsp;<strong>l&rsquo;Op&eacute;rateur</strong>&nbsp;&raquo;,</p>

  <p>D&rsquo;autre part.</p>

  <!-- Article 1 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 1 &mdash; Objet
  </h2>
  <p>
    La pr&eacute;sente d&eacute;charge a pour objet de d&eacute;finir les conditions de responsabilit&eacute; relatives
    aux dommages susceptibles d&rsquo;&ecirc;tre caus&eacute;s aux v&eacute;hicules automobiles confi&eacute;s &agrave; l&rsquo;Op&eacute;rateur
    dans le cadre de ses prestations de lavage &agrave; la vapeur pour le compte de TGV.
  </p>

  <!-- Article 2 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 2 &mdash; &Eacute;tat pr&eacute;alable du v&eacute;hicule
  </h2>
  <p>
    Avant toute intervention, l&rsquo;Op&eacute;rateur proc&egrave;de &agrave; un constat visuel de l&rsquo;&eacute;tat ext&eacute;rieur du
    v&eacute;hicule, incluant la carrosserie, les vitres, les r&eacute;troviseurs et les jantes. L&rsquo;Op&eacute;rateur
    note et, dans la mesure du possible, photographie tout dommage pr&eacute;existant (rayures, impacts,
    bosses) avant le d&eacute;but de la prestation.
  </p>
  <p>
    Ce constat est r&eacute;alis&eacute; en pr&eacute;sence du client lorsque celui-ci est disponible. En cas
    d&rsquo;absence du client, le constat photographique fait foi.
  </p>

  <!-- Article 3 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 3 &mdash; Limites de responsabilit&eacute;
  </h2>
  <p>L&rsquo;Op&eacute;rateur et TGV ne sauraient &ecirc;tre tenus responsables des dommages suivants :</p>
  <ul style="padding-left: 24px;">
    <li>Dommages pr&eacute;existants constat&eacute;s lors de l&rsquo;&eacute;tat des lieux pr&eacute;alable.</li>
    <li>Usure normale du v&eacute;hicule (micro-rayures, ternissement de peinture, oxidation).</li>
    <li>D&eacute;t&eacute;riorations r&eacute;sultant de la fragilit&eacute; ou du mauvais &eacute;tat d&rsquo;un &eacute;l&eacute;ment du v&eacute;hicule (joint d&eacute;t&eacute;rior&eacute;, film solaire d&eacute;grad&eacute;, pi&egrave;ces non conformes).</li>
    <li>Dommages caus&eacute;s par des tiers ou des &eacute;v&eacute;nements de force majeure.</li>
  </ul>
  <p>
    Tout dommage caus&eacute; par une n&eacute;gligence av&eacute;r&eacute;e de l&rsquo;Op&eacute;rateur dans l&rsquo;ex&eacute;cution de la prestation
    sera couvert par l&rsquo;assurance RC Professionnelle de l&rsquo;Op&eacute;rateur ou, &agrave; d&eacute;faut, par celle de TGV.
  </p>

  <!-- Article 4 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 4 &mdash; Assurances
  </h2>
  <p>
    L&rsquo;Op&eacute;rateur s&rsquo;engage &agrave; souscrire et maintenir en vigueur une assurance responsabilit&eacute; civile
    professionnelle (RC Pro) couvrant son activit&eacute; de lavage, incluant les dommages mat&eacute;riels
    caus&eacute;s aux v&eacute;hicules des clients.
  </p>
  <p>
    TGV souscrit &eacute;galement une assurance RC Professionnelle couvrant l&rsquo;ensemble des prestations
    r&eacute;alis&eacute;es sous sa marque, en compl&eacute;ment de l&rsquo;assurance de l&rsquo;Op&eacute;rateur.
  </p>

  <!-- Article 5 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 5 &mdash; Acceptation
  </h2>
  <p>
    L&rsquo;Op&eacute;rateur d&eacute;clare avoir pris connaissance des termes de la pr&eacute;sente d&eacute;charge et les accepter
    sans r&eacute;serve. Il s&rsquo;engage &agrave; appliquer syst&eacute;matiquement le protocole de constat pr&eacute;alable
    d&eacute;crit &agrave; l&rsquo;article&nbsp;2 avant chaque prestation.
  </p>

  <!-- Signatures -->
  <div style="margin-top: 64px; display: flex; gap: 48px;">
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">Pour The Green Valet SAS</p>
      <p style="font-size: 13px; color: #666;">Le Pr&eacute;sident</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">L&rsquo;Op&eacute;rateur</p>
      <p style="font-size: 13px; color: #666;">{{operator_full_name}}</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
  </div>

  <p style="margin-top: 48px; font-size: 12px; color: #999; text-align: center;">
    Fait en deux exemplaires originaux, &agrave; Paris, le {{effective_date}}.
  </p>
</div>
`;

// ─── Charte Qualit&eacute; Op&eacute;rateur ──────────────────────────

export const CHARTE_QUALITE_HTML = `
<div class="document" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #1a1a1a;">

  <div style="text-align: center; margin-bottom: 48px;">
    <h1 style="font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
      Charte Qualit&eacute; Op&eacute;rateur
    </h1>
    <p style="font-size: 14px; color: #444; font-weight: 500;">R&egrave;gles de conduite professionnelle &mdash; The Green Valet</p>
    <p style="font-size: 13px; color: #666;">Ref. TGV-CQ-{{operator_siret}}</p>
  </div>

  <p>
    La pr&eacute;sente charte d&eacute;finit les r&egrave;gles de conduite professionnelle applicables &agrave; tout
    op&eacute;rateur laveur intervenant pour le compte de <strong>The Green Valet SAS</strong>
    (ci-apr&egrave;s &laquo;&nbsp;TGV&nbsp;&raquo;).
  </p>
  <p>
    <strong>{{operator_full_name}}</strong>, SIRET n&deg; {{operator_siret}}, domicili&eacute;(e) au
    {{operator_address}}, ci-apr&egrave;s &laquo;&nbsp;l&rsquo;Op&eacute;rateur&nbsp;&raquo;,
    s&rsquo;engage &agrave; respecter l&rsquo;ensemble des dispositions ci-dessous.
  </p>

  <!-- Article 1 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 1 &mdash; Pr&eacute;sentation et tenue
  </h2>
  <ul style="padding-left: 24px;">
    <li>Porter syst&eacute;matiquement la tenue professionnelle TGV (polo, pantalon, chaussures de s&eacute;curit&eacute;) en bon &eacute;tat et propre.</li>
    <li>Arborer le badge nominatif TGV visible en permanence durant les heures de service.</li>
    <li>Maintenir le v&eacute;hicule de service (le cas &eacute;ch&eacute;ant) propre et en bon &eacute;tat.</li>
    <li>Adopter une pr&eacute;sentation soign&eacute;e (hygi&egrave;ne, coiffure, propret&eacute; g&eacute;n&eacute;rale).</li>
  </ul>

  <!-- Article 2 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 2 &mdash; Ponctualit&eacute; et communication
  </h2>
  <ul style="padding-left: 24px;">
    <li>Respecter imp&eacute;rativement les horaires d&rsquo;intervention convenus avec le site partenaire.</li>
    <li>Pr&eacute;venir TGV et le site partenaire au minimum 2 heures &agrave; l&rsquo;avance en cas de retard ou d&rsquo;absence.</li>
    <li>R&eacute;pondre aux communications de TGV (t&eacute;l&eacute;phone, e-mail, application) dans un d&eacute;lai raisonnable (4 heures ouvr&eacute;es).</li>
    <li>Compl&eacute;ter le rapport d&rsquo;activit&eacute; journalier dans l&rsquo;application TGV avant 20h chaque jour d&rsquo;intervention.</li>
  </ul>

  <!-- Article 3 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 3 &mdash; Qualit&eacute; de prestation
  </h2>
  <ul style="padding-left: 24px;">
    <li>Appliquer strictement le protocole de lavage vapeur TGV (ordre des &eacute;tapes, temp&eacute;rature, pression, dur&eacute;e).</li>
    <li>Utiliser exclusivement les produits et &eacute;quipements fournis ou agr&eacute;&eacute;s par TGV.</li>
    <li>R&eacute;aliser le constat visuel pr&eacute;alable (article 2 de la D&eacute;charge) avant chaque prestation.</li>
    <li>Effectuer un contr&ocirc;le qualit&eacute; final avant la remise du v&eacute;hicule au client.</li>
    <li>Signaler imm&eacute;diatement toute panne, dysfonctionnement ou rupture de stock &agrave; TGV.</li>
  </ul>

  <!-- Article 4 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 4 &mdash; Respect du site partenaire
  </h2>
  <ul style="padding-left: 24px;">
    <li>Respecter les r&egrave;gles int&eacute;rieures du site partenaire (circulation, stationnement, zones interdites).</li>
    <li>Maintenir l&rsquo;espace de travail (container et abords) propre et rang&eacute; en permanence.</li>
    <li>Ne pas utiliser les &eacute;quipements ou installations du partenaire sans autorisation expresse.</li>
    <li>Adopter un comportement respectueux envers le personnel du site partenaire.</li>
  </ul>

  <!-- Article 5 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 5 &mdash; Relation client
  </h2>
  <ul style="padding-left: 24px;">
    <li>Accueillir chaque client avec courtoisie et professionnalisme.</li>
    <li>Informer le client du d&eacute;roulement de la prestation et du d&eacute;lai estim&eacute;.</li>
    <li>En cas de r&eacute;clamation, ne jamais entrer en confrontation : noter la r&eacute;clamation, rassurer le client, et transmettre imm&eacute;diatement &agrave; TGV.</li>
    <li>Ne jamais encaisser de paiement en esp&egrave;ces directement &mdash; tous les paiements transitent par la plateforme TGV.</li>
  </ul>

  <!-- Article 6 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 6 &mdash; Confidentialit&eacute;
  </h2>
  <p>
    L&rsquo;Op&eacute;rateur s&rsquo;engage &agrave; ne divulguer aucune information confidentielle relative &agrave; TGV, ses
    partenaires, ses clients ou ses proc&eacute;d&eacute;s techniques. Cette obligation de confidentialit&eacute;
    s&rsquo;applique pendant toute la dur&eacute;e de la collaboration et deux (2) ans apr&egrave;s sa cessation.
  </p>

  <!-- Article 7 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Article 7 &mdash; Sanctions
  </h2>
  <p>Tout manquement aux r&egrave;gles de la pr&eacute;sente charte pourra entra&icirc;ner :</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
    <thead>
      <tr style="background: #f9f9f9;">
        <th style="text-align: left; padding: 8px 12px; border: 1px solid #e5e5e5;">Niveau</th>
        <th style="text-align: left; padding: 8px 12px; border: 1px solid #e5e5e5;">Mesure</th>
        <th style="text-align: left; padding: 8px 12px; border: 1px solid #e5e5e5;">D&eacute;lai</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">1er manquement</td>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Avertissement &eacute;crit</td>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Imm&eacute;diat</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">2e manquement</td>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Suspension temporaire (7 jours)</td>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Sous 48h</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">3e manquement ou faute grave</td>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">R&eacute;siliation de plein droit</td>
        <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">Imm&eacute;diat</td>
      </tr>
    </tbody>
  </table>
  <p style="margin-top: 12px;">
    Constituent une faute grave : le vol, la violence (verbale ou physique), la consommation
    d&rsquo;alcool ou de stup&eacute;fiants pendant le service, la fraude, et toute atteinte grave &agrave; l&rsquo;image de TGV.
  </p>

  <!-- Signatures -->
  <div style="margin-top: 64px; display: flex; gap: 48px;">
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">Pour The Green Valet SAS</p>
      <p style="font-size: 13px; color: #666;">Le Pr&eacute;sident</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature</p>
      </div>
    </div>
    <div style="flex: 1;">
      <p style="font-weight: bold; margin-bottom: 8px;">L&rsquo;Op&eacute;rateur</p>
      <p style="font-size: 13px; color: #666;">{{operator_full_name}}</p>
      <div style="margin-top: 48px; border-top: 1px solid #ccc; padding-top: 8px;">
        <p style="font-size: 12px; color: #999;">Signature &laquo;&nbsp;Lu et approuv&eacute;&nbsp;&raquo;</p>
      </div>
    </div>
  </div>

  <p style="margin-top: 48px; font-size: 12px; color: #999; text-align: center;">
    Fait en deux exemplaires originaux, &agrave; Paris, le {{effective_date}}.
  </p>
</div>
`;

// ─── Cahier des Charges Technique (Specs) ──────────────────

export const CAHIER_DES_CHARGES_HTML = `
<div class="document" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #1a1a1a;">

  <div style="text-align: center; margin-bottom: 48px;">
    <h1 style="font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
      Cahier des Charges Technique
    </h1>
    <p style="font-size: 14px; color: #444; font-weight: 500;">Container de Lavage Vapeur &mdash; The Green Valet</p>
    <p style="font-size: 13px; color: #666;">Ref. TGV-CDC-V1</p>
  </div>

  <!-- Section 1 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    1. Dimensions du Container
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
    <tbody>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5; width: 50%;"><strong>Type</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Container maritime 20 pieds am&eacute;nag&eacute;</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Longueur</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">6,06 m</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Largeur</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">2,44 m</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Hauteur</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">2,59 m</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Poids &agrave; vide</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">~ 2&nbsp;200 kg</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Poids en charge</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">~ 3&nbsp;500 kg (avec &eacute;quipement et r&eacute;serves)</td></tr>
    </tbody>
  </table>

  <!-- Section 2 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    2. Raccordements &eacute;lectriques
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
    <tbody>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5; width: 50%;"><strong>Alimentation</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Triphas&eacute; 400V</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Intensit&eacute;</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">32A minimum</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Puissance install&eacute;e</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">~ 18 kW</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Protection</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Disjoncteur diff&eacute;rentiel 30mA + compteur d&eacute;di&eacute;</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Conformit&eacute;</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Attestation Consuel obligatoire</td></tr>
    </tbody>
  </table>

  <!-- Section 3 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    3. Alimentation en eau
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
    <tbody>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5; width: 50%;"><strong>Raccordement</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">DN15 (1/2 pouce)</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Pression</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">2 &agrave; 4 bars</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Consommation / v&eacute;hicule</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">&lt; 5 litres (technologie vapeur)</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Compteur</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Compteur d&eacute;di&eacute; install&eacute; par TGV</td></tr>
    </tbody>
  </table>

  <!-- Section 4 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    4. &Eacute;vacuation et environnement
  </h2>
  <ul style="padding-left: 24px;">
    <li>Aucun rejet chimique : produits 100% biod&eacute;gradables certifi&eacute;s.</li>
    <li>&Eacute;vacuation par condensation de vapeur (pas de r&eacute;seau d&rsquo;&eacute;vacuation n&eacute;cessaire).</li>
    <li>Bac de r&eacute;tention int&eacute;gr&eacute; au container pour les eaux r&eacute;siduelles.</li>
    <li>Nuisances sonores : &lt; 65 dB &agrave; 1 m&egrave;tre (norme NFS 31-010).</li>
  </ul>

  <!-- Section 5 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    5. &Eacute;quipement inclus
  </h2>
  <ul style="padding-left: 24px;">
    <li>1 g&eacute;n&eacute;rateur vapeur professionnel (150&deg;C, 8 bars)</li>
    <li>1 aspirateur industriel eau et poussi&egrave;re</li>
    <li>1 nettoyeur haute pression (usage ponctuel)</li>
    <li>Kit de produits d&rsquo;entretien biod&eacute;gradables</li>
    <li>Rangement int&eacute;rieur (armoire, &eacute;tag&egrave;res, support tuyaux)</li>
    <li>&Eacute;clairage LED int&eacute;rieur et ext&eacute;rieur</li>
    <li>Signalétique ext&eacute;rieure The Green Valet</li>
  </ul>

  <!-- Section 6 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    6. Zone d&rsquo;implantation
  </h2>
  <ul style="padding-left: 24px;">
    <li>Surface minimale : <strong>30 m&sup2;</strong> (container + zone de man&oelig;uvre v&eacute;hicules).</li>
    <li>Sol plat, stabilis&eacute;, capable de supporter 3&nbsp;500 kg ponctuellement.</li>
    <li>Acc&egrave;s camion-grue pour la livraison initiale (gabarit : 12 m de long, 2,5 m de large, 4 m de haut).</li>
    <li>Distance maximale aux raccordements &eacute;lectriques et eau : 25 m&egrave;tres.</li>
    <li>Zone PLU constructible (ou d&eacute;claration pr&eacute;alable valid&eacute;e).</li>
    <li>Hors bande des 100 m&egrave;tres du littoral (loi Littoral).</li>
  </ul>

  <!-- Section 7 -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    7. Maintenance
  </h2>
  <ul style="padding-left: 24px;">
    <li>Maintenance pr&eacute;ventive : &agrave; la charge exclusive de TGV, fr&eacute;quence trimestrielle.</li>
    <li>Maintenance corrective : intervention sous 48h ouvr&eacute;es apr&egrave;s signalement.</li>
    <li>Remplacement du g&eacute;n&eacute;rateur vapeur : sous 5 jours ouvr&eacute;s en cas de panne majeure.</li>
    <li>Op&eacute;rateur : nettoyage quotidien du container et du mat&eacute;riel apr&egrave;s chaque journ&eacute;e de service.</li>
  </ul>

  <p style="margin-top: 48px; font-size: 12px; color: #999; text-align: center;">
    The Green Valet SAS &mdash; Document interne &mdash; Version 1.0
  </p>
</div>
`;

// ─── Fiche M&eacute;tier Laveur ──────────────────────────────────

export const FICHE_METIER_HTML = `
<div class="document" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; color: #1a1a1a;">

  <div style="text-align: center; margin-bottom: 48px;">
    <h1 style="font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
      Fiche M&eacute;tier &mdash; Op&eacute;rateur Laveur Vapeur
    </h1>
    <p style="font-size: 14px; color: #444; font-weight: 500;">The Green Valet</p>
    <p style="font-size: 13px; color: #666;">Ref. TGV-FM-V1</p>
  </div>

  <!-- Mission -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Mission principale
  </h2>
  <p>
    R&eacute;aliser des prestations de lavage automobile &eacute;cologique &agrave; la vapeur sur les sites
    partenaires (golfs) du r&eacute;seau The Green Valet, en respectant les standards de qualit&eacute;
    et les protocoles d&eacute;finis par l&rsquo;entreprise.
  </p>

  <!-- Comp&eacute;tences -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Comp&eacute;tences requises
  </h2>
  <ul style="padding-left: 24px;">
    <li><strong>Permis B</strong> valide (d&eacute;placements entre sites).</li>
    <li>Sens du d&eacute;tail et souci de la qualit&eacute;.</li>
    <li>Autonomie et sens de l&rsquo;organisation (gestion de planning, stock de produits).</li>
    <li>Aisance relationnelle (contact avec la client&egrave;le golf, haut de gamme).</li>
    <li>Bonne condition physique (station debout prolong&eacute;e, manipulation d&rsquo;&eacute;quipement).</li>
    <li>Connaissance de base en m&eacute;canique automobile (identifier les &eacute;l&eacute;ments sensibles d&rsquo;un v&eacute;hicule).</li>
  </ul>

  <!-- Formation -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Formation initiale
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
    <tbody>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5; width: 40%;"><strong>Dur&eacute;e</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">2 jours (14 heures)</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Lieu</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Site pilote TGV ou site partenaire</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Contenu</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Protocole vapeur, &eacute;quipement, s&eacute;curit&eacute;, relation client, application TGV</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>&Eacute;valuation</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Test pratique + QCM th&eacute;orique (note min. 80%)</td></tr>
      <tr><td style="padding: 6px 12px; border: 1px solid #e5e5e5;"><strong>Attestation</strong></td><td style="padding: 6px 12px; border: 1px solid #e5e5e5;">Certificat de formation TGV d&eacute;livr&eacute; &agrave; l&rsquo;issue</td></tr>
    </tbody>
  </table>

  <!-- &Eacute;quipement -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    &Eacute;quipement fourni
  </h2>
  <ul style="padding-left: 24px;">
    <li>2 polos TGV + 1 veste</li>
    <li>1 pantalon de travail</li>
    <li>1 paire de chaussures de s&eacute;curit&eacute;</li>
    <li>1 badge nominatif</li>
    <li>Acc&egrave;s &agrave; l&rsquo;application TGV (planning, rapport, facturation)</li>
    <li>Kit de d&eacute;marrage (microfibre, raclettes, sprays, gants)</li>
  </ul>

  <!-- R&eacute;mun&eacute;ration -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    R&eacute;mun&eacute;ration indicative
  </h2>
  <ul style="padding-left: 24px;">
    <li><strong>Mod&egrave;le</strong> : commission sur CA g&eacute;n&eacute;r&eacute; (auto-entrepreneur).</li>
    <li><strong>Fourchette</strong> : 1&nbsp;500 &agrave; 3&nbsp;000 &euro; net/mois selon le volume de prestations et le site.</li>
    <li><strong>Versement</strong> : mensuel, le 10 du mois suivant.</li>
  </ul>

  <!-- Statut -->
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px;">
    Statut juridique
  </h2>
  <p>
    L&rsquo;op&eacute;rateur exerce sous le statut d&rsquo;<strong>auto-entrepreneur</strong> (micro-entreprise).
    Il est responsable de ses d&eacute;clarations URSSAF, de sa comptabilit&eacute; et de sa protection sociale.
    TGV fournit un accompagnement administratif pour la cr&eacute;ation d&rsquo;entreprise si n&eacute;cessaire.
  </p>

  <p style="margin-top: 48px; font-size: 12px; color: #999; text-align: center;">
    The Green Valet SAS &mdash; Document interne &mdash; Version 1.0
  </p>
</div>
`;
