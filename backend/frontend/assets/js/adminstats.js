const main = () => {
    const plotPrezziProdotti = document.getElementById('plot-prezzi-prodotti');
    const plotIncassi = document.getElementById("plot-incassi");
    const plotProdottiVenduti = document.getElementById("plot-prodotti-venduti");

    // PRODOTTI

    let totaleProdotti = 0;
    let nomeProdotti = [];
    let prezziProdotti = [];
    let mediaIndoor = 0;
    let mediaOutdoor = 0;

    const totProdottiDiv = document.getElementById("tot-prodotti");
    const mediaPrezziIndoor = document.getElementById("prezzi-indoor");
    const mediaPrezziOutdoor = document.getElementById("prezzi-outdoor");

    // UTENTI
    let totaleUtenti = 0;
    
    const totUtentiDiv = document.getElementById("tot-utenti");
    const spesaMedia = document.getElementById("spesa-media");

    // ORDINI
    let totaleOrdini = 0;
    let totaleIncassi = 0;
    let mediaProdottiPerOrdine = 0;

    const totOrdiniDiv = document.getElementById("tot-ordini");
    const totIncassiDiv = document.getElementById("tot-incassi");
    const mediaProdOrdine = document.getElementById("prodotti-ordine");

    // MONTHS
    let incassiPerMese = [0,0,0,0,0,0,0,0,0,0,0,0];
    let prodottiPerMese = [0,0,0,0,0,0,0,0,0,0,0,0];



    setPrezziProdottiPlot = function (xArr, yArr) {
        const xArray = xArr;
        const yArray = yArr;

        const data = [{
        x: xArray,
        y: yArray,
        type: "bar",
        orientation:"v",
        marker: {color:"#517965"},
        }];

        const layout = {
            title:"Prezzo per prodotto", 
            paper_bgcolor: 'rgb(0,0,0,0)', 
            plot_bgcolor: 'rgb(0,0,0,0)', 
            font: {
            size: 18,
            color: '#517965'
            }
        };

        Plotly.newPlot(plotPrezziProdotti, data, layout);
    }

    setIncassiPlot = function (yArr) {
        const xArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const yArray = yArr;

        const data = [{
        x: xArray,
        y: yArray,
        type: "bar",
        orientation:"v",
        marker: {color:"#517965"},
        }];

        const layout = {
            title:"Incassi mensili", 
            paper_bgcolor: 'rgb(0,0,0,0)', 
            plot_bgcolor: 'rgb(0,0,0,0)', 
            font: {
            size: 18,
            color: '#517965'
            }
        };

        Plotly.newPlot(plotIncassi, data, layout);
    }

    setProdottiVendutiPlot = function (yArr) {
        const xArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const yArray = yArr;

        const data = [{
        x: xArray,
        y: yArray,
        type: "bar",
        orientation:"v",
        marker: {color:"#517965"},
        }];

        const layout = {
            title:"Prodotti venduti mensilmente", 
            paper_bgcolor: 'rgb(0,0,0,0)', 
            plot_bgcolor: 'rgb(0,0,0,0)', 
            font: {
            size: 18,
            color: '#517965'
            }
        };

        Plotly.newPlot(plotProdottiVenduti, data, layout);
    }

    setProductInfo = function (products) {
        totaleProdotti = products.length;
        totProdottiDiv.innerHTML = totaleProdotti;

        let numProdIndoor = 0;
        let numProdOutdoor = 0;
        let sumProdIndoor = 0;
        let sumProdOutdoor = 0;
        for(var i=0; i<totaleProdotti; i++) {
            const currProd = products[i];
            nomeProdotti.push(currProd.name);
            prezziProdotti.push(Number(currProd.price));
            if(currProd.maincategory == "indoor") {
                numProdIndoor++;
                sumProdIndoor += currProd.price;
            }
            else {
                numProdOutdoor++;
                sumProdOutdoor += currProd.price;
            }
        }

        mediaIndoor = sumProdIndoor/numProdIndoor;
        mediaOutdoor = sumProdOutdoor/numProdOutdoor;
        mediaPrezziIndoor.innerHTML ="€" + mediaIndoor.toFixed(2);
        mediaPrezziOutdoor.innerHTML = "€" + mediaOutdoor.toFixed(2);

        setPrezziProdottiPlot(nomeProdotti,prezziProdotti);
    }

    setUserInfo = function (users) {
        totaleUtenti = users.length;
        totUtentiDiv.innerHTML = totaleUtenti;
        let totalSum = 0;
        for(var i=0; i<users.length; i++) {
            const currUser = users[i];
            fetch(`http://localhost:3000/api/order/getByUserID/${currUser._id}`)
            .then(response => response.json())
            .then(result => {
                let sumCost = 0;
                const orders = result;
                for(var j=0; j<orders.length; j++) {
                    const currOrder = orders[j];
                    sumCost += currOrder.totalCost;
                }
                totalSum += sumCost;
                spesaMedia.innerHTML = "€" + (totalSum/totaleUtenti).toFixed(2);
            })
        }
    }

    setOrderInfo = function (orders) {

        // let totaleOrdini = 0;
        // let totaleIncassi = 0;
        // let mediaProdottiPerOrdine = 0;

        // const totOrdiniDiv = document.getElementById("tot-ordini");
        // const totIncassiDiv = document.getElementById("tot-incassi");
        // const mediaProdOrdine = document.getElementById("prodotti-ordine");
        totaleOrdini = orders.length;
        totOrdiniDiv.innerHTML = totaleOrdini;

        let numProdotti = 0;
        for(var i=0; i<orders.length; i++) {
            const currOrder = orders[i];

            if(currOrder.state == "spedito") {
                totaleIncassi += currOrder.totalCost;

                const month = (currOrder.date).split(" ")[2];
                switch(month) {
                    case "Jan":
                        incassiPerMese[0] += currOrder.totalCost;
                        prodottiPerMese[0] += currOrder.products.length;
                        break;
                    case "Feb":
                        incassiPerMese[1] += currOrder.totalCost;
                        prodottiPerMese[1] += currOrder.products.length;
                        break;
                    case "Mar":
                        incassiPerMese[2] += currOrder.totalCost;
                        prodottiPerMese[2] += currOrder.products.length;
                        break;
                    case "Apr":
                        incassiPerMese[3] += currOrder.totalCost;
                        prodottiPerMese[3] += currOrder.products.length;
                        break;
                    case "May":
                        incassiPerMese[4] += currOrder.totalCost;
                        prodottiPerMese[4] += currOrder.products.length;
                        break;
                    case "Jun":
                        incassiPerMese[5] += currOrder.totalCost;
                        prodottiPerMese[5] += currOrder.products.length;
                        break;
                    case "Jul":
                        incassiPerMese[6] += currOrder.totalCost;
                        prodottiPerMese[6] += currOrder.products.length;
                        break;
                    case "Aug":
                        incassiPerMese[7] += currOrder.totalCost;
                        prodottiPerMese[7] += currOrder.products.length;
                        break;
                    case "Sep":
                        incassiPerMese[8] += currOrder.totalCost;
                        prodottiPerMese[8] += currOrder.products.length;
                        break;
                    case "Oct":
                        incassiPerMese[9] += currOrder.totalCost;
                        prodottiPerMese[9] += currOrder.products.length;
                        break;
                    case "Nov":
                        incassiPerMese[10] += currOrder.totalCost;
                        prodottiPerMese[10] += currOrder.products.length;
                        break;
                    case "Dec":
                        incassiPerMese[11] += currOrder.totalCost;
                        prodottiPerMese[11] += currOrder.products.length;
                        break;
                }
            }
            numProdotti += currOrder.products.length;
        }

        mediaProdottiPerOrdine = numProdotti/totaleOrdini;

        totIncassiDiv.innerHTML = "€" + totaleIncassi;
        mediaProdOrdine.innerHTML = mediaProdottiPerOrdine.toFixed(0);

        setIncassiPlot(incassiPerMese);
        setProdottiVendutiPlot(prodottiPerMese);
    }

    setTuttuCosi = function () {
        fetch("http://localhost:3000/api/product/getAll")
        .then(response => response.json())
        .then(result => setProductInfo(result))

        fetch("http://localhost:3000/api/auth/getAll")
        .then(response => response.json())
        .then(result => setUserInfo(result))

        fetch("http://localhost:3000/api/order/getAll")
        .then(response => response.json())
        .then(result => setOrderInfo(result))
    }

    setTuttuCosi();
}

window.onload = () => {main();}