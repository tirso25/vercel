
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
    seePw[i].addEventListener("mousedown", function () {
        let passwordInput = this.closest('.input-container').getElementsByTagName('input')[0];
        passwordInput.type = "text";
        this.textContent = "visibility";
    });

    seePw[i].addEventListener("mouseup", function () {
        let passwordInput = this.closest('.input-container').getElementsByTagName('input')[0];
        passwordInput.type = "password";
        this.textContent = "visibility_off";
    });

    seePw[i].addEventListener("mouseout", function () {
        let passwordInput = this.closest('.input-container').getElementsByTagName('input')[0];
        passwordInput.type = "password";
        this.textContent = "visibility_off";
    });
}

function validateInput(event) {
    const target = event.target;//PARA SABER EN QUE INPUT ESTAMOS (USO PARA LAS ANIMACIONES YA QUE SI NO SE USA EL target APLICA LAS ANIMACIONES A)

    let isEmailValid = email.value.trim() !== "" && emailRegex.test(email.value.trim());
    if (target === email) {
        if (isEmailValid) {
            emailB.style.color = "green";
            emailB.classList.remove("animate__animated", "animate__headShake");
            void emailB.offsetWidth;
            emailB.classList.add("animate__animated", "animate__pulse");
        } else {
            emailB.style.color = "red";
            emailB.classList.remove("animate__animated", "animate__headShake");
            void emailB.offsetWidth;
            emailB.classList.add("animate__animated", "animate__headShake");
        }
    }

    let isUsernameValid = username.value.trim() !== "" && usernameRegex.test(username.value.trim());
    if (target === username) {
        if (isUsernameValid) {
            usernameB.style.color = "green";
            usernameB.classList.remove("animate__animated", "animate__headShake");
            void usernameB.offsetWidth;
            usernameB.classList.add("animate__animated", "animate__pulse");
        } else {
            usernameB.style.color = "red";
            usernameB.classList.remove("animate__animated", "animate__headShake");
            void usernameB.offsetWidth;
            usernameB.classList.add("animate__animated", "animate__headShake");
        }
    }

    let isPasswordValid = pwd.value.trim() !== "" && passwordRegex.test(pwd.value.trim());
    if (target === pwd) {
        if (isPasswordValid) {
            pwdB.style.color = "green";
            pwdB.classList.remove("animate__animated", "animate__headShake");
            void pwdB.offsetWidth;
            pwdB.classList.add("animate__animated", "animate__pulse");
        } else {
            pwdB.style.color = "red";
            pwdB.classList.remove("animate__animated", "animate__headShake");
            void pwdB.offsetWidth;
            pwdB.classList.add("animate__animated", "animate__headShake");
        }
    }

    let isRepeatPasswordValid = repeatpwd.value.trim() !== "" && passwordRegex.test(repeatpwd.value.trim()) && repeatpwd.value.trim() === pwd.value.trim();
    if (target === repeatpwd) {
        if (isRepeatPasswordValid) {
            repeatpwdB.style.color = "green";
            repeatpwdB.classList.remove("animate__animated", "animate__headShake");
            void repeatpwdB.offsetWidth;
            repeatpwdB.classList.add("animate__animated", "animate__pulse");
        } else {
            repeatpwdB.style.color = "red";
            repeatpwdB.classList.remove("animate__animated", "animate__headShake");
            void repeatpwdB.offsetWidth;
            repeatpwdB.classList.add("animate__animated", "animate__headShake");
        }
    }

    const allRight = isEmailValid && isUsernameValid && isPasswordValid && isRepeatPasswordValid;
    signInButton.disabled = !allRight;
    signInButton.classList.toggle("enabled", allRight);
    signInButton.style.backgroundColor = allRight ? "#2563eb" : "red";
    signInButton.style.cursor = allRight ? "pointer" : "not-allowed";
}

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
