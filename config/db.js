require('dotenv').config();
const mysql = require('mysql2');

// --- SECTION DÉBOGAGE (À conserver pour ton rapport INF222) ---
console.log("------------------------------------------");
console.log("🔍 VÉRIFICATION DES PARAMÈTRES .ENV :");
console.log("Hôte :", process.env.DB_HOST);
console.log("Utilisateur :", process.env.DB_USER);
console.log("Base de données :", process.env.DB_NAME);
// On affiche juste si le mot de passe existe (pour la sécurité)
console.log("Mot de passe présent :", process.env.DB_PASS ? "OUI" : "NON (ERREUR !)");
console.log("------------------------------------------");

// Création de la connexion
const connection = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'db_blog',
    port: 3306
});

// Tentative de connexion
connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL :', err.message);
        console.log("👉 Conseil : Vérifie que ton fichier .env contient bien DB_PASS=NLOUBOU19");
        return;
    }
    console.log('✅ Connecté à la base de données MySQL !');
});

module.exports = connection;
