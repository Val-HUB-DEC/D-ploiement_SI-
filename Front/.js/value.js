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
        showChart(variableID);  // Appel de la fonction avec l'ID de la variable
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

// Fonction pour afficher le graphique
async function showChart(deviceId) {
    const response = await fetch(`http://localhost:5000/valeurs/${deviceId}`);
    const values = await response.json();

    // Préparer les données pour le graphique
    const labels = values.map(item => new Date(item.dates));  // Convertir les dates en objets Date
    const data = values.map(item => item.value);

    // Créer le graphique avec Chart.js
    const ctx = document.getElementById('valueChart').getContext('2d');
    const valueChart = new Chart(ctx, {
        type: 'line',  // Type de graphique (courbe)
        data: {
            labels: labels,
            datasets: [{
                label: 'Valeurs de l\'appareil',
                data: data,
                borderColor: 'rgb(75, 192, 192)',  // Couleur de la ligne
                fill: false,  // Pas de remplissage sous la courbe
                tension: 0.1  // Lissage de la courbe
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',  // Définit l'axe X comme un axe de type time
                    time: {
                        unit: 'minute',  // Unité de l'axe de temps
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
}

// Fonction pour afficher les valeurs dans la table
async function GET_value() {
    const variableID = getUrlParam('id');  // Récupérer l'ID à partir de l'URL
    const response = await fetch(`http://localhost:5000/valeurs/${variableID}`);  // Remplacer par votre route API
    const data = await response.json();

    // Afficher les données dans la table
    const variableBody = document.getElementById('VariableBody');
    variableBody.innerHTML = '';  // Vider le contenu précédent
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.dates}</td>
            <td>${item.value}</td>
            <td><a onclick="DEL_Value(${item.ID})"><i class="bi bi-trash3"></i></a></td>
        `;
        variableBody.appendChild(row);
    });
}





// Fonction principale pour initialiser la page
document.addEventListener('DOMContentLoaded', () => {
    GET_Installations(); // Charger le menu des installations
    GET_Variable_PARAM(); // Charger les détails de l'installation
    GET_value();  // Charger les valeurs des appareils
});
