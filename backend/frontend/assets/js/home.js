/*
** Homepage script
**
*/

let count = 1;
const main = () => {
    const Home = {
        changeBackground : function() {
            if(count == 4) {
                count = 1;
                return;
            }
            let section = document.querySelector(".section");
            let home = document.getElementsByClassName("home")[0];

            home.className = "home abel";
            switch ( count ) 
            {
                case 1:
                    console.log("1");
                    home.className += " img-bg-1";
                    break;
                
                case 2:
                    console.log("2");
                    home.className += (" img-bg-2");
                    break;
                
                case 3:
                    console.log("3");
                    home.className += (" img-bg-3");
                    break;
            }

            section.innerHTML = `0${count++}/03`;
        }
    }

    setInterval(() => {
        setTimeout(Home.changeBackground,0);
    }, 3000);

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