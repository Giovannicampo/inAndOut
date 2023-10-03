const main = () => {
    let allUsers = document.getElementsByClassName("all-users")[0];
    let currentUser = null;

    const infoNameSurname = document.getElementById("name-surname");
    const infoEmail = document.getElementById("email");
    const infoDelivery = document.getElementById("delivery-info");
    const infoLevel = document.getElementById("level");
    const ordersContainer = document.getElementById("orders-container");
    let currentOrderRows = []

    renderOrdersPerUser = function (orders) {
        if(currentOrderRows.length > 0) {
            for(var i=0; i<currentOrderRows.length; i++) {
                ordersContainer.removeChild(currentOrderRows[i]);
            }
            currentOrderRows = []
        }
        for(var i=0; i<orders.length; i++) {
            const row = document.createElement("div");
            row.className = "row";
            ordersContainer.appendChild(row);
            currentOrderRows.push(row)

            const orderID = document.createElement("div");
            orderID.innerHTML = "#" + orders[i].orderID;
            orderID.className = "text";
            row.appendChild(orderID);

            const date = document.createElement("div");
            date.innerHTML = orders[i].date;
            date.className = "text";
            row.appendChild(date);

            const totalCost = document.createElement("div");
            totalCost.innerHTML = "€" + orders[i].totalCost;
            totalCost.className = "text";
            row.appendChild(totalCost);
        }
    }

    setCurrentUser = function(curr_user) {
        currentUser = curr_user;
        console.log(curr_user);
        console.log(currentUser);

        // set info
        infoNameSurname.innerHTML = currentUser.name + " " + currentUser.surname;
        infoEmail.innerHTML = currentUser.email;
        infoDelivery.innerHTML = currentUser.deliveryInfo.address + 
                                 " " + currentUser.deliveryInfo.postalCode +
                                 " " + currentUser.deliveryInfo.country;
        infoLevel.innerHTML = currentUser.level;

        fetch(`http://localhost:3000/api/order/getByUserID/${currentUser._id}`)
        .then(response => response.json())
        .then(result => renderOrdersPerUser(result))
    }

    render = function (users) {
        for(var i=0; i<users.length; i++) {
            const row = document.createElement("div");
            row.className = "row";
            allUsers.appendChild(row);

            const image_div = document.createElement("div");
            image_div.className = "image";
            row.appendChild(image_div);

            const image = document.createElement("img");
            image.setAttribute("src","assets/pics/user.png");
            image_div.appendChild(image);

            const user_name = document.createElement("p");
            user_name.className = "name";
            user_name.innerHTML = users[i].name + " " + users[i].surname;
            row.appendChild(user_name);

            const user_email = document.createElement("p");
            user_email.className = "email";
            user_email.innerHTML = users[i].email;
            row.appendChild(user_email);

            const curr_user = users[i];

            row.addEventListener("click", () => {
                setCurrentUser(curr_user);
            })
        }
    }

    setAllUsers = function () {
        fetch("http://localhost:3000/api/auth/getAll")
        .then( response => response.json())
        .then( result => render(result));
    }

    setAllUsers();

}

window.onload = () => {main();}