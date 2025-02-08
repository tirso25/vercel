const inputs = document.getElementsByTagName("input");
const seePw = document.getElementsByClassName("material-symbols-outlined");

const emailLogin = document.getElementById("login_email");
const passwordLogin = document.getElementById("login_password");
const logInButton = document.getElementById("inicio");

const emailB = document.getElementById("email_rule");
const pwdB = document.getElementById("pwd_rule");

const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|[a-zA-Z0-9.-]+\.es)$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{5,}$/;

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("focus", function () {
        this.style.border = '1px solid #5057d4';
        this.style.outline = 'none';
        this.style.boxShadow = '0 0 5px #5057d4';
    });

    inputs[i].addEventListener("blur", function () {
        this.style.border = "1px solid #3b4550";
        this.style.boxShadow = 'none';
    });

    inputs[i].addEventListener("dblclick", function (event) {
        this.value = "";
        validateInput(event);
    });
}

for (let i = 0; i < seePw.length; i++) {
    seePw[i].addEventListener("click", function () {
        let passwordInput = this.closest('.input-container').getElementsByTagName('input')[0];

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.textContent = "visibility";
        } else {
            passwordInput.type = "password";
            this.textContent = "visibility_off";
        }
    });
}

function validateInput(event) {
    const target = event.target;

    let isEmailValid = emailLogin.value.trim() !== "" && emailRegex.test(emailLogin.value.trim());
    if (target === emailLogin) {
        emailB.style.color = isEmailValid ? "green" : "red";
        emailB.classList.remove("animate__animated", "animate__headShake");
        void emailB.offsetWidth;
        emailB.classList.add("animate__animated", isEmailValid ? "animate__pulse" : "animate__headShake");
    }

    let isPasswordValid = passwordLogin.value.trim() !== "" && passwordRegex.test(passwordLogin.value.trim());
    if (target === passwordLogin) {
        pwdB.style.color = isPasswordValid ? "green" : "red";
        pwdB.classList.remove("animate__animated", "animate__headShake");
        void pwdB.offsetWidth;
        pwdB.classList.add("animate__animated", isPasswordValid ? "animate__pulse" : "animate__headShake");
    }

    const allRight = isEmailValid && isPasswordValid;
    logInButton.disabled = !allRight;
    logInButton.classList.toggle("enabled", allRight);
    logInButton.style.backgroundColor = allRight ? "#2563eb" : "red";
    logInButton.style.cursor = allRight ? "pointer" : "not-allowed";
}

function login() {
    const data = {
        email: emailLogin.value,
        password: passwordLogin.value,
    };

    fetch("/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => { //ES PARA TODOS LOS ESTATUS QUE NO SEAN 200 ALGO(PARA POR EJEMPLO EL 400 QUE TENEMOS SI EL USUARIO YA EXISTE)
            if (!response.ok) {
                return response.json().then(mensaje => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: mensaje['mensaje']
                    });
                });
            }
            return response.json();
        })
        .then((mensaje) => {
            document.cookie = `username=${mensaje.username}; expires=; path=/`;

            Swal.fire({
                title: mensaje['mensaje'],
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 1700);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

emailLogin.addEventListener("input", validateInput);
passwordLogin.addEventListener("input", validateInput);
logInButton.addEventListener("click", login);
