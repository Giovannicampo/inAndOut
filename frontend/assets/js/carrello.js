const main = () => {

    let cartContainer = document.getElementsByClassName("cart-container")[0];
    let blankSpace = document.getElementsByClassName("blank-space")[0];
    let cart = [];
    let userOn = false;

    updateSumUpData = function (_cart = cart) {
        // sum up data
        const sumUpData = document.getElementById("sum-up-data");
        var tot_money = 0;
        for(var i=0; i<_cart.length; i++) {
            tot_money += _cart[i].price * _cart[i].cart_quantity;
        }
        sumUpData.innerHTML = `Totale €${tot_money.toFixed(2)}`;
    }

    render = function (product) {

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
                span.innerHTML = `qty: ${product.cart_quantity}&nbsp;`;
                quantity.appendChild(span);

                // select
                const select = document.createElement("select");
                select.setAttribute("name", "quantity");
                select.setAttribute("id", "qty");
                quantity.appendChild(select);

                select.addEventListener("click", () => {
                    product.cart_quantity = select.value;
                    span.innerHTML = `qty: ${select.value}&nbsp;`;
                    const new_cart = [];
                    for(var i=0; i<cart.length; i++) {
                        if(cart[i].name == product.name) {
                            cart[i].cart_quantity = select.value;
                        }
                        new_cart.push(cart[i]);
                    }
                    if(userOn) {
                        window.localStorage.setItem("userCart", JSON.stringify(new_cart));
                        console.log(JSON.parse(window.localStorage.getItem("userCart")));
                        fetch("http://localhost:3000/api/auth/protected/update", {
                        method: "PATCH",
                        headers: {
                            "Authorization": `Bearer ${auth.accessToken}`,
                            "Content-type": "application/json; charset=UTF-8"
                        },
                        body: JSON.stringify({cart: new_cart})
                        })
                        .then(response => response.json())
                        .then(result => {console.log(result.type);})
                    } else {
                        window.localStorage.setItem("cart", JSON.stringify(new_cart));
                        console.log(JSON.parse(window.localStorage.getItem("cart")));
                    }
                    updateSumUpData(new_cart);
                })

                    // option
                    var num_options = product.quantity >= 10 ? 10 : product.quantity;
                    const options = [];
                    for(var i=0; i<num_options; i++) {
                        options.push(document.createElement("option"));
                        options[i].setAttribute("value", `${i+1}`);
                        options[i].innerHTML = `${i+1}`;
                        select.appendChild(options[i]);
                    }

            // X
            const X = document.createElement("div");
            X.setAttribute("id", "X");
            X.innerHTML = "x";
            cartProduct.appendChild(X);

            X.addEventListener("click", () => {
                cartContainer.removeChild(cartProduct);
                const new_cart = [];
                for(var i=0; i<cart.length; i++) {
                    if(cart[i].name == product.name) {
                        continue;
                    }
                    new_cart.push(cart[i]);
                }

                if(userOn) {
                    window.localStorage.setItem("userCart", JSON.stringify(new_cart));
                    console.log(JSON.parse(window.localStorage.getItem("userCart")));
                    fetch("http://localhost:3000/api/auth/protected/update", {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${auth.accessToken}`,
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({cart: new_cart})
                    })
                    .then(response => response.json())
                    .then(result => {console.log(result.type);})
                } else {
                    window.localStorage.setItem("cart", JSON.stringify(new_cart));
                    console.log(JSON.parse(window.localStorage.getItem("cart")));
                }
                updateSumUpData(new_cart);
            })

            // blank
            const blank = document.createElement("div");
            blank.className = "blank";
            cartProduct.appendChild(blank);

            // update money
            updateSumUpData();
    }

    setEvents = function () {
        const paymentButton = document.getElementById("payment-button");

        const auth = JSON.parse(window.localStorage.getItem("auth"));
        // console.log(auth.accessToken);
        if(auth.accessToken != "") {
            paymentButton.setAttribute("href", "payment.html");
        }
        else
        paymentButton.setAttribute("href", "signup.html");
    }

    init_cart = function(_cart) {
        cart = _cart;
    }

    init = function () {
        const auth = JSON.parse(window.localStorage.getItem("auth"));
        cart = JSON.parse(window.localStorage.getItem("cart"));

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

                    console.log(cart);
                    if (cart.length > 0) {
                        cartContainer.removeChild(blankSpace);
                    }
                    if(cart != []) {
                        for(var i=0; i<cart.length; i++) {
                            const current_product = cart[i];
                            render(current_product);
                        }
                    }
                }
            })
        }
        console.log(cart);
        if (cart.length > 0) {
            cartContainer.removeChild(blankSpace);
        }
        if(cart != []) {
            for(var i=0; i<cart.length; i++) {
                const current_product = cart[i];
                render(current_product);
            }
        }
    }

    init();
    setEvents();

    let signButton = document.getElementById("sign");
    const auth = JSON.parse(window.localStorage.getItem("auth"));
    
    if(auth.accessToken !== "") {
        signButton.innerHTML = "Profilo 👤";
        signButton.setAttribute("href", "profile.html");
    } else {
        signButton.innerHTML = "Sign up";
        signButton.setAttribute("href", "signup.html");
    }
}

window.onload = () => {main();}