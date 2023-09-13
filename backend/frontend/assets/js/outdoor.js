const main = () => {
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

window.onload = () => {main();}