const main = () => {
    let nameInput = document.getElementById("name");
    let surnameInput = document.getElementById("surname");
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let registrati = document.getElementById("registrati");

    // name
    let nameArea = document.getElementById("name-area");
    let nameError = document.createElement("p");
    nameError.innerHTML = "Campo nome vuoto!"
    nameError.className = "error";
    let nameIsError = false;

    // surname
    let surnameArea = document.getElementById("surname-area");
    let surnameError = document.createElement("p");
    surnameError.innerHTML = "Campo cognome vuoto!"
    surnameError.className = "error";
    let surnameIsError = false;

    // email
    let emailArea = document.getElementById("email-area");
    let emailError = document.createElement("p");
    emailError.innerHTML = "Campo email vuoto o errato!"
    emailError.className = "error";
    let emailIsError = false;

    // password
    let passwordArea = document.getElementById("password-area");
    let passwordError = document.createElement("p");
    passwordError.innerHTML = "Almeno 8 caratteri, uno maiuscolo, uno minuscolo e un carattere speciale!"
    passwordError.className = "error";
    let passwordIsError = false;

    errorHandler = function (value, area, error, flag) {
        if(value == "") {
            area.appendChild(error);
            flag = true;
            return true;
        }
        if(flag) {
            area.removeChild(error);
            flag = false;
        }
    }
    
    passwordHandler = function (value, area, error, flag) {
        const regexPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/i;
        if(value == "" || regexPassword.test(value) == false) {
            area.appendChild(error);
            flag = true;
            return true;
        }
        if(flag) {
            area.removeChild(error);
            flag = false;
        }
    }

    emailHandler = function (value, area, error, flag) {
        const regexPattern = /^[(\w\d\W)+]+@[\w+]+\.[\w+]+$/i;
        if(value == "" || regexPattern.test(value) == false) {
            area.appendChild(error);
            flag = true;
            return true;
        }
        if(flag) {
            area.removeChild(error);
            flag = false;
        }
        return false;
    }

    successRender = function(text) {
        const modal = document.getElementsByClassName("modal")[0];
        const success = document.createElement("div");
        success.className = "success";
        success.style.top = `${(window.innerHeight/2) - 150}px`;
        success.style.left = `${(window.innerWidth/2) - 250}px`;
        modal.appendChild(success);

        // X
        const X = document.createElement("p");
        X.className = "x-button";
        success.appendChild(X);

        const x = document.createElement("span");
        x.innerHTML = "x&nbsp;&nbsp;&nbsp";
        x.style.color = "#517965";
        X.appendChild(x);

        x.addEventListener("click", () => {
            modal.removeChild(success);
        })

        // message
        const message = document.createElement("p");
        message.innerHTML = text;
        message.className = "message";
        success.appendChild(message);

        // br
        const br = document.createElement("br");
        success.appendChild(br);

        // link
        const link = document.createElement("p");
        link.className = "link";
        success.appendChild(link);

        const l = document.createElement("span");
        l.innerHTML = "Sign in";
        link.appendChild(l);

        l.addEventListener("click", () => {
            window.location.href = "signin.html";
        })
    }
    
    

    registrati.addEventListener("click", () => {
        nameIsError = errorHandler(nameInput.value, nameArea, nameError, nameIsError);
        surnameIsError = errorHandler(surnameInput.value, surnameArea, surnameError, surnameIsError);
        emailIsError = emailHandler(emailInput.value, emailArea, emailError, emailIsError);
        passwordIsError = passwordHandler(passwordInput.value, passwordArea, passwordError, passwordIsError);
        if(nameIsError || surnameIsError || emailIsError || passwordIsError) return;

        const newUser = {
            name : nameInput.value,
            surname: surnameInput.value,
            email : emailInput.value,
            password : passwordInput.value
        };

        nameInput.value = surnameInput.value = emailInput.value = passwordInput.value = "";

        // console.log(newUser);

        fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(result => successRender(result.message))
        .catch(err => successRender(err));
    })
}

window.onload = () => {main();}