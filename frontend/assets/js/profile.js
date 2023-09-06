const main = () => {
    const accessToken = JSON.parse(window.localStorage.getItem("auth")).accessToken;
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
        fetch("http://localhost:3000/api/auth/protected/update", {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
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
                        window.localStorage.setItem("auth",JSON.stringify({accessToken: ""}))
                        window.location.href = "signin.html";
                    }
                })
    }

    updatePassword = function (password) {
        fetch("http://localhost:3000/api/auth/protected/update/password", {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
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
                        window.localStorage.setItem("auth",JSON.stringify({accessToken: ""}))
                        window.location.href = "signin.html";
                    } else if(result.type == "error_pass") {
                        alert(result.message);
                    }
                })
    }

    render = function(user) {
        console.log(user);

        nomeCognome.innerHTML = `&nbsp;&nbsp;${user.name} ${user.surname}`;
        email.innerHTML = user.email;
        address.innerHTML = `${user.deliveryInfo.address} ${user.deliveryInfo.postalCode} ${user.deliveryInfo.country}`;
        payment.innerHTML = `${user.paymentCard.numberCard}`;
    }

    renderOrders = function(orders) {
        console.log(orders);
        for(var i=0; i<orders.length; i++) {
            const current_order = orders[i];
            const current_products = current_order.products;
            const current_date = current_order.date;
            const current_orderID = current_order.orderID;
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

                const products = document.createElement("div");
                products.className = "products";
                orderElement.appendChild(products);

                    for(var j=0; j<current_products.length; j++) {
                        price += current_products[j].price;
                        const prod = document.createElement("p");
                        prod.innerHTML = `${current_products[j].name} - ${current_products[j].cart_quantity} - ${current_products[j].maincategory} ${current_products[j].category}`;
                        products.appendChild(prod);
                    }
                
                const totalMoney = document.createElement("div");
                totalMoney.className = "totalmoney";
                totalMoney.innerHTML = "€" + price.toFixed(2);
                orderElement.appendChild(totalMoney);

                const orderNumber = document.createElement("div");
                orderNumber.className = "order-number";
                orderNumber.innerHTML = "ID " + current_orderID;
                orderElement.appendChild(orderNumber);

                const blank = document.createElement("div");
                blank.className = "blank";
                orderElement.appendChild(blank);



        }
    }

    modalRender = function(text, type, input1, input2, input3) {
        const modal = document.getElementsByClassName("container")[0];
        const success = document.createElement("div");
        success.className = "success";
        success.style.top = `${(window.innerHeight/2) - 150}px`;
        success.style.left = `${(window.innerWidth/2) - 250}px`;
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
                if(input_2.value !== input_1.value) return;
                const _password = {
                    oldpassword: input_2.value,
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
                        "Password", "Inserisci vecchia password", "Inserisci di nuovo vecchia password", "Inserisci nuova password");
        })

        signOut.addEventListener("click", () => {
            window.localStorage.setItem("auth", JSON.stringify({accessToken: ""}));
            window.location.href = "signin.html";
        })
    }

    init = function () {
        // get data from API
        fetch("http://localhost:3000/api/auth/protected", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(result => {
            if(result.type == "success") {
                window.localStorage.setItem("userCart", JSON.stringify(result.user.cart));
                window.localStorage.setItem("userOrders", JSON.stringify(result.user.orders));
                current_email = result.user.email;
                render(result.user);
                renderOrders(result.user.orders);
            } else if(result.type == "error") {
                console.log(result.message);
                window.localStorage.setItem("auth",JSON.stringify({accessToken: ""}));
                window.location.href = "signin.html";
            }
        })
    }

    init();
    setEvents();
}

window.onload = () => {main();}