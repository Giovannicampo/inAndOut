const main = () => {
    let signButton = document.getElementById("sign");
    const auth = JSON.parse(window.localStorage.getItem("auth"));
    
    if(auth.accessToken !== "") {
        signButton.innerHTML = "Profilo 👤";
        signButton.setAttribute("href", "profile.html");
    } else {
        signButton.innerHTML = "Sign up";
        signButton.setAttribute("href", "signup.html");
    }
}

window.onload = () => {main();}