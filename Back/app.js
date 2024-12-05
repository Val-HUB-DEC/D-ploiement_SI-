const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const ping = require("ping");
const { lireValeurModbus } = require('./Read_API_Module');

// Configuration du serveur Express
const app = express();
const port = 5000;



app.use(express.json()); // Permet à Express d'analyser le corps en JSON
app.use(cors()); // Autoriser toutes les origines


app.get("/ping/:ip", async (req, res) => {
  const { ip } = req.params; // Récupère l'adresse IP depuis l'URL

  try {
    const pingResult = await ping.promise.probe(ip, {
      timeout: 5, // Timeout en secondes
    });

    if (pingResult.alive) {
      console.log(`Machine ${ip} est en ligne.`);
      res.json({ status: "online", time: pingResult.time }); // Temps de réponse
    } else {
      console.log(`Machine ${ip} est hors ligne.`);
      res.json({ status: "offline" });
    }
  } catch (error) {
    console.error(`Erreur lors du ping de ${ip} :`, error);
    res.json({ status: "error", error: error.message });
  }
}); 

app.get('/modbus/read', async (req, res) => {
  const { ip, address, port, quantity } = req.query;

  try {
      const result = await lireValeurModbus(ip, Number(address), Number(port), Number(quantity));
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Configuration de la base de données
const db = mysql.createConnection({
  host: "db",       // Adresse du serveur MariaDB
  user: "root",            // Nom d'utilisateur de la base de données
  password: "root",            // Mot de passe (laisser vide par défaut)
  database: "DB_DIGITAL_WORLD", // Nom de la base de données
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

// Route pour récupérer une installation par ID
app.get('/installations/:id', (req, res) => {
  const installationId = req.params.id; // Récupérer l'ID à partir des paramètres de la requête

  const sql = "SELECT * FROM installation WHERE ID = ?";
  db.query(sql, [installationId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'installation :", err);
      return res.status(500).send("Erreur lors de la récupération de l'installation.");
    }

    if (results.length === 0) {
      return res.status(404).send("Installation introuvable.");
    }

    res.json(results[0]); // Renvoyer l'installation correspondante
  });
});

app.get('/appareil/:id', (req, res) => {
  const installationId = req.params.id; // Récupérer l'ID à partir des paramètres de la requête

  const sql = "SELECT * FROM appareil WHERE ID = ?";
  db.query(sql, [installationId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'appareil :", err);
      return res.status(500).send("Erreur lors de la récupération de l'appareil.");
    }

    if (results.length === 0) {
      return res.status(404).send("appareil introuvable.");
    }

    res.json(results[0]); // Renvoyer l'installation correspondante
  });
});

app.get('/appareils/:installationId', (req, res) => {
  const installationId = req.params.installationId;

  const sql = "SELECT * FROM appareil WHERE ID_of_installation = ?";
  db.query(sql, [installationId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des appareils :", err);
      return res.status(500).json({ message: "Erreur lors de la récupération des appareils." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Aucun appareil trouvé pour cette installation." });
    }

    res.json(results);
  });
});

app.post("/appareils", (req, res) => {
  const { Nom, ip, Status, ID_of_installation } = req.body;

  // Vérification des champs requis
  if (!Nom || !ip || Status === undefined || !ID_of_installation) {
      return res.status(400).json({ message: "Données manquantes." });
  }

  const sql = "INSERT INTO appareil (Nom, ip, Status, ID_of_installation) VALUES (?, ?, ?, ?)";

  db.query(sql, [Nom, ip, Status, ID_of_installation], (err, result) => {
      if (err) {
          console.error("Erreur lors de l'ajout de l'appareil :", err);
          return res.status(500).json({ message: "Erreur lors de l'ajout de l'appareil." });
      }

      res.status(201).json({
          Nom: result.insertId,
          ip,
          Status,
          ID_of_installation
      });
  });
});

app.delete("/appareils/:id", (req, res) => {
  const { id } = req.params; // Récupère l'ID de l'appareil depuis l'URL

  if (!id) {
    return res.status(400).json({ message: "ID de l'appareil manquant." });
  }

  const sql = "DELETE FROM appareil WHERE ID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'appareil :", err);
      return res.status(500).json({ message: "Erreur lors de la suppression de l'appareil." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aucun appareil trouvé avec cet ID." });
    }

    res.status(200).json({ message: `Appareil avec ID ${id} supprimé avec succès.` });
  });
});

app.post('/variable', (req, res) => {
  // Extraire les données envoyées dans la requête
  const { Nom, I_Bool, I_int, taux, unité, adresse, Port_API, I_MAE_MIN, I_MAE_MAX, O_MAE_MIN, O_MAE_MAX, ID_of_appareil } = req.body;

  // Requête SQL pour insérer les données dans la table 'variable'
  const query = `INSERT INTO variable (Nom, I_Bool, I_int, taux, unité, adresse, Port_API, I_MAE_MIN, I_MAE_MAX, O_MAE_MIN, O_MAE_MAX, ID_of_appareil)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Exécution de la requête SQL
  db.execute(query, [Nom, I_Bool, I_int, taux, unité, adresse, Port_API, I_MAE_MIN, I_MAE_MAX, O_MAE_MIN, O_MAE_MAX, ID_of_appareil], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion:', err);
      return res.status(500).json({ error: 'Erreur serveur lors de l\'insertion' });
    }
    res.status(201).json({ message: 'Variable ajoutée avec succès', id: results.insertId });
  });
});

// Route pour récupérer une variable par ID
app.get('/variables/:id_of_appreil', (req, res) => {
  const appareilId = req.params.id_of_appreil;  // Récupère l'ID de l'appareil depuis l'URL
  
  // Requête SQL pour récupérer toutes les variables associées à cet appareil
  const query = `
      SELECT * 
      FROM variable 
      WHERE ID_of_appareil = ?`;

  db.query(query, [appareilId], (err, results) => {
      if (err) {
          console.error('Erreur de la requête SQL:', err);
          return res.status(500).json({ error: 'Erreur serveur lors de la récupération des variables.' });
      }

      // Si aucune variable n'est trouvée
      if (results.length === 0) {
          return res.status(404).json({ message: 'Aucune variable trouvée pour cet appareil.' });
      }

      // Renvoie les variables de l'appareil
      res.status(200).json(results);
  });
});

app.delete('/variable/:id', (req, res) => {
  const variableId = req.params.id;

  const query = 'DELETE FROM variable WHERE ID = ?';

  db.execute(query, [variableId], (err, results) => {
      if (err) {
          console.error('Erreur lors de la suppression de la variable :', err);
          return res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Variable non trouvée.' });
      }

      res.status(200).json({ message: 'Variable supprimée avec succès.' });
  });
});

// Route pour récupérer une variable par ID
app.get('/variable/:id', (req, res) => {
  const Id = req.params.id;  // Récupère l'ID de l'appareil depuis l'URL
  
  // Requête SQL pour récupérer toutes les variables associées à cet appareil
  const query = `
      SELECT * 
      FROM variable 
      WHERE ID = ?`;

  db.query(query, [Id], (err, results) => {
      if (err) {
          console.error('Erreur de la requête SQL:', err);
          return res.status(500).json({ error: 'Erreur serveur lors de la récupération des variables.' });
      }

      // Si aucune variable n'est trouvée
      if (results.length === 0) {
          return res.status(404).json({ message: 'Aucune variable trouvée pour cet appareil.' });
      }

      // Renvoie les variables de l'appareil
      res.status(200).json(results);
  });
});
 
app.get('/valeurs/:id', (req, res) => {
  const variableId = req.params.id;  // Récupérer l'ID de la variable depuis les paramètres de l'URL

  // Requête SQL pour récupérer les valeurs associées à l'ID de la variable
  const query = `
    SELECT *
    FROM valeurs v
    WHERE v.ID_of_variable = ?
    ORDER BY v.dates ASC;  -- Trier les résultats par date
  `;

  db.query(query, [variableId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des valeurs :', err);
      return res.status(500).send('Erreur serveur');
    }

    // Vérifier si des résultats ont été trouvés
    if (results.length === 0) {
      return res.status(404).send('Aucune valeur trouvée pour cet ID de variable');
    }

    // Renvoi des résultats sous forme de JSON
    res.json(results);
  });
});

app.post('/valeurs/:ID_of_variable', (req, res) => {
  const ID_of_variable = req.params.ID_of_variable; // Récupérer l'ID depuis l'URL
  const { value } = req.body; // La valeur est envoyée dans le body
  const dates = new Date(); // Utiliser la date actuelle

  if (isNaN(ID_of_variable)) {
      return res.status(400).json({ error: "Données manquantes ou invalides" });
  }

  // Requête SQL pour insérer la valeur
  const query = `
      INSERT INTO valeurs (ID_of_variable, value, dates)
      VALUES (?, ?, ?);
  `;

  db.query(query, [ID_of_variable, value, dates], (err, result) => {
      if (err) {
          console.error('Erreur lors de l\'insertion de la valeur :', err);
          return res.status(500).send('Erreur serveur');
      }

      // Réponse avec l'ID de l'enregistrement inséré
      res.status(201).json({ message: 'Valeur ajoutée avec succès', insertedId: result.insertId });
  });
});


// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur Node.js en cours d'écution sur http://localhost:${port}`);
});
