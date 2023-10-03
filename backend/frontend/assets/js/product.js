const main = () => {

    let rows = [];
    let numRows = 0;
    let container = document.getElementById("product-container");
    let cards = [];
    let main_container;
    let userOn = false;
    let userID = "";
    let cart = JSON.parse(localStorage.getItem("cart"));

     // on click of card
     product_details = function (product) {

        main_container = document.getElementById("main-container");

        // rendering of prod-card
        const prod_details = document.createElement("div");
        prod_details.style.top = `${window.innerHeight/2 - 300}px`;
        prod_details.style.left = `${window.innerWidth/2 - 500}px`;
        if(innerWidth <= 870) {
            prod_details.style.top = `${window.innerHeight/2 - 200}px`;
            prod_details.style.left = `${window.innerWidth/2 - 275}px`;
        }
        prod_details.setAttribute("id", "product-details");
        main_container.appendChild(prod_details);

            // prod card
            const prod_card = document.createElement("div");
            prod_card.className = "prod-card";
            prod_details.appendChild(prod_card);

                // blank
                const blank = document.createElement("div");
                blank.className = "blank";
                prod_card.appendChild(blank);

                // prod image
                const prod_image = document.createElement("div");
                prod_image.className = "prod-image";
                prod_card.appendChild(prod_image);

                    // img
                    const img = document.createElement("img");
                    img.setAttribute("src", product.image);
                    prod_image.appendChild(img);

                // text
                const text = document.createElement("div");
                text.className = "text";
                prod_card.appendChild(text);

                    // prod title
                    const prod_title = document.createElement("p");
                    prod_title.setAttribute("id", "prod-title");
                    prod_title.innerHTML = product.name;
                    text.appendChild(prod_title);

                    // prod category
                    const prod_category = document.createElement("p");
                    prod_category.setAttribute("id", "prod-category");
                    prod_category.innerHTML = product.maincategory + " - " + product.category;
                    text.appendChild(prod_category);

                    // prod price
                    const prod_price = document.createElement("p");
                    prod_price.setAttribute("id", "prod-price");
                    prod_price.innerHTML = "€" + product.price;
                    text.appendChild(prod_price);

                // blank
                const blank2 = document.createElement("div");
                blank2.className = "blank";
                prod_card.appendChild(blank2);

            // add cart
            const add_cart = document.createElement("div");
            add_cart.className = "add-cart";
            prod_details.appendChild(add_cart);

                // X container
                const X = document.createElement("p");
                X.setAttribute("id", "X");
                add_cart.appendChild(X);

                    // X button
                    const x_button = document.createElement("span");
                    x_button.innerHTML = "x";
                    x_button.setAttribute("id", "x-button");
                    X.appendChild(x_button);

                    x_button.addEventListener("click", () => {
                        main_container.removeChild(prod_details);
                        return;
                    })

                // prod description
                const prod_description = document.createElement("p");
                prod_description.setAttribute("id", "prod-description");
                prod_description.innerHTML = product.description;
                add_cart.appendChild(prod_description);

                // availability
                const available = document.createElement("div");
                available.setAttribute("id", "availability");
                add_cart.appendChild(available);
                if(product.quantity <= 0) {
                    available.innerHTML = "Prodotto non disponibile";
                }
                else {
                    const qty = document.createElement("span");
                    qty.style.color = "#517965";
                    qty.style.fontSize = "20px";
                    qty.innerHTML = "quantità: ";
                    available.appendChild(qty);
                    
                    const selection = document.createElement("select");
                    selection.setAttribute("id", "qty");
                    available.appendChild(selection);

                    selection.addEventListener("click", () => {
                        blank3.innerHTML = "";
                    })

                        var num_options = product.quantity >= 10 ? 10 : product.quantity;
                        const options = [];
                        for(var i=0; i<num_options; i++) {
                            options.push(document.createElement("option"));
                            options[i].setAttribute("value", `${i+1}`);
                            options[i].innerHTML = `${i+1}`;
                            selection.appendChild(options[i]);
                        }

                        // space
                        const space = document.createElement("span");
                        space.innerHTML = "&nbsp;";
                        available.appendChild(space);

                        // button
                        const cart_button = document.createElement("button");
                        cart_button.setAttribute("id", "add");
                        cart_button.innerHTML = "&nbsp;Aggiungi al carrello&nbsp;";
                        available.appendChild(cart_button);

                // blank
                const blank3 = document.createElement("div");
                blank3.className = "blank ";
                blank3.style.color = "#828282";
                blank3.style.fontSize = "20px";
                add_cart.appendChild(blank3);

                        // event button save to cart
                        cart_button.addEventListener("click", () => {
                            const current_product = {
                                name: product.name,
                                cart_quantity: selection.value,
                                _id: product._id,
                                quantity: product.quantity,
                                maincategory: product.maincategory,
                                category: product.category,
                                image: product.image,
                                price: product.price
                            };
                            for (p of cart) {
                                if(p.name == current_product.name) {
                                    var sum = Number.parseInt(p.cart_quantity) + Number.parseInt(current_product.cart_quantity);
                                    if(sum <= 10) {
                                        p.cart_quantity = JSON.stringify(sum);
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
                                                    body: JSON.stringify({ products: cart})
                                                })
                                                .then(response => response.json())
                                                .then(result => console.log(result))
                                            })
                                        } else {
                                            localStorage.setItem("cart",JSON.stringify(cart));
                                            console.log(localStorage.getItem("cart"));
                                        }
                                        blank3.innerHTML = `Prodotto inserito correttamente nel carrello <br> ${current_product.name} - ${sum} pcs`;
                                    }
                                    else {
                                        blank3.innerHTML ="Massimo 10 unità per ordine";
                                    }
                                    return;
                                }
                            }
                            cart.push(current_product);
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
                                            body: JSON.stringify({ products: cart})
                                        })
                                        .then(response => response.json())
                                        .then(result => console.log(result))
                                    })
                            } else {
                                localStorage.setItem("cart",JSON.stringify(cart));
                                console.log(localStorage.getItem("cart"));
                            }
                            blank3.innerHTML = `Prodotto inserito correttamente nel carrello <br> ${current_product.name} - ${current_product.cart_quantity} pcs`;
                        })
                }
     }

    render = function (products) {
        console.log("rendering");

        let size = products.length;
        // size = 10;
        // console.log(size);
        // console.log(products[0]);
        numRows = Math.ceil(size/2);
        console.log(numRows);
        
        for(var i=0; i<size; i++) {
            cards[i] = document.createElement("div");
            cards[i].className = "card";

            // blank
            const blank = document.createElement("div");
            blank.className = "blank";
            cards[i].appendChild(blank);

            // image
            const image_div = document.createElement("div");
            image_div.className = "image";
            const image = document.createElement("img");
            image.setAttribute("src", products[i].image);
            image_div.appendChild(image);
            cards[i].appendChild(image_div);

            // title
            const title = document.createElement("div");
            title.className = "title";
            title.innerHTML = products[i].name;
            cards[i].appendChild(title);

            // category
            const category = document.createElement("div");
            category.className = "category";

            if(products[i].category === "sedie_e_poltrone") {
                products[i].category = "sedie e poltrone";
            } else if(products[i].category === "decorazioni_per_la_casa") {
                products[i].category = "decorazioni per la casa";
            }
            category.innerHTML = products[i].maincategory + " - " + products[i].category;
            cards[i].appendChild(category);

            // priceprdescriptionice
            const price = document.createElement("div");
            price.className = "price";
            price.innerHTML = products[i].price;
            cards[i].appendChild(price);

            // price
            const description = document.createElement("div");
            description.className = "description";
            description.innerHTML = products[i].description;
            cards[i].appendChild(description);
        }


        // event trigger and rendering of product details modal
        for(var i=0; i<size; i++) {
            const current_product = {
                name: products[i].name,
                maincategory: products[i].maincategory,
                category: products[i].category,
                price: products[i].price,
                quantity: products[i].quantity,
                description: products[i].description,
                image: products[i].image,
                _id: products[i]._id
            };

            const current_card = cards[i];
            current_card.addEventListener("click", () => {
                console.log(current_product);
                product_details(current_product);
            })
        }

        let index = 0;
        for(var i=0; i<numRows; i++) {
            rows[i] = document.createElement("div");
            rows[i].className = "row";
            container.appendChild(rows[i]);

            // add cards
            for(var j=0; j<2; j++) {
                if (cards[index] == null) {
                    return;
                }
                rows[i].appendChild(cards[index]);
                index++;
            }
        }
    }

    clear = function () {
        for(var i=0; i<numRows; i++) {
            if(rows[i] != null) {
                container.removeChild(rows[i]);
            }
        }
        numRows = 0;
        cards = [];
    }

    setEvents = function () {

        // setting window session
        // window.localStorage.setItem("cart", JSON.stringify([]));

        // tutti i prodotti
        allProducts = document.getElementById("all-products");
        allProducts.addEventListener("click", () => {
            clear();
            init();
        })

        // indoor
        indoorProducts = document.getElementById("indoor-products");
        indoorProducts.addEventListener("click", () => {
            clear();
            fetch("http://localhost:3000/api/product/getByMainCategory/indoor")
            .then( response => response.json())
            .then( result => render(result));
        })

        // outdoor
        outdoorProducts = document.getElementById("outdoor-products");
        outdoorProducts.addEventListener("click", () => {
            clear();
            fetch("http://localhost:3000/api/product/getByMainCategory/outdoor")
            .then( response => response.json())
            .then( result => render(result));
        })

        // sedie e poltrone
        sediePoltrone = document.getElementById("sedie-poltrone");
        sediePoltrone.addEventListener("click", () => {
            clear();
            fetch("http://localhost:3000/api/product/getByCategory/indoor/sedie_e_poltrone")
            .then( response => response.json())
            .then( result => render(result));
        })

        // divani
        divani = document.getElementById("divani");
        divani.addEventListener("click", () => {
            clear();
            fetch("http://localhost:3000/api/product/getByCategory/indoor/divani")
            .then( response => response.json())
            .then( result => render(result));
        })

        // tavoli indoor
        tavoliIndoor = document.getElementById("tavoli-indoor");
        tavoliIndoor.addEventListener("click", () => {
            clear();
            fetch("http://localhost:3000/api/product/getByCategory/indoor/tavoli")
            .then( response => response.json())
            .then( result => render(result));
        })

        // decorazioni per la casa
        decorazioniCasa = document.getElementById("decorazioni-casa");
        decorazioniCasa.addEventListener("click", () => {
            clear();
            fetch("http://localhost:3000/api/product/getByCategory/indoor/decorazioni_per_la_casa")
            .then( response => response.json())
            .then( result => render(result));
        })

         // sedie da giardino
         sedieGiardino = document.getElementById("sedie-giardino");
         sedieGiardino.addEventListener("click", () => {
             clear();
             fetch("http://localhost:3000/api/product/getByCategory/outdoor/sedie_da_giardino")
             .then( response => response.json())
             .then( result => render(result));
         })

         // tavoli outdoor
        tavoliOutdoor = document.getElementById("tavoli-outdoor");
        tavoliOutdoor.addEventListener("click", () => {
            clear();
            fetch("http://localhost:3000/api/product/getByCategory/outdoor/tavoli")
            .then( response => response.json())
            .then( result => render(result));
        })

        // decorazioni per l'esterno
        decorazioniEsterno = document.getElementById("decorazioni-esterno");
        decorazioniEsterno.addEventListener("click", () => {
            clear();
            fetch("http://localhost:3000/api/product/getByCategory/outdoor/decorazioni_per_esterno")
            .then( response => response.json())
            .then( result => render(result));
        })

        const search_req = function (name) {
            clear();
            fetch(`http://localhost:3000/api/product/getByName/${name}`)
            .then( response => response.json())
            .then( result => render(result));
        }

        // by click enter on input field
        searchInput = document.getElementById("search-input");
        searchInput.addEventListener("keypress", function(event) {
            if (searchInput.value == "") {
                return;
            }
            if(event.key === "Enter") {
                const name = searchInput.value;
                search_req(name);
            }
        })

        // by click on search button
        searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", () => {
            if (searchInput.value == null) {
                return;
            }
            const name = searchInput.value;
            search_req(name);
        })

    }

    init = function () {
        fetch("http://localhost:3000/api/product/getAll")
        .then( response => response.json())
        .then( result => render(result));
    }

    setCart = function(_cart) {
        cart = _cart;
    }

    setUserID = function (id) {
        userID = id;
    }

    init();
    setEvents();

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
                console.log(_result[0].products);
                setCart(_result[0].products);
            })
        }
    })


}

window.onload = () => { main(); }