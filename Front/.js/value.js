// Fonction utilitaire pour récupérer les paramètres de l'URL
function getUrlParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Fonction pour charger les détails d'une installation
async function GET_Variable_PARAM() {
    try {
        // Récupérer l'ID de la variable depuis l'URL
        const variableID = getUrlParam('id');
        
        // Vérifier si l'ID est valide
        if (!variableID) {
            console.error("ID de la variable manquant dans l'URL");
            return;
        }

        // Faire la requête à l'API pour récupérer les données de la variable
        const response = await fetch(`http://localhost:5000/variable/${variableID}`);

        // Vérifier si la réponse est réussie
        if (!response.ok) {
            console.error("Erreur lors de la récupération des données :", response.status);
            return;
        }

        // Convertir la réponse en JSON
        const variables = await response.json();

        // Vérifier que les données sont valides
        if (!variables || variables.length === 0) {
            console.error("Aucune donnée trouvée pour cet ID");
            return;
        }

        // Remplir les champs du formulaire avec les données récupérées
        const variable = variables[0]; // Les données de la variable sont dans un tableau, donc on prend le premier élément

        document.getElementById('variableNom').textContent = variable.Nom || "Inconnu";
        document.getElementById('variableUnit').textContent = variable.unité || "Non spécifié";
        document.getElementById('variableType').textContent = variable.I_Bool === 1 ? "BOOL" : "INT";
        document.getElementById('variableTaux').textContent = 
            variable.taux === "0.5" ? "0,5 secondes" :
            variable.taux === "1" ? "1 seconde" :
            variable.taux === "60" ? "1 minute" :
            variable.taux === "300" ? "5 minutes" : 
            "1 heure";
        document.getElementById('variableAdress').textContent = variable.adresse || "Non spécifiée";
        document.getElementById('variablePort').textContent = variable.Port_API || "502"; // Valeur par défaut si absente
        initializeChart(variableID);  // Appel de la fonction avec l'ID de la variable
    } catch (error) {
        console.error("Erreur lors de l'exécution de GET_Variable_PARAM :", error);
    }
}

