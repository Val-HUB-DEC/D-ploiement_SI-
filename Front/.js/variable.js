// Fonction utilitaire pour récupérer les paramètres de l'URL
function getUrlParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Fonction pour charger les détails d'une installation
async function GET_Appareil_PARAM() {
    try {
        const appareilId = getUrlParam('id'); // Récupère l'ID de l'installation

        if (appareilId) {
            const response = await fetch(`http://localhost:5000/appareil/${appareilId}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération de l'appareil.");

            const data = await response.json();

            const response2 = await fetch(`http://localhost:5000/installations/${data.ID_of_installation}`);
            if (!response2.ok) throw new Error("Erreur lors de la récupération de l'installation.");
            const data2 = await response2.json();

            document.getElementById('AppareilName').textContent = data2.Nom + ' / ' + data.Nom;
            window.currentappareilId = appareilId; // Stocke l'ID d'installation
        } else {
            document.getElementById('AppareilName').textContent = "ID de l'installation non spécifié.";
        }
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres de l\'installation :', error);
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

// Fonction pour envoyer une requête POST pour ajouter une nouvelle variable
document.getElementById('ajouterVariableBtn').addEventListener('click', async function() {
    const nom = document.getElementById('variableNom').value;
    const taux = document.getElementById('variableTaux').value;
    const unite = document.getElementById('variableUnit').value;
    const adresse = document.getElementById('variableAdress').value;
    const portAPI = document.getElementById('variablePort').value;
    const idAppareil = getUrlParam('id'); // On récupère l'ID de l'appareil de l'URL
    const I_Bool = true; // Exemple: Booléen pour tester
    const I_int = false; // Exemple: Pas un entier
    const I_MAE_MIN = 0;
    const I_MAE_MAX = 100;
    const O_MAE_MIN = 0;
    const O_MAE_MAX = 100;

    if (!nom || !taux || !unite || !adresse || !portAPI) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return; // Arrête la fonction si un champ est vide
    }

    const newVariable = {
        Nom: nom,
        I_Bool: I_Bool,
        I_int: I_int,
        taux: taux,
        unité: unite,
        adresse: adresse,
        Port_API: portAPI,
        I_MAE_MIN: I_MAE_MIN,
        I_MAE_MAX: I_MAE_MAX,
        O_MAE_MIN: O_MAE_MIN,
        O_MAE_MAX: O_MAE_MAX,
        ID_of_appareil: idAppareil // Associe à l'appareil
    };

    try {
        const response = await fetch('http://localhost:5000/variable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVariable)
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Message de confirmation
            GET_Variables(idAppareil); // Actualise dynamiquement la liste
        } else {
            alert('Erreur: ' + (data.error || 'Erreur inconnue'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue.');
    }
});

document.getElementById('btnLire').addEventListener('click', async () => {
    const address = document.getElementById('variableAdress').value;
    const port = document.getElementById('variablePort').value;
    const quantity = 1;
    let ip

    // Vérification des champs requis
    if (!address || !port) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

        
    const appareilId = getUrlParam('id'); // Récupère l'ID de l'installation
    if (appareilId) {
        const IPresponse = await fetch(`http://localhost:5000/appareil/${appareilId}`);
        if (!IPresponse.ok) throw new Error("Erreur lors de la récupération de l'appareil.");
        const IPdata = await IPresponse.json();
        ip = IPdata.ip;        
    }
    

    

    try {
        const response = await fetch(`http://localhost:5000/modbus/read?ip=${ip}&address=${address}&port=${port}&quantity=${quantity}`);
        const data = await response.json();

        if (response.ok) {
            console.log(data);
        } else {
            console.log(data.error);
        }
    } catch (error) {
        alert('Erreur : '+ error.message);
    }
});

async function GET_Variables(appareilId) {
    try {
        const response = await fetch(`http://localhost:5000/variables/${appareilId}`);
        const variables = await response.json();

        const variableBody = document.getElementById('VariableBody');
        variableBody.innerHTML = ''; // Vide le tableau

        variables.forEach((variable) => {
            const tablerow = document.createElement('tr');

            tablerow.innerHTML = `
                <td>${variable.Nom}</td>
                <td>${variable.unité}</td>
                <td>${variable.I_Bool ? 'Booléen' : 'Entier'}</td>
                <td>${variable.taux}s</td>
                <td><a href="value.html?id=${variable.ID}">Voir</a></td>
                <td><a onclick="DEL_Variable(${variable.ID})"><i class="bi bi-trash3"></i></a></td>
            `;


            variableBody.appendChild(tablerow);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des variables :', error);
    }
}

async function DEL_Variable(variableId) {
    try {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette variable ?")) {
            const response = await fetch(`http://localhost:5000/variable/${variableId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Affiche le message de confirmation
                const appareilId = getUrlParam('id'); // Récupère l'ID de l'appareil dans l'URL
                GET_Variables(appareilId); // Actualise la liste des variables
            } else {
                alert('Erreur: ' + (data.error || 'Erreur inconnue'));
            }
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la variable :', error);
        alert('Une erreur est survenue.');
    }
}



// Fonction principale pour initialiser la page
document.addEventListener('DOMContentLoaded', () => {
    GET_Installations(); // Charger le menu des installations
    GET_Appareil_PARAM(); // Charger les détails de l'installation
    const AppareilId = getUrlParam('id');
    if (AppareilId) {
        GET_Variables(AppareilId); // Charger les appareils de l'installation
    } else {
        console.error("ID de l'installation non spécifié.");
    }
});
