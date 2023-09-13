const main = () => {
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let accedi = document.getElementById("accedi");

    // email
    let emailArea = document.getElementById("email-area");
    let emailError = document.createElement("p");
    emailError.innerHTML = "Campo email vuoto o errato!"
    emailError.className = "error";
    let emailIsError = false;

    // password
    let passwordArea = document.getElementById("password-area");
    let passwordError = document.createElement("p");
    passwordError.innerHTML = "Campo password vuoto!"
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

    errorRender = function(text) {
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

        // input
        
    }

    accedi.addEventListener("click", () => {
        emailIsError = emailHandler(emailInput.value, emailArea, emailError, emailIsError);
        passwordIsError = errorHandler(passwordInput.value, passwordArea, passwordError, passwordIsError);
        if(emailIsError || passwordIsError) return;

        const userLog = {
            email: emailInput.value,
            password: passwordInput.value
        }

        // console.log(userLog);
        fetch("http://localhost:3000/api/auth/signin", {
            method: "POST",
            body: JSON.stringify(userLog),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(result => {
            if(result.type == "error") errorRender(result.message)
            else window.location.href = "profile.html";
        })
    })
}

window.onload = () => {main();}