// Fonction utilitaire pour récupérer les paramètres de l'URL
function getUrlParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Fonction pour charger les détails d'une installation
async function GET_Installations_PARAM() {
    try {
        const installationId = getUrlParam('id'); // Récupère l'ID de l'installation

        if (installationId) {
            const response = await fetch(`http://localhost:5000/installations/${installationId}`);
            if (!response.ok) throw new Error("Erreur lors de la récupération de l'installation.");

            const data = await response.json();
            document.getElementById('installationName').textContent = data.Nom;
            window.currentInstallationID = installationId; // Stocke l'ID d'installation
        } else {
            document.getElementById('installationName').textContent = "ID de l'installation non spécifié.";
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

// Fonction pour charger les appareils d'une installation
async function GET_Appareils(installationId) {
    try {
        const response = await fetch(`http://localhost:5000/appareils/${installationId}`);
        const appareils = await response.json();

        const appareilBody = document.getElementById('AppareilBody');
        appareilBody.innerHTML = ''; // Vide le tableau

        appareils.forEach((appareil) => {
            const tablerow = document.createElement('tr');

            tablerow.innerHTML = `
                <td>${appareil.Nom}</td>
                <td>${appareil.ip}</td>
                <td>${appareil.Status === 1 ? 'En ligne' : 'Hors ligne'}</td>
                <td><a href="variable.html?id=${appareil.ID}">Voir</a></td>
                <td><a onclick="DEL_Appareil(${appareil.ID})"><i class="bi bi-trash3"></i></a></td>
            `;

            appareilBody.appendChild(tablerow);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des appareils :', error);
    }
}

// Fonction pour supprimer un appareil
async function DEL_Appareil(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet appareil ?")) return;

    try {
        const response = await fetch(`http://localhost:5000/appareils/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur lors de la suppression de l'appareil.");

        const result = await response.json();
        alert(result.message);

        const installationId = window.currentInstallationID;
        if (installationId) GET_Appareils(installationId);
    } catch (error) {
        console.error("Erreur lors de la suppression de l'appareil :", error);
        alert("Une erreur est survenue lors de la suppression de l'appareil.");
    }
}

// Fonction pour pinger une adresse IP
document.getElementById("PingAppareilBtn").addEventListener("click", async function () {
    const ip = document.getElementById("appareilIP").value.trim();

    if (!ip) {
        alert("Veuillez entrer une adresse IP.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/ping/${ip}`);
        if (!response.ok) throw new Error("Erreur de connexion au serveur");

        const data = await response.json();
        alert(data.status === "online"
            ? `La machine ${ip} est en ligne. Temps de réponse: ${data.time} ms.`
            : `La machine ${ip} est hors ligne.`);
    } catch (error) {
        console.error("Erreur lors du ping :", error);
        alert("Une erreur est survenue lors du ping.");
    }
});

async function POST_Appareil() {
    try {
        // Récupérer l'ID de l'installation depuis les paramètres de l'URL
        const installationId = new URLSearchParams(window.location.search).get('id');
        if (!installationId) {
            alert("ID de l'installation non spécifié.");
            return;
        }

        // Récupérer les données du formulaire
        const nom = document.getElementById('appareilNom').value.trim();
        const ip = document.getElementById('appareilIP').value.trim();

        if (!nom || !ip) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Ajouter un statut par défaut ou récupérer une valeur du formulaire si vous en avez un
        const status = 1;  // Supposons que le statut est "en ligne" par défaut

        // Envoyer les données à l'API pour ajouter l'appareil
        const response = await fetch(`http://localhost:5000/appareils`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Nom: nom,
                ip: ip,
                Status: status,          // Ajout du statut ici
                ID_of_installation: installationId, // ID de l'installation
            }),
        });

        // Vérifiez si la réponse est OK
        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de l'appareil.");
        }

        // Obtenez la réponse JSON du serveur
        const result = await response.json();
        alert(result.message || "Appareil ajouté avec succès.");

        // Recharge la liste des appareils après ajout
        GET_Appareils(installationId);  // Assurez-vous que cette fonction est définie et fonctionne
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'appareil :", error);
        alert("Une erreur est survenue lors de l'ajout de l'appareil.");
    }
}







// Fonction principale pour initialiser la page
document.addEventListener('DOMContentLoaded', () => {
    GET_Installations(); // Charger le menu des installations
    GET_Installations_PARAM(); // Charger les détails de l'installation

    const installationId = getUrlParam('id');
    if (installationId) {
        GET_Appareils(installationId); // Charger les appareils de l'installation
    } else {
        console.error("ID de l'installation non spécifié.");
    }
});
// Event Listener pour le bouton "Ajouter"
document.getElementById("ajouterAppareilBtn").addEventListener("click", POST_Appareil);