# Configuration des Variable Groups — Coissant 2.0

## Concept Azure DevOps : Variable Groups & Azure Key Vault

Un **Variable Group** est un ensemble de variables réutilisables entre pipelines.
En production, il peut être lié directement à un **Azure Key Vault** pour que
les secrets ne soient jamais exposés dans les logs ou le code.

---

## Variable Group : `coissant-staging`

À créer dans **Azure DevOps > Pipelines > Library > + Variable group**

| Variable                               | Valeur                                          | Secret ? |
|----------------------------------------|-------------------------------------------------|----------|
| `VITE_API_URL_STAGING`                 | `https://coissant-api-staging.azurewebsites.net`| Non      |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING` | `<token depuis Azure Portal>`               | **Oui**  |
| `MONGODB_URI`                          | `<connection string Cosmos DB staging>`         | **Oui**  |
| `NODE_ENV`                             | `staging`                                       | Non      |

---

## Variable Group : `coissant-production`
⚡ **Ce groupe doit être lié à Azure Key Vault** (voir ci-dessous)

| Variable                               | Stocké dans Key Vault ? |
|----------------------------------------|-------------------------|
| `MONGODB_URI`                          | ✅ Oui — secret `cosmosdb-connection-string` |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` | ✅ Oui — secret `static-web-app-token-prod` |
| `VITE_API_URL_PROD`                    | Non — valeur directe |

### Lier Key Vault à un Variable Group

1. Azure DevOps > Pipelines > Library > Variable group `coissant-production`
2. Activer "Link secrets from an Azure key vault as variables"
3. Sélectionner l'abonnement Azure et le Key Vault `kv-coissant-prod`
4. Ajouter les secrets souhaités

---

## Service Connection

À créer dans **Azure DevOps > Project Settings > Service connections**

| Nom                        | Type                          | Usage               |
|----------------------------|-------------------------------|---------------------|
| `azure-service-connection` | Azure Resource Manager        | Déploiement App Service, Key Vault |
| `teams-webhook`            | Incoming Webhook              | Notifications Teams |
