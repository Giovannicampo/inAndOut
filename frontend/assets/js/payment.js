const main = () => {
    let cartContainer = document.getElementsByClassName("cart-container")[0];
    let paymentButton = document.getElementById("final-payment");
    let auth = JSON.parse(window.localStorage.getItem("auth"));

    // update function
    updateUser = function (message) {
        const user_cart = JSON.parse(window.localStorage.getItem("userCart"));
        const user_orders = JSON.parse(window.localStorage.getItem("userOrders"));
        const newDate = new Date();
        const new_order = {
            products: user_cart,
            date: newDate.toUTCString(),
            orderID: newDate.getTime()
        }
        user_orders.push(new_order);
        fetch("http://localhost:3000/api/auth/protected/update", {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${auth.accessToken}`,
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({orders: user_orders, cart: []})
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if(result.type == "success") {
                        window.localStorage.setItem("userCart", JSON.stringify([]));
                        window.localStorage.setItem("userOrders", JSON.stringify(user_orders));
                        message.innerHTML = "Pagamento riuscito! 🥳 <br><br>";
                    } else if(result.type == "error") {
                        message.innerHTML = "Pagamento non riuscito! 😢 <br><br>";
                        window.localStorage.setItem("auth",JSON.stringify({accessToken: ""}))
                        window.location.href = "signin.html";
                    }
                })
    }

    renderTotale = function (cart) {
        const totale = document.getElementById("totale");
        var tot_money = 0;
        for(var i=0; i<cart.length; i++) {
            tot_money += cart[i].price * cart[i].cart_quantity;
        }
        totale.innerHTML = `Totale €${tot_money.toFixed(2)}`;
        if(tot_money == 0.0) {
            window.location.href = "carrello.html";
        }
    }

    renderCart = function (product) {

        // cart product
        const cartProduct = document.createElement("div");
        cartProduct.className = "cart-product";
        cartContainer.appendChild(cartProduct);

            // image
            const imageDiv = document.createElement("div");
            imageDiv.setAttribute("id", "image");
            cartProduct.appendChild(imageDiv);

                const img = document.createElement("img");
                img.setAttribute("src", product.image);
                imageDiv.appendChild(img);

            // name
            const name = document.createElement("div");
            name.setAttribute("id", "name");
            name.innerHTML = product.name;
            cartProduct.appendChild(name);

            // category
            const category = document.createElement("div");
            category.setAttribute("id", "category");
            category.innerHTML = product.maincategory + " - " + product.category;
            cartProduct.appendChild(category);

            // price
            const price = document.createElement("div");
            price.setAttribute("id", "price");
            price.innerHTML = "€" + product.price;
            cartProduct.appendChild(price);

            // quantity
            const quantity = document.createElement("div");
            quantity.setAttribute("id", "quantity");
            cartProduct.appendChild(quantity);

                // span
                const span = document.createElement("span");
                span.style.color = "#fff";
                span.style.fontSize = "25px";
                span.innerHTML = `Quantità: ${product.cart_quantity}&nbsp;`;
                quantity.appendChild(span);

            // blank1
            const blank1 = document.createElement("div");
            blank1.className = "blank";
            cartProduct.appendChild(blank1);

            // blank2
            const blank2 = document.createElement("div");
            blank2.className = "blank";
            cartProduct.appendChild(blank2);
    }

    renderUser = function(user) {
        const email = document.getElementById("email");
        const address = document.getElementById("address-data");
        const payment = document.getElementById("payment-data");

        email.innerHTML = user.email;
        address.innerHTML = `${user.deliveryInfo.address} ${user.deliveryInfo.postalCode} ${user.deliveryInfo.country}`;
        payment.innerHTML = `${user.paymentCard.numberCard} ${user.paymentCard.expirationDate}`
    }

    errorRender = function(text) {
        const success = document.createElement("div");
        success.className = "success";
        success.style.top = `${(window.innerHeight/2) - 150}px`;
        success.style.left = `${(window.innerWidth/2) - 250}px`;
        cartContainer.appendChild(success);

        // X
        const X = document.createElement("p");
        X.className = "x-button";
        success.appendChild(X);

        const x = document.createElement("span");
        x.innerHTML = "x&nbsp;&nbsp;&nbsp";
        x.style.color = "#517965";
        X.appendChild(x);

        x.addEventListener("click", () => {
            cartContainer.removeChild(success);
        })

        // message
        const message = document.createElement("p");
        message.innerHTML = text;
        message.className = "message";
        success.appendChild(message);

        // br
        const br = document.createElement("br");
        success.appendChild(br);

        // link
        const link = document.createElement("p");
        link.className = "link";
        success.appendChild(link);

        const l = document.createElement("span");
        l.innerHTML = "Vai al profilo";
        link.appendChild(l);

        l.addEventListener("click", () => {
            window.location.href = "profile.html";
        })
    }

    successRender = function() {
        const success = document.createElement("div");
        success.className = "successsuccess";
        success.style.top = `${(window.innerHeight/2) - 250}px`;
        success.style.left = `${(window.innerWidth/2) - 350}px`;
        cartContainer.appendChild(success);

        // X
        const X = document.createElement("p");
        X.className = "x-button";
        success.appendChild(X);

        const x = document.createElement("span");
        x.innerHTML = "x&nbsp;&nbsp;&nbsp";
        x.style.color = "#517965";
        X.appendChild(x);

        x.addEventListener("click", () => {
            cartContainer.removeChild(success);
            window.location.href = "profile.html";
        })

        // message
        const message = document.createElement("p");
        message.innerHTML = "Pagamento in corso... <br><br>";
        message.className = "messagesuccess";
        success.appendChild(message);

        const p = document.createElement("p");
        p.style.textAlign = "center";
        success.appendChild(p);

        const image = document.createElement("img");
        image.setAttribute("src", "assets/pics/header_logo.png");
        image.className = "imagesuccess";
        p.appendChild(image);

        const interval = setInterval(() => {
            clearInterval(interval);
            updateUser(message);
            // aggiornare utente e ripulire carrello
        },3000);

    }

    setEvents = function (user) {
        paymentButton.addEventListener("click", () => {
            if(user.deliveryInfo.address == "" || user.deliveryInfo.postalCode == "" ||
               user.deliveryInfo.country == "" || user.paymentCard.numberCard == "" ||
               user.paymentCard.expirationDate == "" || user.paymentCard.pass == "") {
                errorRender("Indirizzo o carta mancanti!")
                return;
               }
            successRender();
        })
    }

    init = function() {

        if(auth.accessToken !== "") {
            fetch("http://localhost:3000/api/auth/protected", {
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`
                }
            })
            .then(response => response.json())
            .then(result => {
                if(result.type == "success") {
                    userOn = true;
                    console.log("user is on");
                    const user_cart = JSON.parse(window.localStorage.getItem("userCart"));
                    cart = user_cart;
                    if(cart != []) {
                        for(var i=0; i<cart.length; i++) {
                            const current_product = cart[i];
                            renderCart(current_product);
                        }
                        renderTotale(cart);
                        renderUser(result.user);
                        setEvents(result.user);
                    }
                } else if(result.type == "error"){
                    window.localStorage.setItem("auth", JSON.stringify({accessToken: ""}));
                    window.location.href = "signin.html";
                }
            })
        }
    }

    init();
}

window.onload = () => {main();}