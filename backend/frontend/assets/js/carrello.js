const main = () => {

    let cartContainer = document.getElementsByClassName("cart-container")[0];
    let cart = [];
    let userOn = false;
    let userID = "";

    updateSumUpData = function (_cart) {
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
                        fetch(`http://localhost:3000/api/cart/getByUserID/${userID}`)
                            .then(response => response.json())
                            .then(result => {
                                const cartID = result[0]._id;
                                fetch(`http://localhost:3000/api/cart/update/${cartID}`, {
                                    method: "PATCH",
                                    headers: {
                                        "Content-type": "application/json; charset=UTF-8"
                                    },
                                    body: JSON.stringify({ products: new_cart})
                                })
                                .then(response => response.json())
                                .then(result => {
                                    console.log(result);
                                    updateSumUpData(new_cart);
                                })
                            })
                    } else {
                        localStorage.setItem("cart", JSON.stringify(new_cart));
                        console.log(JSON.parse(localStorage.getItem("cart")));
                        updateSumUpData(new_cart);
                    }
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
                    fetch(`http://localhost:3000/api/cart/getByUserID/${userID}`)
                    .then(response => response.json())
                    .then(result => {
                        const cartID = result[0]._id;
                        fetch(`http://localhost:3000/api/cart/update/${cartID}`, {
                            method: "PATCH",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            },
                            body: JSON.stringify({ products: new_cart})
                        })
                        .then(response => response.json())
                        .then(result => {
                            console.log(result);
                            updateSumUpData(new_cart);
                        })
                    })
                } else {
                    window.localStorage.setItem("cart", JSON.stringify(new_cart));
                    updateSumUpData(new_cart);
                }
            })

            // blank
            const blank = document.createElement("div");
            blank.className = "blank";
            cartProduct.appendChild(blank);

            // update money
            updateSumUpData(cart);
    }

    init_cart = function(_cart) {
        cart = _cart;
    }

    setUserID = function (id) {
        userID = id;
    }

    setUserOn = function (flag) {
        userOn = flag;
    }

    init = function () {
        const paymentButton = document.getElementById("payment-button");
        if(JSON.parse(localStorage.getItem("cart")) == null) {
            localStorage.setItem("cart", JSON.stringify([]));
        }
        cart = JSON.parse(localStorage.getItem("cart"));
        // console.log(cart);

        fetch("http://localhost:3000/api/auth/me")
        .then(response => response.json())
        .then(result => {
            if(result.type == "success") {
                setUserOn(true);
                paymentButton.setAttribute("href", "payment.html");
                setUserID(result.user._id);
                console.log("user is on");
                fetch(`http://localhost:3000/api/cart/getByUserID/${result.user._id}`)
                .then(_response => _response.json())
                .then(_result => {
                    const cartID = _result[0]._id;
                    
                    if(_result[0].products.length < 1 && cart.length > 0) {
                        fetch(`http://localhost:3000/api/cart/update/${cartID}`, {
                            method: "PATCH",
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            },
                            body: JSON.stringify({ products: cart})
                        })
                        .then(response => response.json())
                        .then(result => {
                            console.log(result);
                            localStorage.setItem("cart", JSON.stringify([]));
                        })
                    } else {
                        init_cart(_result[0].products);
                        cart = _result[0].products;
                    }
                    
                    console.log(cart);
                    if (cart.length > 0) {
                        for(var i=0; i<cart.length; i++) {
                            const current_product = cart[i];
                            render(current_product);
                        }
                    }
                });
            } else {
                paymentButton.setAttribute("href", "signup.html");
                if (cart.length > 0) {
                    for(var i=0; i<cart.length; i++) {
                        const current_product = cart[i];
                        render(current_product);
                    }
                }
            }
        })

    }

    init();

    let signButton = document.getElementById("sign");

    fetch("http://localhost:3000/api/auth/me")
    .then(response => response.json())
    .then(result => {
        if(result.type == "success") {
            signButton.innerHTML = `${result.user.name} 👤`;
            signButton.setAttribute("href", "profile.html");
        }
    })
    .catch(err => {
        signButton.innerHTML = "Sign up";
        signButton.setAttribute("href", "signup.html");
    })
}

window.onload = () => {main();}