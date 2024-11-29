const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

// Configuration du serveur Express
const app = express();
const port = 5000;

app.use(express.json()); // Permet à Express d'analyser le corps en JSON
app.use(cors()); // Autoriser toutes les origines

// Configuration de la base de données
const db = mysql.createConnection({
  host: "mariadb",       // Adresse du serveur MariaDB
  user: "root",            // Nom d'utilisateur de la base de données
  password: "root",            // Mot de passe (laisser vide par défaut)
  database: "DIGITAL_WORLD" // Nom de la base de données
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("Connecté à la base de données MariaDB !");
});

// Route pour récupérer les données
app.get("/installations", (req, res) => {
  const sql = "SELECT * FROM installation";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des données :", err);
      res.status(500).send("Erreur lors de la récupération des données.");
      return;
    }
    // Renvoyer les données au format JSON
    res.json(results);
  });
});

app.post("/installations", (req, res) => {
  const { Nom, Nb_Appareil, Status } = req.body;
  
  // Vérifie si les données sont présentes
  if (!Nom || Nb_Appareil === undefined || Status === undefined) {
    return res.status(400).send("Données manquantes dans la requête.");
  }

  // SQL d'insertion sans ID car c'est un AUTO_INCREMENT
  const sql = "INSERT INTO installation (Nom, Nb_Appareil, Status) VALUES (?, ?, ?)";
  
  db.query(sql, [Nom, Nb_Appareil, Status], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de l'installation :", err);
      return res.status(500).send("Erreur lors de l'ajout de l'installation.");
    }

    // Retourne la nouvelle installation avec l'ID généré par AUTO_INCREMENT
    const newInstallation = {
      ID: result.insertId,  // ID généré automatiquement
      Nom,
      Nb_Appareil,
      Status,
    };
    
    // Réponse avec la nouvelle installation
    res.status(201).json(newInstallation);
  });
});

app.delete("/installations/:id", (req, res) => {
  const { id } = req.params;  // Récupère l'ID de l'installation depuis l'URL

  // Vérifie si l'ID est valide
  if (!id) {
    return res.status(400).send("ID manquant dans la requête.");
  }

  const sql = "DELETE FROM installation WHERE ID = ?";
  
  // Exécute la requête SQL pour supprimer l'installation avec cet ID
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'installation :", err);
      return res.status(500).send("Erreur lors de la suppression de l'installation.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Aucune installation trouvée avec cet ID.");
    }

    // Répond avec un message de succès
    res.status(200).send(`Installation avec ID ${id} supprimée avec succès.`);
  });
});




// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur Node.js en cours d'écution sur http://localhost:${port}`);
});
