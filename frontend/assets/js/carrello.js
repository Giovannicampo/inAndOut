const main = () => {

    let cartContainer = document.getElementsByClassName("cart-container")[0];

    updateSumUpData = function () {
        // sum up data
        const sumUpData = document.getElementById("sum-up-data");
        const cart = JSON.parse(window.localStorage.getItem("cart"));
        var tot_money = 0;
        for(var i=0; i<cart.length; i++) {
            tot_money += cart[i].price * cart[i].cart_quantity;
        }
        sumUpData.innerHTML = `Totale ${tot_money.toFixed(2)};`
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
            price.innerHTML = product.price;
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
                    const cart = JSON.parse(window.localStorage.getItem("cart"));
                    const new_cart = [];
                    for(var i=0; i<cart.length; i++) {
                        if(cart[i].name == product.name) {
                            cart[i].cart_quantity = select.value;
                        }
                        new_cart.push(cart[i]);
                    }
                    window.localStorage.setItem("cart", JSON.stringify(new_cart));
                    console.log(window.localStorage.getItem("cart"));
                    updateSumUpData();
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
                const cart = JSON.parse(window.localStorage.getItem("cart"));
                const new_cart = [];
                for(var i=0; i<cart.length; i++) {
                    if(cart[i].name == product.name) {
                        continue;
                    }
                    new_cart.push(cart[i]);
                }
                window.localStorage.setItem("cart", JSON.stringify(new_cart));
                console.log(window.localStorage.getItem("cart"));
                updateSumUpData();
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
        console.log(auth);
        if(auth == true) {
            paymentButton.setAttribute("href", "payment.html");
        }
        else
        paymentButton.setAttribute("href", "signup.html");
    }

    init = function () {
        const cart = JSON.parse(window.localStorage.getItem("cart"));
        console.log(cart);
        if(cart != []) {
            for(var i=0; i<cart.length; i++) {
                const current_product = cart[i];
                render(current_product);
            }
        }
    }

    init();
    setEvents();
}

window.onload = () => {main();}