const main = () => {
    let prodCard = document.getElementById("prod-card");
    let userCard = document.getElementById("user-card");
    let orderCard = document.getElementById("order-card");
    let statsCard = document.getElementById("stats-card");

    setEvents = function() {
        prodCard.addEventListener("click", () => {
            window.location.href = "adminprodotti.html";
        })

        userCard.addEventListener("click", () => {
            window.location.href = "adminutenti.html";
        })

        orderCard.addEventListener("click", () => {
            window.location.href = "adminordini.html";
        })

        statsCard.addEventListener("click", () => {
            window.location.href = "adminstats.html";
        })
    }

    setEvents();
}

window.onload = () => {main();}