async function POST_cycle() {
    try {
        const variableID = getUrlParam('id');
        if (!variableID) {
            throw new Error("ID de variable manquant dans l'URL.");
        }

        // Étape 1 : Récupération des détails de la variable
        const Var_response = await fetch(`http://localhost:5000/variables`);
        if (!Var_response.ok) throw new Error("Erreur lors de la récupération des détails de la variable.");
        const VAR_data = await Var_response.json();
        const NB_data = VAR_data.length;

        if (!VAR_data || NB_data === 0) {
            throw new Error("Aucune donnée de variable trouvée.");
        }

        for (let i = 0; i < NB_data; i++) {
            console.log("Nom :" +VAR_data[i].nom)
        }
        
        // Optionnel : stockez `intervalId` globalement ou localement si besoin de l'arrêter plus tard
    } catch (error) {
        console.error("Erreur :", error.message);
        //alert(`Erreur : ${error.message}`);
        clearInterval(intervalId);
    }
}
