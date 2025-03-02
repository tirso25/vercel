const inputs = document.getElementsByTagName("input");
const seePw = document.getElementsByClassName("material-symbols-outlined");

const email = document.getElementById("signIn_email");
const username = document.getElementById("signIn_user_name");
const pwd = document.getElementById("signIn_password");
const repeatpwd = document.getElementById("signIn_repeat_password");
const signInButton = document.getElementById("registro");

const emailB = document.getElementById("email_rule");
const usernameB = document.getElementById("username_rule");
const pwdB = document.getElementById("pwd_rule");
const repeatpwdB = document.getElementById("repeatpwd_rule");

const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|[a-zA-Z0-9.-]+\.es)$/;
const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{5,}$/;

//Añadimos estilos
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

//Para ver y ocultar las contraseñas
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

/**
 * Validamos si el imput se ajusta a nuestra resticciones con el uso de regex, también añadimos estilos en funcion de lo ocurrido
 * @param {*} event - para identificar el elemento del dom
 */
function validateInput(event) {
    const target = event.target;//PARA SABER EN QUE INPUT ESTAMOS (USO PARA LAS ANIMACIONES YA QUE SI NO SE USA EL target APLICA LAS ANIMACIONES A)

    let isEmailValid = email.value.trim() !== "" && emailRegex.test(email.value.trim());
    if (target === email) {
        emailB.style.color = isEmailValid ? "green" : "red";
        emailB.classList.remove("animate__animated", "animate__headShake");
        void emailB.offsetWidth;
        emailB.classList.add("animate__animated", isEmailValid ? "animate__pulse" : "animate__headShake");
    }

    let isUsernameValid = username.value.trim() !== "" && usernameRegex.test(username.value.trim());
    if (target === username) {
        usernameB.style.color = isUsernameValid ? "green" : "red";
        usernameB.classList.remove("animate__animated", "animate__headShake");
        void usernameB.offsetWidth;
        usernameB.classList.add("animate__animated", isUsernameValid ? "animate__pulse" : "animate__headShake");
    }

    let isPasswordValid = pwd.value.trim() !== "" && passwordRegex.test(pwd.value.trim());
    if (target === pwd) {
        pwdB.style.color = isPasswordValid ? "green" : "red";
        pwdB.classList.remove("animate__animated", "animate__headShake");
        void pwdB.offsetWidth;
        pwdB.classList.add("animate__animated", isPasswordValid ? "animate__pulse" : "animate__headShake");
    }

    let isRepeatPasswordValid = repeatpwd.value.trim() !== "" && passwordRegex.test(repeatpwd.value.trim()) && repeatpwd.value.trim() === pwd.value.trim();
    if (target === repeatpwd) {
        repeatpwdB.style.color = isRepeatPasswordValid ? "green" : "red";
        repeatpwdB.classList.remove("animate__animated", "animate__headShake");
        void repeatpwdB.offsetWidth;
        repeatpwdB.classList.add("animate__animated", isRepeatPasswordValid ? "animate__pulse" : "animate__headShake");
    }

    const allRight = isEmailValid && isUsernameValid && isPasswordValid && isRepeatPasswordValid;
    signInButton.disabled = !allRight;
    signInButton.classList.toggle("enabled", allRight);
    signInButton.style.backgroundColor = allRight ? "#2563eb" : "red";
    signInButton.style.cursor = allRight ? "pointer" : "not-allowed";
}

/**
 * Para registrarnos, recogemos los valores de los imputs y los pasamos al back mediante fetch, en funcion de la respuesta de back nos registraremos o no
 */
function signin() {
    const data = {
        email: email.value,
        username: username.value,
        password: pwd.value
    };

    fetch("/users/signin", {
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
            Swal.fire({
                title: mensaje['mensaje'],
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => {
                window.location.href = "/login";
            }, 1700);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

email.addEventListener("input", validateInput);
username.addEventListener("input", validateInput);
pwd.addEventListener("input", validateInput);
repeatpwd.addEventListener("input", validateInput);
signInButton.addEventListener("click", signin);
