const main = () => {
    let nomeCognome = document.getElementById("profile-name");
    let email = document.getElementById("email");
    let address = document.getElementById("address-data");
    let payment = document.getElementById("payment-data");
    let current_email;

    // buttons
    let changeAddress = document.getElementById("change-address");
    let changePayment = document.getElementById("change-payment");
    let changeEmail = document.getElementById("change-email");
    let changePassword = document.getElementById("change-password");
    let signOut = document.getElementById("sign-out");

    // orders
    let orderContainer = document.getElementsByClassName("order-container")[0];

    // update function
    updateUser = function (delivery) {
        fetch("http://localhost:3000/api/auth/update", {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(delivery)
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if(result.type == "success") {
                        render(result.user);
                    } else if(result.type == "error") {
                        console.log(result.message);
                        window.location.href = "signin.html";
                    }
                })
    }

    updatePassword = function (password) {
        fetch("http://localhost:3000/api/auth/update/password", {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(password)
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if(result.type == "success") {
                        render(result.user);
                    } else if(result.type == "error") {
                        console.log(result.message);
                        window.location.href = "signin.html";
                    } else if(result.type == "error_pass") {
                        alert(result.message);
                    }
                })
    }

    render = function(user) {
        console.log(user);

        nomeCognome.innerHTML = `${user.name} ${user.surname}`;
        email.innerHTML = user.email;
        address.innerHTML = `${user.deliveryInfo.address} ${user.deliveryInfo.postalCode} ${user.deliveryInfo.country}`;
        payment.innerHTML = `${user.paymentCard.numberCard}`;
    }

    renderCurrentOrder = function (order) {
        const container = document.getElementsByClassName("container")[0];

        const detailsContainer = document.createElement("div");
        detailsContainer.style.top = `${window.innerHeight/2 - 500}px`;
        detailsContainer.style.left = `${window.innerWidth/2 - 650}px`;
        if(window.innerWidth <= 1296) {
            detailsContainer.style.top = `${window.innerHeight/2 - 250}px`;
            detailsContainer.style.left = `${window.innerWidth/2 - 325}px`;
        }
        if(window.innerWidth <= 800) {
            detailsContainer.style.top = `${window.innerHeight/2 - 216}px`;
            detailsContainer.style.left = `${window.innerWidth/2 - 221}px`;
        }
        detailsContainer.className = "details-container";
        container.appendChild(detailsContainer);

        const firstRow = document.createElement("div");
        firstRow.className = "first-row";
        detailsContainer.appendChild(firstRow);

        const title = document.createElement("div");
        title.innerHTML = `Dettagli dell'ordine #${order.orderID}`;
        title.className = "title";
        firstRow.appendChild(title);

        const X = document.createElement("div");
        X.className = "X";
        firstRow.appendChild(X);

        const _x = document.createElement("span");
        _x.innerHTML = "x &nbsp;&nbsp;";
        X.appendChild(_x);

        X.addEventListener("click", () => {
            container.removeChild(detailsContainer);
        })

        const secondRow = document.createElement("div");
        secondRow.className = "second-row";
        detailsContainer.appendChild(secondRow);

        const info = document.createElement("div");
        info.className = "info";
        secondRow.appendChild(info);

        const date = document.createElement("p");
        date.innerHTML = order.date;
        info.appendChild(date);

        const price = document.createElement("p");
        price.innerHTML = "€" + order.totalCost;
        info.appendChild(price);

        const state = document.createElement("p");
        state.innerHTML = order.state;
        info.appendChild(state);

        if(order.state == "in corso") {
            state.style.color = "orange";
        }

        switch(order.state) {
            case "in corso":
                state.style.color = "orange";
                break;
            case "annullato":
                state.style.color = "red";
                break;
            case "spedito":
                state.style.color = "green";
                break;
        }

        const products = document.createElement("div");
        products.className = "products";
        secondRow.appendChild(products);

        for(var i=0; i<order.products.length; i++) {
            const row = document.createElement("div");
            row.className = "row";
            products.appendChild(row);

            const image_div = document.createElement("div");
            image_div.className = "image";
            row.appendChild(image_div);

            const image = document.createElement("img");
            image.setAttribute("src",order.products[i].image);
            image_div.appendChild(image);

            const prod_name = document.createElement("p");
            prod_name.className = "name";
            prod_name.innerHTML = order.products[i].name;
            row.appendChild(prod_name);

            const quantity = document.createElement("p");
            quantity.className = "quantity";
            quantity.innerHTML = "qty " + order.products[i].cart_quantity;
            row.appendChild(quantity);

            const prod_price = document.createElement("p");
            prod_price.className = "price";
            prod_price.innerHTML = "€" + (order.products[i].price * order.products[i].cart_quantity);
            row.appendChild(prod_price);
        }
    }

    renderOrders = function(orders) {
        console.log(orders);
        for(var i=0; i<orders.length; i++) {
            const current_order = orders[i];
            const current_products = current_order.products;
            const current_tot_money = current_order.totalCost;
            const current_date = current_order.date;
            const current_orderID = current_order.orderID;
            const current_state = current_order.state;
            let price = 0;

            const orderElement = document.createElement("div");
            orderElement.className = "order-element";
            orderContainer.appendChild(orderElement);

                const blank1 = document.createElement("div");
                blank1.className = "blank";
                orderElement.appendChild(blank1);

                const date = document.createElement("div");
                date.className = "date";
                date.innerHTML = current_date;
                orderElement.appendChild(date);
                
                const totalMoney = document.createElement("div");
                totalMoney.className = "totalmoney";
                totalMoney.innerHTML = "€" + current_tot_money;
                orderElement.appendChild(totalMoney);

                const orderNumber = document.createElement("div");
                orderNumber.className = "order-number";
                orderNumber.innerHTML = "ID #" + current_orderID;
                orderElement.appendChild(orderNumber);

                let color_state;
                switch(current_state) {
                    case "in corso":
                        color_state = "state-in-corso";
                        break;
                    case "spedito":
                        color_state = "state-done";
                        break;
                    case "annullato":
                        color_state = "state-annullato";
                        break;
                }
                const orderState = document.createElement("div");
                orderState.className = color_state;
                orderState.innerHTML = current_state;
                orderElement.appendChild(orderState);

            orderElement.addEventListener("click", () => {
                renderCurrentOrder(current_order);
            })

        }
    }

    modalRender = function(text, type, input1, input2, input3) {
        const modal = document.getElementsByClassName("container")[0];
        const success = document.createElement("div");
        success.className = "success";
        success.style.top = `${(window.innerHeight/2) - 150}px`;
        success.style.left = `${(window.innerWidth/2) - 350}px`;
        if(window.innerWidth <= 985) {
            success.style.top = `${(window.innerHeight/2) - 166}px`;
            success.style.left = `${(window.innerWidth/2) - 233}px`;
        }
        console.log((window.innerWidth/2) - 250);
        modal.appendChild(success);

        // X
        const X = document.createElement("p");
        X.className = "x-button";
        success.appendChild(X);

        const x = document.createElement("span");
        x.innerHTML = "x&nbsp;&nbsp;&nbsp";
        x.style.color = "#517965";
        X.appendChild(x);

        x.addEventListener("click", () => {
            modal.removeChild(success);
        })

        // message
        const message = document.createElement("p");
        message.innerHTML = text;
        message.className = "message";
        success.appendChild(message);

        // p1
        const p1 = document.createElement("p");
        p1.style.textAlign = "center";
        success.appendChild(p1);

        // input1
        const input_1 = document.createElement("input");
        input_1.className = "input-modal";
        input_1.setAttribute("placeholder", `${input1}`);
        p1.appendChild(input_1);

        // p2
        const p2 = document.createElement("p");
        p2.style.textAlign = "center";
        success.appendChild(p2);

        // input2
        const input_2 = document.createElement("input");
        input_2.className = "input-modal";
        input_2.setAttribute("placeholder", `${input2}`);
        p2.appendChild(input_2);

        // p3
        const p3 = document.createElement("p");
        p3.style.textAlign = "center";
        success.appendChild(p3);

        // input3
        const input_3 = document.createElement("input");
        input_3.className = "input-modal";
        input_3.setAttribute("placeholder", `${input3}`);
        p3.appendChild(input_3);

        // p4
        const p4 = document.createElement("p");
        p4.style.textAlign = "center";
        success.appendChild(p4);

        // button
        const invia = document.createElement("button");
        invia.className = "button-modal";
        invia.innerHTML = "Invia";
        p4.appendChild(invia);

        invia.addEventListener("click", () => {
            if(input_1.value == "" || input_2.value == "" || input_3.value == "") {
                return;
            }
            switch(type) 
            {
                case `Address`:
                const delivery = {
                    deliveryInfo: {
                        address: input_1.value,
                        postalCode: input_2.value,
                        country: input_3.value
                    }
                }
                updateUser(delivery);
                break;

                case `Payment`:
                const payment = {
                    paymentCard: {
                        numberCard: input_1.value,
                        expirationDate: input_2.value,
                        pass: input_3.value
                    }
                }
                updateUser(payment)
                break;

                case `Email`:
                if(input_2.value !== input_3.value || 
                    input_1.value !== current_email) return;
                const _email = {
                    email: input_3.value
                }
                updateUser(_email);
                break;

                case `Password`:
                if(input_2.value !== input_3.value) return;
                const _password = {
                    oldpassword: input_1.value,
                    newpassword: input_3.value
                }
                updatePassword(_password);
                break;
            }
            modal.removeChild(success);
        })
    }

    setEvents = function () {
        changeAddress.addEventListener("click", () => {
            modalRender("Inserisci nuovo indirizzo, codice postale e paese",
                        "Address", "Indirizzo", "Codice postale", "Paese");
        })

        changePayment.addEventListener("click", () => {
            modalRender("Inserisci nuovo metodo di pagamento",
                        "Payment", "Card Number", "Expiration Date", "Secret number");
        })

        changeEmail.addEventListener("click", () => {
            modalRender("Inserisci nuova email",
                        "Email", "Inserisci vecchia email", "Inserisci nuova email", "Inserisci nuova email");
        })

        changePassword.addEventListener("click", () => {
            modalRender("Inserisci nuova password",
                        "Password", "Inserisci vecchia password", "Inserisci nuova password", "Inserisci nuova password");
        })

        signOut.addEventListener("click", () => {
            fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({})
            })
            .then(result => result.json())
            .then(response => {
                console.log(response)
                if(response.type == "success")
                    window.location.href = "signin.html";
            })
            // window.location.href = "signin.html";
        })
    }

    init = function () {
        // get data from API
        fetch("http://localhost:3000/api/auth/me")
        .then(response => response.json())
        .then(result => {
            if(result.type == "success") {
                console.log(result.user);
                current_email = result.user.email;
                render(result.user);
                fetch(`http://localhost:3000/api/order/getByUserID/${result.user._id}`)
                .then(response => response.json())
                .then(result => renderOrders(result))
                .catch(console.log(err => "no orders or error!"))
            } else if(result.type == "error") {
                console.log(result.message);
                window.location.href = "signin.html";
            }
        })
    }

    init();
    setEvents();
}

window.onload = () => {main();}