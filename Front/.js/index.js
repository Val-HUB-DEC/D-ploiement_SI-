document.addEventListener("DOMContentLoaded", () => {
    // Toggle machine status
    const toggleButton = document.getElementById("toggle-status");
    toggleButton.addEventListener("click", () => {
        if (toggleButton.textContent.includes("Arrêter")) {
            toggleButton.textContent = "Démarrer la Machine";
            toggleButton.classList.replace("btn-warning", "btn-success");
        } else {
            toggleButton.textContent = "Arrêter la Machine";
            toggleButton.classList.replace("btn-success", "btn-warning");
        }
    });

    // Chart.js Data Visualization
    const ctx = document.getElementById("dataChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
            datasets: [
                {
                    label: "Efficacité (%)",
                    data: [95, 92, 88, 90, 93],
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 2,
                },
                {
                    label: "Température (°C)",
                    data: [72, 75, 70, 68, 74],
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
        },
    });
});
