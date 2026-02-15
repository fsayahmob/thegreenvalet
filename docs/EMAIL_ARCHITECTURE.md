# Architecture Email & Notifications — The Green Valet

> Basée sur l'architecture éprouvée d'unload.store, adaptée aux besoins franchise.

---

## Stack

| Composant | Choix | Raison |
|-----------|-------|--------|
| **Email transactionnel** | Resend | API moderne, templates HTML, 3000 emails/mois gratuit |
| **Notifications in-app** | Firestore subcollection `users/{uid}/notifications` | Temps réel via onSnapshot |
| **Triggers** | Cloud Functions (Firestore onDocumentUpdated) | Découplé, fire-and-forget |
| **Templates** | HTML fichiers sur disque `/email-templates/fr/` | Cachés en mémoire, pas de DB |
| **Anti-spam** | Rate limiting Firestore + honeypot | Pattern unload éprouvé |

---

## Emails à envoyer

### Phase 1 (MVP — Sprint 4)

| Événement | Template | Destinataire | Déclencheur |
|-----------|----------|-------------|-------------|
| Formulaire contact (landing `/golf`) | `contact-form.html` | Admin (SUPPORT_EMAIL) | `submitContactForm` onCall |
| Formulaire contact (landing `/`) | `contact-client.html` | Admin | `submitContactForm` onCall |
| Candidature opérateur (`/rejoindre`) | `operator-application.html` | Admin | `submitOperatorApplication` onCall |
| Bienvenue partenaire | `welcome-partner.html` | Partenaire golf | `initializePartner` onCall |
| Bienvenue opérateur | `welcome-operator.html` | Opérateur | `initializeOperator` onCall |

### Phase 2 (Sprint 5+)

| Événement | Template | Destinataire | Déclencheur |
|-----------|----------|-------------|-------------|
| Document uploadé | `document-uploaded.html` | Admin | Firestore trigger `documents/{id}` |
| Document validé | `document-approved.html` | Partenaire/Opérateur | Firestore trigger |
| Document rejeté | `document-rejected.html` | Partenaire/Opérateur | Firestore trigger |
| Document expiré (bientôt) | `document-expiring.html` | Partenaire/Opérateur + Admin | Cloud Scheduler (cron daily) |
| Pipeline complété | `onboarding-complete.html` | Partenaire/Opérateur + Admin | Firestore trigger |
| Invitation membre équipe | `invitation.html` | Invité | `inviteMember` onCall |

### Phase 3 (après Dinard)

| Événement | Template | Destinataire |
|-----------|----------|-------------|
| Convention générée | `convention-ready.html` | Partenaire |
| Facture mensuelle | `monthly-invoice.html` | Partenaire |
| Rapport activité | `activity-report.html` | Admin |

---

## Cloud Functions à créer

### Fonctions publiques (pas d'auth requise)

```typescript
// Contact form — landing pages
submitContactForm: onCall({ invoker: 'public' })
  → Rate limit: 3/5min par IP
  → Honeypot: champ "website"
  → Envoie email à SUPPORT_EMAIL
  → Pas de stockage Firestore (RGPD)

// Candidature opérateur — page /rejoindre
submitOperatorApplication: onCall({ invoker: 'public' })
  → Rate limit: 2/10min par IP
  → Envoie email à SUPPORT_EMAIL
  → Stocke dans Firestore `applications/{id}` (pour suivi)
```

### Fonctions authentifiées

```typescript
// Initialisation après signup
initializeUser: onCall
  → Crée le doc users/{uid}
  → Envoie email bienvenue (fire-and-forget)
  → Crée notification in-app

// Gestion documents (triggers automatiques)
onDocumentUploaded: onDocumentCreated('documents/{docId}')
  → Notif in-app admin "Nouveau document à valider"
  → Email admin si préférence activée

onDocumentStatusChanged: onDocumentUpdated('documents/{docId}')
  → Si approved → email + notif partenaire/opérateur
  → Si rejected → email + notif avec motif
  → Si approved → check si pipeline step complété → avancer pipeline

// Invitations
inviteMember: onCall
  → Crée doc invites/{id}
  → Envoie email avec lien Firebase Auth
  → Expire après 7 jours

acceptInvite: onCall
  → Vérifie validité
  → Ajoute à l'équipe
  → Supprime invitation
```

### Cron (Cloud Scheduler)

