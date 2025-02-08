const username = document.getElementById("username");
const logoff = document.getElementById("logoff");
const artistFilter = document.getElementById("artistFilter");

//Añadimos estilos
artistFilter.addEventListener("dblclick", function () {
    artistFilter.value = "";
});

username.textContent = document.cookie.split("=")[1];
/**
 * DUncion para quitar la sesión, nos destruye la cookie y nos redirige al login
 * @param {*} event - para evitar el comportamiento de la etiqueta <a>
 */
function logOff(event) {
    event.preventDefault();

    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/login";
}

logoff.addEventListener("click", logOff);

var egg = new Egg();
egg.addCode("up,up,down,down,left,right,left,right,b,a", function () {
    window.location.href = "https://youtu.be/Zt_7L1eey2w";
});

// Escuchar las pulsaciones de teclas
egg.addHook(function () {
    console.log("RICK ROLEADOOOOO");
}).listen();