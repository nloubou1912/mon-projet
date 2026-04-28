require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const db = mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'nloubou_dev',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '19DEC', 
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'eco_collecte',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
});

db.connect(err => {
    if (err) {
        console.error('❌ Erreur MySQL:', err.message);
        return;
    }
    console.log('✅ Connecté à MySQL avec succès !');
});

app.post('/api/signalements', (req, res) => {
    const { quartier, type_dechet, niveau_urgence } = req.body;
    const sql = "INSERT INTO signalements (quartier, type_dechet, niveau_urgence) VALUES (?, ?, ?)";
    db.query(sql, [quartier, type_dechet, niveau_urgence], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Signalement enregistré !" });
    });
});

app.get('/api/signalements', (req, res) => {
    const sql = "SELECT * FROM signalements ORDER BY date_ajout DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/stats/moyenne-urgence', (req, res) => {
    const sql = "SELECT quartier, AVG(niveau_urgence) as moyenne FROM signalements GROUP BY quartier";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/stats/mode-quartiers', (req, res) => {
    const sql = `
        SELECT type_dechet, quartier, COUNT(*) as occurrences
        FROM signalements
        GROUP BY type_dechet, quartier
        HAVING occurrences = (
            SELECT MAX(cnt)
            FROM (
                SELECT COUNT(*) as cnt FROM signalements s2
                WHERE s2.type_dechet = signalements.type_dechet
                GROUP BY s2.quartier
            ) as subquery
        )`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
