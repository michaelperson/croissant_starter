/**
 * Configuration de la base de données
 * =====================================
 * Gère la connexion à MongoDB (local) ou Azure Cosmos DB (production).
 * La chaîne de connexion est récupérée depuis les variables d'environnement,
 * qui sont elles-mêmes alimentées par Azure Key Vault en production.
 *
 * Pipeline DevOps : La variable MONGODB_URI est définie dans un
 * Variable Group lié au Key Vault → jamais en clair dans le code !
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/coissant";

  try {
    await mongoose.connect(uri, {
      // Options recommandées pour Cosmos DB
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const dbName = mongoose.connection.db.databaseName;
    console.log(`✅ Base de données connectée : ${dbName}`);
  } catch (error) {
    console.error("❌ Échec de la connexion à la base de données :", error.message);
    // On quitte le processus : un serveur sans BDD n'est pas utilisable
    process.exit(1);
  }
};

module.exports = connectDB;
