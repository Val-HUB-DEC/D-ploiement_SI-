
// Fonction pour charger les installations dans le tableau
async function GET_Installations() {
  try {
    // Récupère les données de l'API
    const response = await fetch('http://localhost:5000/installations');
    const installations = await response.json();

    // Sélection du corps du tableau
    const tableBody = document.getElementById('tableBody');
    const MenuBody = document.getElementById('MenuBody');
    tableBody.innerHTML = ''; // Vide le tableau avant de le remplir
    MenuBody.innerHTML = '';

    // Remplit le tableau avec les données
    installations.forEach((installation) => {
      const tablerow = document.createElement('tr');

      // Crée les cellules
      tablerow.innerHTML = `
        <td>${installation.Nom}</td>
        <td>${installation.Nb_Appareil}</td>
        <td>${installation.Status === 1 ? 'En ligne' : installation.Status === 0 ? 'Hors ligne' : 'Erreur'}</td>
        <td><a href="appareil.html?id=${installation.ID}">Voir</a></td>
        <td><a onclick="DEL_Installation(${installation.ID})"><i class="bi bi-trash3"></i></a></td>
      `;

      // Ajoute la ligne au tableau
      tableBody.appendChild(tablerow);
    });

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

// Fonction pour supprimer une installation
async function DEL_Installation(id) {
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette installation ?");
  if (!confirmation) return;  // Annule l'action si l'utilisateur refuse

  try {
    // Envoie une requête DELETE pour supprimer l'installation
    const response = await fetch(`http://localhost:5000/installations/${id}`, {
      method: 'DELETE',
    });

    // Vérifie si la suppression a réussi
    if (response.ok) {
      alert('Installation supprimée avec succès');
      GET_Installations(); // Recharge les installations après suppression
    } else {
      alert('Erreur lors de la suppression de l\'installation');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'installation:', error);
    alert('Une erreur est survenue');
  }
}


async function POST_Installation(event) {
    event.preventDefault(); // Empêche la soumission du formulaire

    const nom = document.getElementById('machineId').value; // Champ d'entrée du nom

    if (!nom.trim()) {
        alert('Veuillez entrer un nom pour l\'installation.');
        return;
    }

    // Crée un objet avec les données de la nouvelle installation
    const newInstallation = {
      Nom: nom,
      Nb_Appareil: 0, // On initialise avec 0, à ajuster si nécessaire
      Status: 1, // On convertit le statut en nombre (0 ou 1)
    };

    try {
      // Envoie une requête POST pour ajouter la nouvelle installation
      const response = await fetch('http://localhost:5000/installations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInstallation),
      });

      // Vérifie si l'ajout a réussi
      if (response.ok) {
        alert('Installation ajoutée avec succès');
        GET_Installations(); // Recharge les installations après ajout
        document.getElementById('ajouterInstallationForm').reset(); // Réinitialise le formulaire
      } else {
        alert('Erreur lors de l\'ajout de l\'installation');
      }
    } catch (error) {
      //console.error('Erreur lors de l\'ajout de l\'installation:', error);
      //alert('Une erreur est survenue');
    }
}

// Charge les installations au chargement de la page
document.addEventListener('DOMContentLoaded', GET_Installations);
// Ajoute une installation au clic sur le bouton
document.getElementById('ajouterInstallationBtn').addEventListener('click', POST_Installation);


