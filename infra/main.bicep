// ============================================================================
//  COISSANT 2.0 — Infrastructure as Code (Azure Bicep)
//  Fichier : infra/main.bicep
//
//  Ce fichier déclare TOUTE l'infrastructure Azure du projet.
//  Concept : Infrastructure as Code — l'infra est versionnée comme du code.
//
//  Déploiement :
//    az deployment group create \
//      --resource-group rg-coissant-prod \
//      --template-file infra/main.bicep \
//      --parameters environment=prod
// ============================================================================

@description('Environnement cible : dev | staging | prod')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Région Azure pour les ressources')
param location string = resourceGroup().location

// ─── Nommage automatique ──────────────────────────────────────────────────
// Chaque ressource porte le nom de l'environnement pour éviter les conflits
var suffix      = environment
var appName     = 'coissant-api-${suffix}'
var staticName  = 'coissant-web-${suffix}'
var cosmosName  = 'coissant-cosmos-${suffix}'
var kvName      = 'kv-coissant-${suffix}'
var planName    = 'plan-coissant-${suffix}'

// ─── Tags communs ────────────────────────────────────────────────────────
// Les tags permettent d'organiser et de suivre les coûts dans Azure
var tags = {
  project:     'coissant-2.0'
  environment: environment
  managedBy:   'azure-devops'
  formation:   'azure-devops-training'
}

// ============================================================================
// Azure Cosmos DB (MongoDB API)
// Base de données pour les produits et commandes
// ============================================================================
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name:     cosmosName
  location: location
  tags:     tags
  kind:     'MongoDB'
  properties: {
    apiProperties: {
      serverVersion: '6.0'
    }
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName:     location
        failoverPriority: 0
        isZoneRedundant:  false
      }
    ]
  }
}

resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-04-15' = {
  parent: cosmosAccount
  name:   'coissant'
  properties: {
    resource: { id: 'coissant' }
  }
}

// ============================================================================
// Azure Key Vault
// Stockage sécurisé des secrets (connection strings, tokens)
// Concept : Security — les secrets ne sont JAMAIS dans le code
// ============================================================================
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name:     kvName
  location: location
  tags:     tags
  properties: {
    sku: {
      family: 'A'
      name:   'standard'
    }
    tenantId:               subscription().tenantId
    enableSoftDelete:       true
    softDeleteRetentionInDays: 7
    enableRbacAuthorization: true  // Utiliser RBAC plutôt que les access policies
  }
}

// Stocker la connection string Cosmos DB dans Key Vault
resource cosmosConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name:   'cosmosdb-connection-string'
  properties: {
    value: cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
  }
}

// ============================================================================
// Azure App Service Plan + App Service (Backend Node.js)
// ============================================================================
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name:     planName
  location: location
  tags:     tags
  sku: {
    // B1 pour dev/staging, P1V3 pour prod (meilleure performance)
    name:     environment == 'prod' ? 'P1v3' : 'B1'
    tier:     environment == 'prod' ? 'PremiumV3' : 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true  // Obligatoire pour Linux
  }
}

resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name:     appName
  location: location
  tags:     tags
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly:    true  // Forcer HTTPS
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name:  'NODE_ENV'
          value: environment == 'prod' ? 'production' : environment
        }
        {
          name:  'PORT'
          value: '8080'
        }
        {
          // Référence au secret Key Vault — la valeur n'est jamais exposée
          // Concept : Key Vault Reference
          name:  'MONGODB_URI'
          value: '@Microsoft.KeyVault(VaultName=${kvName};SecretName=cosmosdb-connection-string)'
        }
      ]
      healthCheckPath: '/api/health'  // App Service surveille cet endpoint
    }
  }
}

// Deployment slot pour Blue/Green (uniquement en production)
resource stagingSlot 'Microsoft.Web/sites/slots@2023-01-01' = if (environment == 'prod') {
  parent:   appService
  name:     'staging-slot'
  location: location
  tags:     tags
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
    }
  }
}

// ============================================================================
// Azure Static Web Apps (Frontend React)
// ============================================================================
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name:     staticName
  location: 'westeurope'  // Static Web Apps n'est pas dispo dans toutes les régions
  tags:     tags
  sku: {
    name: environment == 'prod' ? 'Standard' : 'Free'
    tier: environment == 'prod' ? 'Standard' : 'Free'
  }
  properties: {}
}

// ============================================================================
// Outputs — Valeurs exportées utilisées par les pipelines
// ============================================================================
output appServiceUrl    string = 'https://${appService.properties.defaultHostName}'
output staticWebAppUrl  string = 'https://${staticWebApp.properties.defaultHostname}'
output keyVaultName     string = keyVault.name
output cosmosAccountName string = cosmosAccount.name
