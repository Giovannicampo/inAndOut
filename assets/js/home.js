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
            let description = document.querySelector(".home>.description");

            home.className = "home";
            switch ( count ) 
            {
                case 1:
                    console.log("1");
                    home.className += " img-bg-1";
                    description.className = ("description white-text");
                    break;
                
                case 2:
                    console.log("2");
                    home.className += (" img-bg-2");
                    description.className = ("description transparent-text");
                    break;
                
                case 3:
                    console.log("3");
                    home.className += (" img-bg-3 opposite-description");
                    description.className = ("description white-text");
                    break;
            }

            section.innerHTML = `0${count++}/03`;
        }
    }

    setInterval(() => {
        setTimeout(Home.changeBackground,1000);
    }, 3000);
}

window.onload = () => { main(); }