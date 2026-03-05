# 🥐 Coissant 2.0 — Projet de Formation Azure DevOps

> Application de commande en ligne pour **CroissantExpress**, chaîne internationale de boulangeries.
> Ce projet est conçu pour illustrer les concepts Azure DevOps de manière concrète et ludique.

---

## Table des matières

1. [Présentation du projet](#présentation)
2. [Architecture](#architecture)
3. [Démarrage rapide](#démarrage-rapide)
4. [Structure du projet](#structure)
5. [Concepts Azure DevOps illustrés](#concepts)
6. [Exercices pratiques](#exercices)
7. [Dépannage](#dépannage)

---

## Présentation

**CroissantExpress** veut moderniser son application de commande en ligne.
Ce projet vous permettra de mettre en pratique **tous les concepts Azure DevOps**
à travers une application réelle avec un frontend, une API et une base de données.

| Composant | Technologie | Pourquoi ? |
|-----------|-------------|------------|
| Frontend  | React + Vite | Interface visuelle immédiate, JavaScript universel |
| Backend   | Node.js + Express | Même langage que le front, API REST lisible |
| Base de données | Azure Cosmos DB (MongoDB) | Service Azure natif, JSON natif |
| Hébergement Frontend | Azure Static Web Apps | Déploiement intégré Azure DevOps |
| Hébergement Backend  | Azure App Service | PaaS simple, déploiement slots |
| Secrets | Azure Key Vault | Sécurité des credentials |
| Infrastructure | Azure Bicep | Infrastructure as Code |

---

## Architecture

```
Internet
   │
   ├──► Azure Static Web Apps ──► Frontend React (port 80/443)
   │
   └──► Azure App Service ──────► Backend Node.js (port 8080)
              │
              └──► Azure Cosmos DB  ←── Données produits & commandes
                        │
              Azure Key Vault ←──────── Connection strings (secrets)
```

### Flux de données

```
[Utilisateur] → [React Frontend] → [Express API] → [Cosmos DB]
                      ↕                  ↕
              [Azure Static Web]  [Azure App Service]
```

---

## Démarrage rapide

### Prérequis

- Node.js 20+ installé ([nodejs.org](https://nodejs.org))
- Git installé
- Un compte Azure DevOps ([dev.azure.com](https://dev.azure.com))

### 1. Cloner le projet

```bash
git clone https://dev.azure.com/votre-org/coissant-2.0
cd coissant-2.0
```

### 2. Démarrer le backend

```bash
cd backend
cp .env.example .env      # Copier la configuration
npm install               # Installer les dépendances
npm run dev               # Démarrer en mode développement
```

Le backend démarre sur **http://localhost:3001**

Tester : http://localhost:3001/api/health → doit renvoyer `{ "status": "ok" }`

### 3. Démarrer le frontend

Dans un nouveau terminal :

```bash
cd frontend
cp src/.env.example .env  # Copier la configuration
npm install
npm run dev
```

L'application est disponible sur **http://localhost:5173**

### 4. Lancer les tests

```bash
# Tests backend
cd backend && npm test

# Tests frontend
cd frontend && npm test
```

---

## Structure du projet

```
coissant-2.0/
│
├── frontend/                    # Application React
│   ├── src/
│   │   ├── components/          # Composants réutilisables (Navbar, ProductCard...)
│   │   ├── pages/               # Pages (Menu, Panier, Confirmation, Suivi)
│   │   ├── hooks/               # Logique réutilisable (useCart)
│   │   └── utils/               # Utilitaires (api.js)
│   └── package.json
│
├── backend/                     # API Node.js
│   ├── routes/                  # Endpoints API (/products, /orders, /health)
│   ├── models/                  # Schémas de données (Product, Order)
│   └── server.js                # Point d'entrée
│
├── packages/                    # Packages partagés (Workspaces npm)
│   └── shared-models/           # Constants, modèles réutilisés par front et back (par ex: statuts, catégories)
│       ├── index.js
│       └── package.json
│
├── tests/                       # Tests automatisés
│   ├── api/                     # Tests de l'API (Jest + Supertest)
│   └── frontend/                # Tests des composants (Vitest)
│
├── azure-pipelines/             # Fichiers YAML des pipelines
│   ├── ci.yml                   # Intégration continue (toutes branches)
│   ├── cd-staging.yml           # Déploiement staging (branche develop)
│   └── cd-production.yml        # Déploiement production (avec approval)
│
├── infra/
│   └── main.bicep               # Infrastructure Azure as Code
│
└── README.md                    # Ce fichier
```

---

## Concepts Azure DevOps illustrés

### 1. Azure Repos — Gestion du code source

**Où le voir dans le projet :** Tout le projet est un repo Git Azure DevOps.

**Stratégie de branches recommandée :**

```
main        ← Production stable
develop     ← Intégration (déclenche déploiement staging)
feat/*      ← Nouvelles fonctionnalités
fix/*       ← Corrections de bugs
```

**Exercice :** Créer une branch `feat/nouveau-croissant-pistache`,
ajouter un produit dans `backend/routes/products.js`, puis ouvrir une Pull Request.

**Branch policies à configurer :**
- Minimum 1 reviewer avant le merge
- Build CI doit passer (lien vers `ci.yml`)
- Pas de push direct sur `main`

---

### 2. Azure Pipelines — CI/CD

**Fichiers :** `azure-pipelines/ci.yml`, `cd-staging.yml`, `cd-production.yml`

#### Pipeline CI (`ci.yml`)

Déclenché à chaque push, il exécute dans l'ordre :
1. **Lint** — Vérifie le style du code (ESLint)
2. **Tests** — Lance les tests Jest et Vitest
3. **Build** — Compile et archive l'application

```
Push → Lint → Tests → Build → Artefacts publiés
```

#### Pipelines CD

```
merge develop → cd-staging.yml  → Déploiement automatique staging
             ↓
approbation  → cd-production.yml → Blue/Green deploy en prod
```

**Points clés à expliquer en formation :**

- **YAML vs Classic** : On utilise YAML (recommandé) pour versionner les pipelines dans Git
- **Microsoft-hosted agents** : `ubuntu-latest` = VM gérée par Microsoft, zéro maintenance
- **Artefacts de pipeline** : Le build crée un `.zip` qui est utilisé par le déploiement
- **Multi-stage** : Les stages `Lint → Test → Build` permettent d'échouer tôt

---

### 3. Variables et Secrets

**Fichier :** `azure-pipelines/variable-groups-setup.md`

**Règle d'or :** Un secret ne doit JAMAIS apparaître dans le code ou les logs.

```
❌ Mauvais :  MONGODB_URI=mongodb://user:password@server/db  (dans le code)
✅ Correct :  MONGODB_URI=$(MONGODB_URI)  (injecté par le pipeline depuis Key Vault)
```

**Chaîne de sécurité :**
```
Azure Key Vault → Variable Group → Pipeline variable → App Service
```

---

### 4. Azure Boards — Gestion de projet

**User Stories suggérées pour le projet :**

**Sprint 1 — Menu**
- En tant que client, je veux voir la liste des produits disponibles
- En tant que client, je veux filtrer les produits par catégorie
- En tant que client, je veux voir si un produit contient des allergènes

**Sprint 2 — Panier & Commande**
- En tant que client, je veux ajouter des produits à mon panier
- En tant que client, je veux modifier les quantités dans mon panier
- En tant que client, je veux passer une commande avec mes coordonnées

**Sprint 3 — Suivi**
- En tant que client, je veux suivre l'état de ma commande en temps réel
- En tant que responsable, je veux recevoir une notification Teams à chaque déploiement

**Structure Boards recommandée :**

```
Backlog
  └── Sprint 1 (2 semaines)
        ├── [Story] Afficher les produits           → feature/menu-display
        ├── [Story] Filtres par catégorie            → feature/category-filter
        └── [Task]  Créer l'endpoint GET /products  → (lié à l'histoire)
```

---

### 5. Azure Artifacts — Gestion des packages

Pour ce projet, nous utilisons les workspaces npm pour la logique locale. Mais si le projet grandissait vers de multiples dépôts (app mobile, borne), vous pourriez héberger ces packages partagés :

```bash
# S'authentifier auprès d'Azure Artifacts
npm login --registry=https://pkgs.dev.azure.com/votre-org/coissant/_packaging/coissant-feed/npm/registry/

# Depuis un composant, ex: packages/shared-models
cd packages/shared-models
npm publish --registry https://pkgs.dev.azure.com/votre-org/coissant/_packaging/coissant-feed/npm/registry/
```

**Cas d'usage illustré :**
- Le package `@coissant/shared-models` est généré et packagé en `.tgz` par le pipeline CI.
- Azure DevOps peut stocker ce package dans un Feed Azure Artifacts (serveur resgitre npm interne sécurisé).
- Ce packaging réduit le code dupliqué et protège la propriété intellectuelle.

---

### 6. Blue/Green Deployment

**Fichier :** `azure-pipelines/cd-production.yml`

**Concept :**
```
AVANT le swap :
  Production (slot prod)    → Ancienne version (reçoit le trafic)
  Staging slot              → Nouvelle version (chauffée, testée)

APRÈS le swap (instantané) :
  Production (slot prod)    → Nouvelle version (reçoit le trafic)
  Staging slot              → Ancienne version (rollback possible en 1 clic)
```

**Analogie boulangerie :** On prépare la nouvelle fournée pendant que l'ancienne est en vente.
Quand la nouvelle est prête, on remplace — sans interruption de service.

---

### 7. Approval Gates

**Où le configurer :**
Azure DevOps > Environments > `coissant-production` > Approvals and checks > + Add check > Approvals

**Qui approuve :** Le "Responsable Boulangerie" (Tech Lead / Product Owner)

**Ce qu'il voit :**
- Le numéro du build
- La branche source
- Les résultats des tests
- Un lien vers les changements

---

## Exercices pratiques

### Exercice 1 — Casser le build intentionnellement

1. Sur une branch `fix/intentional-break`, introduire une erreur de syntaxe
2. Pousser la branch et observer le pipeline CI échouer
3. Corriger l'erreur, pousser à nouveau, observer le pipeline passer

**Objectif :** Comprendre que le CI protège `main` des erreurs

---

### Exercice 2 — Ajouter un nouveau produit

1. Créer la branch `feat/croissant-pistache`
2. Ajouter dans `backend/routes/products.js` :

```javascript
{ name: 'Croissant Pistache', category: 'viennoiserie',
  description: 'Feuilleté à la crème de pistache de Sicile.',
  price: 3.80, available: true, isNew: true, allergens: ['gluten', 'lactose', 'fruits_a_coque'] }
```

3. Ouvrir une Pull Request vers `develop`
4. Observer le pipeline CI tourner sur la PR
5. Faire approuver et merger
6. Observer le déploiement staging se déclencher automatiquement

---

### Exercice 3 — Configurer les notifications Teams

1. Dans Teams : créer un connecteur Incoming Webhook dans un canal dédié
2. Dans Azure DevOps > Project Settings > Service connections : créer `teams-webhook`
3. Observer les notifications après un déploiement staging réussi

---

### Exercice 4 — Explorer Azure Boards

1. Importer les User Stories suggérées
2. Créer un Sprint de 2 semaines
3. Lier une User Story à une Pull Request (via `#ID` dans le message de commit)
4. Observer la story passer automatiquement à "Resolved" quand la PR est mergée

---

## Dépannage

### Le backend ne démarre pas

```bash
# Vérifier que Node.js est installé
node --version  # Doit afficher v20.x

# Vérifier que .env existe
ls backend/.env  # Doit exister (copié depuis .env.example)
```

### L'API renvoie des erreurs 500

Vérifier les logs du backend :
```bash
cd backend && npm run dev
# Regarder la console pour les messages d'erreur
```

Sans base de données, l'API fonctionne en mode "données statiques" — c'est normal.

### Le pipeline CI échoue sur le Lint

```bash
# Lancer le lint localement pour voir les erreurs
cd backend && npm run lint
cd frontend && npm run lint
```

### Le déploiement Azure échoue

Vérifier :
1. La Service Connection est bien configurée (Project Settings > Service connections)
2. Le nom de l'App Service correspond à celui dans le pipeline YAML
3. Les Variable Groups sont bien liés au pipeline

---

## Ressources

- [Documentation Azure DevOps](https://docs.microsoft.com/azure/devops/)
- [Référence YAML Pipelines](https://docs.microsoft.com/azure/devops/pipelines/yaml-schema)
- [Azure Bicep Documentation](https://docs.microsoft.com/azure/azure-resource-manager/bicep/)
- [Azure Key Vault Best Practices](https://docs.microsoft.com/azure/key-vault/general/best-practices)

---

*Projet de formation — CroissantExpress © 2024 — Coissant 2.0*
