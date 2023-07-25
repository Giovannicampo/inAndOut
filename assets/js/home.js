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
            section = document.querySelector(".section")
            section.innerHTML = `0${count++}/03`;
        }
    }

    setInterval(() => {
        setTimeout(Home.changeBackground,3000)
    }, 3000);
}

window.onload = main;