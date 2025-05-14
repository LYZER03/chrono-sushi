# Tech Stack - Sushi Samurai Express

Ce document détaille la pile technologique utilisée pour le développement de l'application Sushi Samurai Express.

## 1. Frontend

| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 18.x | Bibliothèque JavaScript pour la construction d'interfaces utilisateur |
| TypeScript | 5.x | Superset de JavaScript offrant un typage statique |
| Vite | 4.x | Outil de build ultra-rapide pour les applications web modernes |
| React Router | 6.x | Bibliothèque de routage pour React |

## 2. UI/Design

| Technologie | Version | Description |
|-------------|---------|-------------|
| Tailwind CSS | 3.x | Framework CSS utilitaire pour la conception d'interfaces personnalisées |
| shadcn-ui | - | Système de composants basé sur Radix UI et Tailwind CSS |
| React Icons | - | Bibliothèque d'icônes populaires pour React |

## 3. Gestion d'État

| Technologie | Version | Description |
|-------------|---------|-------------|
| Zustand | 4.x | Bibliothèque légère de gestion d'état |
| React Query | 4.x | Bibliothèque pour la gestion des données du serveur |

## 4. Validation et Formulaires

| Technologie | Version | Description |
|-------------|---------|-------------|
| React Hook Form | 7.x | Bibliothèque pour la gestion des formulaires |
| Zod | 3.x | Bibliothèque de validation de schéma TypeScript-first |

## 5. Backend et Base de Données

| Technologie | Version | Description |
|-------------|---------|-------------|
| Supabase | - | Plateforme open-source alternative à Firebase |
| PostgreSQL | 14.x | Système de gestion de base de données relationnelle |

## 6. Authentification

| Technologie | Version | Description |
|-------------|---------|-------------|
| Supabase Auth | - | Service d'authentification intégré à Supabase |
| JWT | - | JSON Web Tokens pour la gestion des sessions |

## 7. Hébergement et Déploiement

| Option | Description |
|--------|-------------|
| Vercel | Plateforme de déploiement pour les applications React |
| Netlify | Alternative pour le déploiement d'applications statiques et serverless |
| Hébergement personnalisé | Possibilité de déployer sur un serveur dédié |

## 8. Outils de Développement

| Outil | Description |
|-------|-------------|
| ESLint | Linting pour JavaScript/TypeScript |
| Prettier | Formatage de code |
| Vitest | Framework de test unitaire compatible avec Vite |
| Git | Système de contrôle de version |

## 9. Extensions Futures Possibles

- **Paiement** : Stripe API pour le traitement des paiements en ligne
- **Notification** : Firebase Cloud Messaging ou service équivalent
- **Analytics** : Google Analytics, Plausible, ou Fathom
- **CI/CD** : GitHub Actions ou GitLab CI
- **PWA** : Transformation en Progressive Web App pour une expérience mobile améliorée

## 10. Exigences Système

- **Node.js** : v16.x ou supérieur
- **npm** : v7.x ou supérieur (ou yarn/pnpm)
- **Navigateurs supportés** : Chrome, Firefox, Safari, Edge (dernières versions)