// Fonction pour charger le menu des installations
async function GET_Installations() {
    try {
        const response = await fetch('http://localhost:5000/installations');
        const installations = await response.json();

        const MenuBody = document.getElementById('MenuBody');
        MenuBody.innerHTML = ''; // Vide le menu

        installations.forEach((installation) => {
            const link = document.createElement('a');
            link.className = 'nav-link text-secondary';
            link.href = `appareil.html?id=${installation.ID}`;
            link.textContent = installation.Nom;
            MenuBody.appendChild(link);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des installations :', error);
    }
}

// Cette fonction sera appelée pour afficher et mettre à jour le graphique
async function initializeChart(deviceId) {
    try {
        // Récupérer les données de la variable depuis l'API
        const response = await fetch(`http://localhost:5000/valeurs/${deviceId}`);
        const values = await response.json();

        // Préparer les données pour le graphique
        const labels = values.map(item => new Date(item.dates));  // Convertir les dates en objets Date
        const data = values.map(item => item.value);

        // Créer le graphique avec Chart.js
        const ctx = document.getElementById('valueChart').getContext('2d');
        
        valueChart = new Chart(ctx, {
            type: 'line',  // Type de graphique (courbe)
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valeurs de l\'appareil',
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',  // L'axe X est un axe de type temps
                        time: {
                            unit: 'minute',
                            tooltipFormat: 'PP HH:mm',  // Format de l'info-bulle
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Valeur'
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erreur lors de l'initialisation du graphique :", error);
        alert(`Erreur lors de l'initialisation du graphique : ${error.message}`);
    }
}

// Fonction pour mettre à jour le graphique
async function updateChart(deviceId, rangeMinutes) {
    try {
        // Récupérer les nouvelles données de la variable
        const response = await fetch(`http://localhost:5000/valeurs/${deviceId}`);
        const values = await response.json();

        // Filtrer les données pour n'inclure que celles des 'rangeMinutes' dernières minutes
        const now = new Date();
        const filteredValues = values.filter(item => {
            const itemDate = new Date(item.dates);
            const diffMinutes = (now - itemDate) / 1000 / 60;  // Différence en minutes
            return diffMinutes <= rangeMinutes;
        });

        // Vérifier si nous avons des données filtrées
        if (filteredValues.length === 0) {
            console.log("Aucune donnée à afficher.");
            return;
        }

        // Préparer les nouvelles données pour le graphique
        const labels = filteredValues.map(item => new Date(item.dates));  // Convertir les dates en objets Date
        const data = filteredValues.map(item => item.value);

        // Mettre à jour les données du graphique existant
        if (valueChart) {
            valueChart.data.labels = labels;
            valueChart.data.datasets[0].data = data;

            // Mettre à jour le graphique avec les nouvelles données
            valueChart.update();
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour du graphique :", error);
        alert(`Erreur lors de la mise à jour du graphique : ${error.message}`);
        clearInterval(intervalId);
    }
}

// Fonction pour afficher les valeurs dans la table
async function GET_value() {
    const variableID = getUrlParam('id');  // Récupérer l'ID à partir de l'URL
    const response = await fetch(`http://localhost:5000/valeurs/${variableID}`);  // Remplacer par votre route API
    const data = await response.json();

    // Inverser l'ordre des données (les plus récentes en premier)
    data.reverse();

    // Afficher les données dans la table
    const variableBody = document.getElementById('VariableBody');
    variableBody.innerHTML = '';  // Vider le contenu précédent
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = ` 
            <td>${item.dates}</td>
            <td>${item.value}</td>
            <!--<td><a onclick="DEL_Value(${item.ID})"><i class="bi bi-trash3"></i></a></td>-->
        `;
        variableBody.appendChild(row);
    });
    
}

async function POST_value() {
    try {
        const variableID = getUrlParam('id');
        if (!variableID) {
            throw new Error("ID de variable manquant dans l'URL.");
        }

        // Étape 1 : Récupération des détails de la variable
        const Var_response = await fetch(`http://localhost:5000/variable/${variableID}`);
        if (!Var_response.ok) throw new Error("Erreur lors de la récupération des détails de la variable.");
        const VAR_data = await Var_response.json();

        if (!VAR_data || VAR_data.length === 0) {
            throw new Error("Aucune donnée de variable trouvée.");
        }

        // Accédez au premier élément du tableau
        const variableDetails = VAR_data[0];
        const appareilId = variableDetails.ID_of_appareil;
        const adresse = variableDetails.adresse;
        const Port_API = variableDetails.Port_API;

        // Étape 2 : Récupération de l'IP de l'appareil
        console.log(appareilId)
        const IPresponse = await fetch(`http://localhost:5000/appareil/${appareilId}`);
        if (!IPresponse.ok) throw new Error("Erreur lors de la récupération des détails de l'appareil.");
        const { ip } = await IPresponse.json();

        if (!ip) {
            throw new Error("Adresse IP de l'appareil introuvable.");
        }

        // Étape 3 : Lecture Modbus
        const modbusResponse = await fetch(`http://localhost:5000/modbus/read?ip=${ip}&address=${adresse}&port=${Port_API}`);
        if (!modbusResponse.ok) {
            const errorData = await modbusResponse.json();
            throw new Error(`Erreur Modbus : ${errorData.error || "Inconnue"}`);
        }
        const { value } = await modbusResponse.json();

        // Étape 4 : Ajout de la valeur
        const postResponse = await fetch(`http://localhost:5000/valeurs/${variableID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value }),
        });

        if (!postResponse.ok) {
            const errorData = await postResponse.json();
            throw new Error(`Erreur lors de l'ajout de la valeur : ${errorData.message}`);
        }

        const result = await postResponse.json();
        console.log('Valeur ajoutée avec succès :', result);

        //alert('Valeur ajoutée avec succès.');
    } catch (error) {
        console.error("Erreur :", error.message);
        //alert(`Erreur : ${error.message}`);
    }
}

async function POST_cycle_value() {
    try {
        const variableID = getUrlParam('id');
        if (!variableID) {
            throw new Error("ID de variable manquant dans l'URL.");
        }

        // Étape 1 : Récupération des détails de la variable
        const Var_response = await fetch(`http://localhost:5000/variable/${variableID}`);
        if (!Var_response.ok) throw new Error("Erreur lors de la récupération des détails de la variable.");
        const VAR_data = await Var_response.json();

        if (!VAR_data || VAR_data.length === 0) {
            throw new Error("Aucune donnée de variable trouvée.");
        }

        // Accédez au premier élément du tableau
        const variableDetails = VAR_data[0];
        const taux = 1000 * variableDetails.taux; // Taux en millisecondes

        // Étape 2 : Configurer la tâche cyclique
        const intervalId = setInterval(() => {
            POST_value();             
            GET_value();  // Charger les valeurs des appareils
            updateChart(variableID,document.getElementById('courbeinterval').value)
        }, taux);

        console.log(`Tâche cyclique configurée avec un taux de ${taux} ms. ID Intervalle: ${intervalId}`);
        
        // Optionnel : stockez `intervalId` globalement ou localement si besoin de l'arrêter plus tard
    } catch (error) {
        console.error("Erreur :", error.message);
        alert(`Erreur : ${error.message}`);
        clearInterval(intervalId);
    }
}

function exportCSV() {
    // Demander à l'utilisateur la date de début, la date de fin et le nom du fichier
    const startDate = prompt('Entrez la date de début (format YYYY-MM-DD HH:mm:ss) :');
    const endDate = prompt('Entrez la date de fin (format YYYY-MM-DD HH:mm:ss) :');
    const fileName = prompt('Entrez le nom du fichier CSV (par défaut : valeurs.csv) :') || 'valeurs.csv';

    // Vérifier la validité des dates
    if (!startDate || !endDate) {
        alert('Les dates de début et de fin sont obligatoires.');
        return;
    }

    // Vérifier si le tableau existe
    const table = document.getElementById('datatablesSimple');
    if (!table) {
        console.error('Le tableau avec l\'ID "datatablesSimple" est introuvable.');
        return;
    }

    // Obtenir toutes les lignes du tableau
    const rows = table.querySelectorAll('tr');
    const csvContent = [];

    rows.forEach(row => {
        // Extraire les cellules de chaque ligne
        const cells = row.querySelectorAll('td, th');
        const rowDate = row.querySelector('td')?.textContent.trim(); // Suppose que la date est dans la première colonne

        // Vérifier si la ligne est dans la plage de dates spécifiée
        if (rowDate) {
            const rowDateObj = new Date(rowDate);
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            if (rowDateObj >= startDateObj && rowDateObj <= endDateObj) {
                const rowContent = Array.from(cells).map(cell => cell.textContent.trim()).join(',');
                csvContent.push(rowContent);
            }
        }
    });

    // Vérifier si des données ont été ajoutées
    if (csvContent.length === 0) {
        alert('Aucune donnée ne correspond à la plage de dates spécifiée.');
        return;
    }

    // Créer le fichier CSV
    const csvBlob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');

    link.href = csvUrl;
    link.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
    link.click();
}

// Fonction principale pour initialiser la page
document.addEventListener('DOMContentLoaded', () => {
    //clearInterval(intervalId);
    GET_Installations(); // Charger le menu des installations
    GET_Variable_PARAM(); // Charger les détails de l'installation
    POST_value(); 
    POST_cycle_value();
});

document.addEventListener('DOMContentLoaded', () => {
    const intervalSelect = document.getElementById('courbeinterval');

    // Ajouter un écouteur pour l'événement de changement
    intervalSelect.addEventListener('change', () => {
        const selectedValue = intervalSelect.value; // Récupère la valeur sélectionnée
        console.log(`Nouvel intervalle sélectionné : ${selectedValue} minutes`);
        const variableID = getUrlParam('id');
        updateChart(variableID,selectedValue);
    });
});