```typescript
// Vérification quotidienne des documents expirants
checkExpiringDocuments: onSchedule('every day 08:00')
  → Query documents où expiresAt < now + 30 jours
  → Envoie rappel email + notif in-app
  → À 7 jours : rappel urgent
  → À expiration : marque EXPIRED + alerte admin
```

---

## Structure des fichiers

```
functions/
├── src/
│   ├── index.ts                          ← Export toutes les fonctions
│   ├── config.ts                         ← Variables d'environnement
│   ├── contact/
│   │   └── submit-contact-form.ts        ← Formulaire contact
│   ├── auth/
│   │   ├── initialize-user.ts            ← Signup
│   │   ├── invite-member.ts              ← Invitation
│   │   └── accept-invite.ts              ← Acceptation
│   ├── documents/
│   │   ├── on-document-uploaded.ts       ← Trigger création
│   │   ├── on-document-status-changed.ts ← Trigger mise à jour
│   │   └── check-expiring.ts             ← Cron quotidien
│   ├── utils/
│   │   ├── email.ts                      ← Service Resend (copié d'unload)
│   │   ├── notifications.ts              ← In-app notifs (copié d'unload)
│   │   └── rate-limiter.ts               ← Anti-spam (copié d'unload)
│   └── email-templates/
│       └── fr/
│           ├── contact-form.html
│           ├── contact-client.html
│           ├── operator-application.html
│           ├── welcome-partner.html
│           ├── welcome-operator.html
│           ├── document-uploaded.html
│           ├── document-approved.html
│           ├── document-rejected.html
│           ├── document-expiring.html
│           ├── onboarding-complete.html
│           └── invitation.html
├── package.json
└── tsconfig.json
```

---

## Configuration

### Secrets Firebase
```bash
firebase functions:secrets:set RESEND_API_KEY
```

### Variables d'environnement (`functions/.env`)
```
APP_URL=https://app.thegreenvalet.fr
WEBSITE_URL=https://thegreenvalet.fr
EMAIL_FROM=The Green Valet <noreply@thegreenvalet.fr>
SUPPORT_EMAIL=contact@thegreenvalet.fr
```

### Domaine Resend
Configurer le domaine `thegreenvalet.fr` dans Resend (DNS : SPF, DKIM, DMARC).

---

## Notifications In-App

### Structure Firestore
```typescript
// users/{userId}/notifications/{notificationId}
{
  type: 'document_uploaded' | 'document_approved' | 'document_rejected'
      | 'document_expiring' | 'pipeline_completed' | 'new_partner' | 'new_operator',
  entityType: 'partner' | 'operator' | 'site',
  entityId: string,
  title: string,        // "Nouveau document à valider"
  message: string,      // "Le golf de Dinard a uploadé son attestation Consuel"
  read: false,
  createdAt: Timestamp
}
```

### Pattern (copié d'unload)
- Fire-and-forget : ne jamais throw, log les erreurs
- L'UI écoute via `onSnapshot` (temps réel)
- Badge compteur dans la Topbar
- Mark as read au clic

---

## Mapping Unload → Green Valet

| Unload | Green Valet | Notes |
|--------|-------------|-------|
| `initializeUser` | `initializeUser` | Même pattern, rôles différents |
| `submitContactForm` | `submitContactForm` | Identique, 2 variantes (golf/client) |
| `inviteMember` | `inviteMember` | Pour ajouter des admins/associés |
| `onJobCompleted` | `onDocumentStatusChanged` | Trigger Firestore, même logique |
| `onJobFailed` | (pas d'équivalent direct) | Documents rejetés = closest |
| `sendWelcomeEmail` | `sendWelcomeEmail` | 2 variantes (partenaire/opérateur) |
| `sendJobCompletedEmail` | `sendDocumentApprovedEmail` | Même pattern |
| Email templates HTML | Email templates HTML | Même syntaxe `{{variable}}` |
| Rate limiter | Rate limiter | Copier tel quel |
| Notification utils | Notification utils | Copier tel quel |

### Fichiers à copier directement d'unload (avec adaptation mineure)
1. `utils/email.ts` → Changer APP_NAME, URLs
2. `utils/notifications.ts` → Tel quel
3. `utils/rate-limiter.ts` → Tel quel (si existant, sinon implémenter)
4. Templates HTML → Adapter contenu et branding
