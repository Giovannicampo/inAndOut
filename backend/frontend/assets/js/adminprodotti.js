const main = () => {
    let mainContainer = document.getElementById("main-container");
    let allProducts = document.getElementsByClassName("all-products")[0];
    let menu = document.getElementsByClassName("menu")[0];
    let currentProduct = null;
    let currentProdName = document.getElementById("prodname");
    let currentProdImg = document.getElementById("prodimage");
    let currentProdMainCat = document.getElementById("prodmaincat");
    let currentProdCat = document.getElementById("prodcat");
    let currentProdQty = document.getElementById("prodqty");
    let currentProdPrc = document.getElementById("prodprc");
    let currentProdDescr = document.getElementById("proddescr");

    let rows = [];
    let num_rows = 0;

    // maincontainer
    if(window.innerWidth <= 1560) {
        mainContainer.style.flexDirection = "column";
        allProducts.style.flex = "800px";
    }

    // buttons
    let addProduct = document.getElementById("addProduct");
    let addProdFlag = false;
    let patchProduct = document.getElementById("patchProduct");
    let patchProdFlag = false;

    addProduct.addEventListener("click", () => {
        if(addProdFlag === false && patchProdFlag === false) {
            addProdFlag = true;
            addProductRender();
        }
    })

    patchProduct.addEventListener("click", () => {
        if(addProdFlag === false && patchProdFlag === false && currentProduct !== null 
            && currentProduct.image !== "assets/pics/notfound.jpg") {
            patchProdFlag = true;
            patchProductRender(currentProduct);
        }
    })

    patchProductRender = function(product) {
        const banner = document.createElement("div");
        banner.className = "addBanner";
        menu.appendChild(banner);

        const X = document.createElement("div");
        X.className = "addX";
        banner.appendChild(X);

        const x = document.createElement("span");
        x.innerHTML = "x";
        X.appendChild(x);

        x.addEventListener("click", () => {
            patchProdFlag = false;
            menu.removeChild(banner);
        })

        // input for product info

        const inputdiv1 = document.createElement("div");
        inputdiv1.className = "inputdiv";
        banner.appendChild(inputdiv1);

        const nameInput = document.createElement("input");
        nameInput.setAttribute("placeholder", "name");
        nameInput.value = product.name;
        inputdiv1.appendChild(nameInput);

        const inputdiv2 = document.createElement("div");
        inputdiv2.className = "inputdiv";
        banner.appendChild(inputdiv2);

        const imageInput = document.createElement("input");
        imageInput.setAttribute("placeholder", "image path");
        imageInput.value = product.image;
        inputdiv2.appendChild(imageInput);

        const inputdiv3 = document.createElement("div");
        inputdiv3.className = "inputdiv";
        banner.appendChild(inputdiv3);

        const mainCatInput = document.createElement("input");
        mainCatInput.setAttribute("placeholder", "main category");
        mainCatInput.value = product.maincategory;
        inputdiv3.appendChild(mainCatInput);

        const inputdiv4 = document.createElement("div");
        inputdiv4.className = "inputdiv";
        banner.appendChild(inputdiv4);

        const catInput = document.createElement("input");
        catInput.setAttribute("placeholder", "category");
        catInput.value = product.category;
        inputdiv4.appendChild(catInput);

        const inputdiv5 = document.createElement("div");
        inputdiv5.className = "inputdiv";
        banner.appendChild(inputdiv5);

        const qtyInput = document.createElement("input");
        qtyInput.setAttribute("placeholder", "quantity");
        qtyInput.value = product.quantity;
        inputdiv5.appendChild(qtyInput);

        const inputdiv6 = document.createElement("div");
        inputdiv6.className = "inputdiv";
        banner.appendChild(inputdiv6);

        const priceInput = document.createElement("input");
        priceInput.setAttribute("placeholder", "price in euro");
        priceInput.value = product.price;
        inputdiv6.appendChild(priceInput);

        const inputdiv7 = document.createElement("div");
        inputdiv7.className = "inputdiv";
        banner.appendChild(inputdiv7);

        const descriptionInput = document.createElement("input");
        descriptionInput.setAttribute("placeholder", "description");
        descriptionInput.value = product.description;
        inputdiv7.appendChild(descriptionInput);

        const inputdiv8 = document.createElement("div");
        inputdiv8.className = "inputdiv";
        banner.appendChild(inputdiv8);

        const salva = document.createElement("button");
        salva.innerHTML = "Salva";
        inputdiv8.appendChild(salva);

        salva.addEventListener("click", () => {
            const name = nameInput.value;
            const image = imageInput.value;
            const mainCat = mainCatInput.value;
            const cat = catInput.value;
            const qty = qtyInput.value;
            const price = priceInput.value;
            const description = descriptionInput.value;

            if(name === "" || image === "" || mainCat === "" || cat === "" ||
               qty === "" || price === "" || description === "") return;
            
            fetch(`http://localhost:3000/api/product/update/${product._id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name: name,
                    maincategory: mainCat,
                    category: cat,
                    quantity: qty,
                    image: image,
                    price: price,
                    description: description
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if(result.type == "success") {
                    resetAllProducts();
                    setAllProducts();
                    const prod = {
                        _id: result.product._id,
                        name: result.product.name,
                        image: result.product.image,
                        maincategory: result.product.maincategory,
                        category: result.product.category,
                        quantity: result.product.quantity,
                        price: result.product.price,
                        description: result.product.description
                    };
                    setCurrentProduct(prod);
                    nameInput.value = imageInput.value = mainCatInput.value = catInput.value = qtyInput.value = priceInput.value = descriptionInput.value = "";
                }
            })
        })
    }

    addProductRender = function() {
        const banner = document.createElement("div");
        banner.className = "addBanner";
        menu.appendChild(banner);

        const X = document.createElement("div");
        X.className = "addX";
        banner.appendChild(X);

        const x = document.createElement("span");
        x.innerHTML = "x";
        X.appendChild(x);

        x.addEventListener("click", () => {
            addProdFlag = false;
            menu.removeChild(banner);
        })

        // input for product info

        const inputdiv1 = document.createElement("div");
        inputdiv1.className = "inputdiv";
        banner.appendChild(inputdiv1);

        const nameInput = document.createElement("input");
        nameInput.setAttribute("placeholder", "name");
        inputdiv1.appendChild(nameInput);

        const inputdiv2 = document.createElement("div");
        inputdiv2.className = "inputdiv";
        banner.appendChild(inputdiv2);

        const imageInput = document.createElement("input");
        imageInput.setAttribute("placeholder", "image path");
        inputdiv2.appendChild(imageInput);

        const inputdiv3 = document.createElement("div");
        inputdiv3.className = "inputdiv";
        banner.appendChild(inputdiv3);

        const mainCatInput = document.createElement("input");
        mainCatInput.setAttribute("placeholder", "main category");
        inputdiv3.appendChild(mainCatInput);

        const inputdiv4 = document.createElement("div");
        inputdiv4.className = "inputdiv";
        banner.appendChild(inputdiv4);

        const catInput = document.createElement("input");
        catInput.setAttribute("placeholder", "category");
        inputdiv4.appendChild(catInput);

        const inputdiv5 = document.createElement("div");
        inputdiv5.className = "inputdiv";
        banner.appendChild(inputdiv5);

        const qtyInput = document.createElement("input");
        qtyInput.setAttribute("placeholder", "quantity");
        inputdiv5.appendChild(qtyInput);

        const inputdiv6 = document.createElement("div");
        inputdiv6.className = "inputdiv";
        banner.appendChild(inputdiv6);

        const priceInput = document.createElement("input");
        priceInput.setAttribute("placeholder", "price in euro");
        inputdiv6.appendChild(priceInput);

        const inputdiv7 = document.createElement("div");
        inputdiv7.className = "inputdiv";
        banner.appendChild(inputdiv7);

        const descriptionInput = document.createElement("input");
        descriptionInput.setAttribute("placeholder", "description");
        inputdiv7.appendChild(descriptionInput);

        const inputdiv8 = document.createElement("div");
        inputdiv8.className = "inputdiv";
        banner.appendChild(inputdiv8);

        const salva = document.createElement("button");
        salva.innerHTML = "Salva";
        inputdiv8.appendChild(salva);

        salva.addEventListener("click", () => {
            const name = nameInput.value;
            const image = imageInput.value;
            const mainCat = mainCatInput.value;
            const cat = catInput.value;
            const qty = qtyInput.value;
            const price = priceInput.value;
            const description = descriptionInput.value;

            if(name === "" || image === "" || mainCat === "" || cat === "" ||
               qty === "" || price === "" || description === "") return;
            
            fetch("http://localhost:3000/api/product/post", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name: name,
                    maincategory: mainCat,
                    category: cat,
                    quantity: qty,
                    image: image,
                    price: price,
                    description: description
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if(result.type == "success") {
                    addRow(result.product);
                    nameInput.value = imageInput.value = mainCatInput.value = catInput.value = qtyInput.value = priceInput.value = descriptionInput.value = "";
                }
            })
        })

    }

    setCurrentProduct = function(curr_prod) {
        currentProduct = curr_prod;
        console.log(curr_prod);
        console.log(currentProduct);

        // set info
        currentProdName.innerHTML = currentProduct.name;
        currentProdImg.setAttribute("src",currentProduct.image);
        currentProdMainCat.innerHTML = currentProduct.maincategory;
        currentProdCat.innerHTML = currentProduct.category;
        currentProdQty.innerHTML = "qty " + currentProduct.quantity;
        currentProdPrc.innerHTML = "€ " + currentProduct.price;
        currentProdDescr.innerHTML = currentProduct.description;
    }

    addRow = function(product) {
        const row = document.createElement("div");
        row.className = "row";
        allProducts.appendChild(row);

        const image_div = document.createElement("div");
        image_div.className = "image";
        row.appendChild(image_div);

        const image = document.createElement("img");
        image.setAttribute("src",product.image);
        image_div.appendChild(image);

        const prod_name = document.createElement("p");
        prod_name.className = "name";
        prod_name.innerHTML = product.name;
        row.appendChild(prod_name);

        const curr_prod = product;

        row.addEventListener("click", () => {
            setCurrentProduct(curr_prod);
        })

        const X = document.createElement("div");
        X.className = "remX";
        row.appendChild(X);

        const x = document.createElement("span");
        x.innerHTML = "x";
        X.appendChild(x);

        x.addEventListener("click", () => {
            fetch(`http://localhost:3000/api/product/delete/${curr_prod._id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({})
            })
            .then(response => response.json())
            .then(result => {
                if(result.type == "success") {
                    allProducts.removeChild(row);
                    const prod = {
                        name: "Nome prodotto",
                        image: "assets/pics/notfound.jpg",
                        maincategory: "categoria principale",
                        category: "categoria secondaria",
                        quantity: "quantità",
                        price: "prezzo",
                        description: "descrizione"
                    };
                    setCurrentProduct(prod);
                }
            })
        })
    }

    resetAllProducts = function() {
        for(var i=0; i<num_rows; i++) {
            allProducts.removeChild(rows[i]);
        }
        rows = [];
        num_rows = 0;
    }

    render = function(products) {
        for(var i=0; i<products.length; i++) {
            const row = document.createElement("div");
            row.className = "row";
            allProducts.appendChild(row);
            rows.push(row);
            num_rows++;

            const image_div = document.createElement("div");
            image_div.className = "image";
            row.appendChild(image_div);

            const image = document.createElement("img");
            image.setAttribute("src",products[i].image);
            image_div.appendChild(image);

            const prod_name = document.createElement("p");
            prod_name.className = "name";
            prod_name.innerHTML = products[i].name;
            row.appendChild(prod_name);

            const curr_prod = products[i];

            row.addEventListener("click", () => {
                setCurrentProduct(curr_prod);
            })

            const X = document.createElement("div");
            X.className = "remX";
            row.appendChild(X);

            const x = document.createElement("span");
            x.innerHTML = "x";
            X.appendChild(x);

            x.addEventListener("click", () => {
                fetch(`http://localhost:3000/api/product/delete/${curr_prod._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({})
                })
                .then(response => response.json())
                .then(result => {
                    if(result.type == "success") {
                        allProducts.removeChild(row);
                        const prod = {
                            name: "Nome prodotto",
                            image: "assets/pics/notfound.jpg",
                            maincategory: "categoria principale",
                            category: "categoria secondaria",
                            quantity: "quantità",
                            price: "prezzo",
                            description: "descrizione"
                        };
                        setCurrentProduct(prod);
                    }
                })
            })
        }
    }

    setAllProducts = function() {
        fetch("http://localhost:3000/api/product/getAll")
        .then( response => response.json())
        .then( result => render(result));
    }

    setAllProducts();
}

window.onload = () => {main();}