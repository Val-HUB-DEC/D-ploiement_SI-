async function GET_Installations_PARAM() {
    try {
        // Récupère les données de l'API
        const response = await fetch('http://localhost:5000/installations');
        const installations = await response.json();
    
            // Récupérer les paramètres de l'URL
        const params = new URLSearchParams(window.location.search);
        const installationId = params.get('id'); // Lire le paramètre 'id'

        if (installationId) {
            // Appeler l'API pour récupérer les détails de l'installation
            fetch(`http://localhost:5000/installations/${installationId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erreur lors de la récupération de l'installation.");
                    }
                    return response.json();
                })
                .then(data => {
                    // Afficher le nom de l'installation
                    const installationName = data.Nom;
                    document.getElementById('installationName').textContent = installationName;

                    // Afficher d'autres données si nécessaire
                    console.log("Détails de l'installation :", data);
                })
                .catch(error => {
                    console.error("Erreur :", error);
                    document.getElementById('installationName').textContent = "Erreur lors du chargement de l'installation.";
                });
        } else {
            document.getElementById('installationName').textContent = "ID de l'installation non spécifié.";
        }
    } catch (error) {
        console.error('Erreur lors du chargement des paramètre de l installations :', error);
    }
}

// Fonction pour charger les installations dans le menu
async function GET_Installations() {
    try {
      // Récupère les données de l'API
      const response = await fetch('http://localhost:5000/installations');
      const installations = await response.json();
  
      // Sélection du corps du tableau
      const MenuBody = document.getElementById('MenuBody');
      MenuBody.innerHTML = '';
  
      installations.forEach((installation) => {
        const link = document.createElement('a');
        link.className = 'nav-link text-secondary';
        link.href = `appareil.html?id=${installation.ID}`; // Par exemple, rediriger vers une page spécifique à chaque installation
        link.textContent = installation.Nom;
  
        // Ajoute le lien au conteneur
        MenuBody.appendChild(link);
      });
  
    } catch (error) {
      console.error('Erreur lors du chargement des installations :', error);
    }
  }

  


// Charge des paramètres de l'installation au chargement de la page
document.addEventListener('DOMContentLoaded', GET_Installations);
document.addEventListener('DOMContentLoaded', GET_Installations_PARAM);