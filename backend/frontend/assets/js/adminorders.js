const main = () => {
    let allOrders = document.getElementsByClassName("all-orders")[0];
    let currentOrder = null;

    const infoID = document.getElementById("infoID");
    const infoDate = document.getElementById("infoDate");
    const infoUser = document.getElementById("infoUser");
    const infoTotalCost = document.getElementById("infoTotalCost");
    const infoAnnullato = document.getElementById("infoAnnullato");
    const infoInCorso = document.getElementById("infoInCorso");
    const infoSpedito = document.getElementById("infoSpedito");
    const productsContainer = document.getElementById("products-container");
    let currentProductsRows = [];

    renderProductsPerOrder = function (products) {
        if(currentProductsRows.length > 0) {
            for(var i=0; i<currentProductsRows.length; i++) {
                productsContainer.removeChild(currentProductsRows[i]);
            }
            currentProductsRows = [];
        }

        for(var i=0; i<products.length; i++) {
            const row = document.createElement("div");
            row.className = "row";
            productsContainer.appendChild(row);
            currentProductsRows.push(row);

            const image = document.createElement("div");
            image.className = "image";
            row.appendChild(image);

            const img = document.createElement("img");
            img.setAttribute("src", products[i].image);
            image.appendChild(img);

            const name = document.createElement("div");
            name.innerHTML = products[i].name;
            name.className = "text";
            row.appendChild(name);

            const cartQuantity = document.createElement("div");
            cartQuantity.innerHTML = "qty: " + products[i].cart_quantity;
            cartQuantity.className = "text";
            row.appendChild(cartQuantity);
        }
    }

    setCurrentOrder = function (curr_order, user) {
        currentOrder = curr_order;
        console.log(curr_order);
        console.log(currentOrder);

        // set info
        infoID.innerHTML = currentOrder.orderID;
        infoDate.innerHTML = currentOrder.date;
        infoUser.innerHTML = user;
        infoTotalCost.innerHTML = "€" + currentOrder.totalCost;
        switch(currentOrder.state) {
            case "annullato":
                infoAnnullato.style.backgroundColor = "#FF000059";
                infoInCorso.style.backgroundColor = "transparent";
                infoSpedito.style.backgroundColor = "transparent";
                break;
            case "in corso":
                infoAnnullato.style.backgroundColor = "transparent";
                infoInCorso.style.backgroundColor = "#FF560059";
                infoSpedito.style.backgroundColor = "transparent";
                break;
            case "spedito":
                infoAnnullato.style.backgroundColor = "transparent";
                infoInCorso.style.backgroundColor = "transparent";
                infoSpedito.style.backgroundColor = "#00FF3659";
                break;
        }

        renderProductsPerOrder(currentOrder.products);

        infoAnnullato.addEventListener("click", () => {
            fetch(`http://localhost:3000/api/order/update/${currentOrder._id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    state: "annullato"
                })
            })
            .then(response => response.json())
            .then(result => {
                if(result.type == "success") {
                    infoAnnullato.style.backgroundColor = "#FF000059";
                    infoInCorso.style.backgroundColor = "transparent";
                    infoSpedito.style.backgroundColor = "transparent";
                }
            })
        })

        infoInCorso.addEventListener("click", () => {
            fetch(`http://localhost:3000/api/order/update/${currentOrder._id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    state: "in corso"
                })
            })
            .then(response => response.json())
            .then(result => {
                if(result.type == "success") {
                    infoAnnullato.style.backgroundColor = "transparent";
                    infoInCorso.style.backgroundColor = "#FF560059";
                    infoSpedito.style.backgroundColor = "transparent";
                }
            })
        })

        infoSpedito.addEventListener("click", () => {
            if(currentOrder.state == "spedito") {
                return;
            }
            fetch(`http://localhost:3000/api/order/update/${currentOrder._id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    state: "spedito"
                })
            })
            .then(response => response.json())
            .then(result => {
                if(result.type == "success") {
                    let correctFlag = true;
                    for(var j=0; j<currentOrder.products.length; j++) {
                        const currentProd = currentOrder.products[j];
                        if(currentProd.quantity - currentProd.cart_quantity < 0) {
                            correctFlag = false;
                            break;
                        }
                        fetch(`http://localhost:3000/api/product/update/${currentProd._id}`,{
                            method: "PATCH",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            },
                            body: JSON.stringify({
                                quantity: `${currentProd.quantity - currentProd.cart_quantity}`
                            })
                        })
                        .then(response => response.json())
                        .then(result => {
                            if(result.type != "success") {
                                correctFlag = false;
                            }
                        })
                    }
                    if(correctFlag == true) {
                        infoAnnullato.style.backgroundColor = "transparent";
                        infoInCorso.style.backgroundColor = "transparent";
                        infoSpedito.style.backgroundColor = "#00FF3659";
                    }
                }
            })
        })
    }

    render = function (orders) {
        for(var i=0; i<orders.length; i++) {
            const row = document.createElement("div");
            row.className = "row";
            allOrders.appendChild(row);

            const image_div = document.createElement("div");
            image_div.className = "image";
            row.appendChild(image_div);

            const image = document.createElement("img");
            image.setAttribute("src","assets/pics/ordine.png");
            image_div.appendChild(image);

            const orderID = document.createElement("p");
            orderID.className = "name";
            orderID.innerHTML = "#" + orders[i].orderID;
            row.appendChild(orderID);

            const orderDate = document.createElement("p");
            orderDate.className = "name";
            orderDate.innerHTML = orders[i].date;
            row.appendChild(orderDate);

            const userName = document.createElement("p");
            userName.className = "tit-name";
            row.appendChild(userName);

            fetch(`http://localhost:3000/api/auth/getById/${orders[i].userID}`)
            .then(response => response.json())
            .then(result => userName.innerHTML = result.name + " " + result.surname)

            const curr_order = orders[i];

            row.addEventListener("click", () => {
                setCurrentOrder(curr_order, userName.innerHTML);
            })
        }
    }

    setAllOrders = function () {
        fetch("http://localhost:3000/api/order/getAll")
        .then(response => response.json())
        .then(result => render(result))
    }

    setAllOrders();
}

window.onload = () => {main();}