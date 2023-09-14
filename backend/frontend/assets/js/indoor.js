// class Banner 
// {
//     constructor (name, price_value, category_name, top_offset, left_offset)
//     {
//         this.box = document.createElement("div");
//         this.title = document.createElement("div");
//         this.price = document.createElement("div");
//         this.category = document.createElement("div");
//         this.name = name;
//         this.price_value = price_value;
//         this.category_name = category_name;
//         this.top_offset = top_offset;
//         this.left_offset = left_offset;
//         this.init();
//     }

//     resetPos ()
//     {
//         // console.log("ci sono reset");
//         this.box.style.left = `${window.innerWidth - this.left_offset}px`;
//         this.box.style.top = `${this.top_offset}px`;
//     }

//     init ()
//     {
//         this.box.className = "banner";
//         this.box.style.left = `${window.innerWidth - this.left_offset}px`;
//         this.box.style.top = `${this.top_offset}px`;

//         this.title.className = "title white-text";
//         this.title.innerHTML = this.name;

//         this.price.className = "price white-text";
//         this.price.innerHTML = this.price_value;

//         this.category.className = "category white-text";
//         this.category.innerHTML = this.category_name;
//         this.box.appendChild(this.title);
//         this.box.appendChild(this.price);
//         this.box.appendChild(this.category);
//         document.body.appendChild(this.box);
//     }

//     setInvisible (flag)
//     {
//         console.log("ci sono invisible");
//         if(flag) {
//             this.box.className = "invisible";
//             return;
//         }
//         this.box.className = "banner";
//     }
// }


// class Pin 
// {
//     constructor (top_offset, left_offset, banner_name, banner_price,banner_category)
//     {
//         this.icon = document.createElement("img");
//         this.top_offset = top_offset;
//         this.left_offset = left_offset;
//         this.banner = new Banner(banner_name, banner_price,banner_category, top_offset-80, left_offset+130);
//         this.init();
//     }

//     setEvents ()
//     {
//         this.icon.addEventListener("mousemove", () => {
//             this.icon.className = "pin darken";
//             this.banner.setInvisible(false);
//             // console.log("hovering");
//         })

//         this.icon.addEventListener("mouseout", () => {
//             this.icon.className = "pin enlight";
//             this.banner.setInvisible(true);
//         })
//     }

//     init ()
//     {
//         this.icon.setAttribute("src","assets/pics/frame/dry-clean.png")
//         this.icon.classList.add("pin");
//         this.icon.style.left = `${window.innerWidth - this.left_offset}px`;
//         this.icon.style.top = `${this.top_offset}px`;
        
//         this.banner.setInvisible(true);

//         this.setEvents();
//     }

//     resize ()
//     {
//         console.log(`${this.banner_name} resize`);
//         this.icon.style.left = `${window.innerWidth - this.left_offset}px`;
//         console.log(this.icon.style.left);
//         this.banner.resetPos();
//     }

//     obj () 
//     {
//         return this.icon;
//     }
// }

const main = () => {
    // let pins = [];

    // createPins = function () {
    //     pins.push ( new Pin(2050,1250, "KIVIK", "€1599.90","Divani") );
    //     pins.push( new Pin(3250,820, "FEJKA", "€34.99","Decorazioni casa") );
    //     pins.push ( new Pin(2800,1550, "FLAKNAN", "€79.90","Decorazioni casa") );
    //     pins.push( new Pin(4500,1000, "NAMMARO", "€249.90","Tavoli") );
    //     pins.push ( new Pin(4000,1130, "BARLAST", "€80.90","Decorazioni casa") );
    //     pins.push ( new Pin(5500,850, "LANDSKRONA", "€2490.90","Divani") );
    //     pins.push ( new Pin(5700,1200, "TARSELE", "€100.90","Tavoli") );
    //     pins.push ( new Pin(6600,1520, "AZUL", "€350.90","Sedie e poltrone") );
    //     pins.push ( new Pin(7800,1500, "BILD", "€50.90","Decorazioni casa") );
    //     pins.push( new Pin(8050,1530, "LIDAS", "€149.90","Sedie e poltrone") );
    //     pins.push ( new Pin(7940,900, "PINNTORP", "€189.90","Tavoli") );
    //     pins.push ( new Pin(9300,1000, "MINIMAL", "€249.90","Sedie e poltrone") );
    //     pins.push ( new Pin(10500,1100, "KASBAH", "€69.90","Tavoli") );
    //     pins.push ( new Pin(11750,850, "THOR", "€120.90","Sedie e poltrone") );

    //     for(p of pins)
    //     {
    //         document.body.appendChild( p.obj() );
    //     }
        
    // };

    // setEvents = function () {
    //     window.onresize = () => {
    //         for(var i=0; i<pins.length; i++){
    //         const p = pins[i];
    //         p.resize();
    //         }
    //     }
    // };

    // init = () => {
    //     createPins();
    //     setEvents();
    // };
    // init();

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

window.onload = () => { main(); }