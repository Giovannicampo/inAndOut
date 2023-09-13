const main = () => {
    let cartContainer = document.getElementsByClassName("cart-container")[0];
    let paymentButton = document.getElementById("final-payment");
    let userID = "";
    let totalCost = 0;

    calcTotCost = function(products) {
        for(var i=0; i<products.length; i++) {
            totalCost += products[i].price * products[i].cart_quantity;
        }
    }

    // update function
    updateUser = function (message) {
        fetch("http://localhost:3000/api/auth/me")
        .then(response => response.json())
        .then(result => {
            if(result.type == "success") {
                userOn = true;
                console.log("user is on");
                fetch(`http://localhost:3000/api/cart/getByUserID/${result.user._id}`)
                .then(_response => _response.json())
                .then(_result => {
                    calcTotCost(_result[0].products);
                    const newDate = new Date();
                    const new_order = {
                        userID: result.user._id,
                        products: _result[0].products,
                        date: newDate.toUTCString(),
                        orderID: newDate.getTime(),
                        totalCost: totalCost.toFixed(2),
                        state: "in corso"
                    }
                    fetch("http://localhost:3000/api/order/post", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(new_order)
                })
                .then(response => response.json())
                .then(__result => {
                    console.log("cart id" + _result[0]._id);
                    console.log(__result);
                    if(__result.type == "success") {
                        message.innerHTML = "Pagamento riuscito! 🥳 <br><br>";
                        fetch(`http://localhost:3000/api/cart/payment/${_result[0]._id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            },
                            body: JSON.stringify([])
                        })
                        .then(response => response.json())
                        .then(result => console.log("empty cart" + result))
                    } else if(__result.type == "error") {
                        message.innerHTML = "Pagamento non riuscito! 😢 <br><br>";
                        window.location.href = "signin.html";
                    }
                })
                })
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

    setUserID = function(id) {
        userID = id;
    }

    init = function() {
        fetch("http://localhost:3000/api/auth/me")
        .then(response => response.json())
        .then(result => {
            if(result.type == "success") {
                userOn = true;
                setUserID(result.user._id);
                console.log("user is on");
                fetch(`http://localhost:3000/api/cart/getByUserID/${result.user._id}`)
                .then(_response => _response.json())
                .then(_result => {
                    cart = _result[0].products;
                    if(cart != []) {setUserID
                        for(var i=0; i<cart.length; i++) {
                            const current_product = cart[i];
                            renderCart(current_product);
                        }
                        renderTotale(cart);
                        renderUser(result.user);
                        setEvents(result.user);
                    }
                })
            } else if(result.type == "error"){
                window.location.href = "signin.html";
            }
        })
    }

    init();
}

window.onload = () => {main();}