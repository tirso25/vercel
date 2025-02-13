const username = document.getElementById("username");
const logoff = document.getElementById("logoff");
const songFilter = document.getElementById("nombreCancion");
const divResultado = document.getElementById("resultados");
//Añadimos estilos
songFilter.addEventListener("dblclick", function () {
    songFilter.value = "";
});

/**
 * Cojemos la cookie y sacamos el nombre del usuario logado con el split
 */
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

/**
 * Easter egg
 */
var egg = new Egg();
egg.addCode("up,up,down,down,left,right,left,right,b,a", function () {
    window.location.href = "https://youtu.be/Zt_7L1eey2w";
    setTimeout(function () {
        document.body.style.background = "url('https://img.unocero.com/2021/08/rickroll_4k.jpeg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
        document.body.style.rotate = "5deg";
    }, 1000);
});

egg.addHook(function () {
    console.log("RICK ROLEADOOOOO");
}).listen();

/**
 * Funcion para generar la carta de música, ya que borraremos el contenido del div de resultado y cuando se quiera volver a ver las canciones se volverá a generar
 */
function addMusic() {
    let divMusic = document.createElement("div");
    divMusic.setAttribute('class', 'music');

    let divMusicFavourite = document.createElement("div");
    divMusicFavourite.setAttribute('class', 'music-favourite');
    let spanMusicFavourite = document.createElement("span");
    spanMusicFavourite.setAttribute('class', 'material-symbols-outlined');
    spanMusicFavourite.textContent = "bookmark";
    divMusicFavourite.appendChild(spanMusicFavourite);

    let divMusicImage = document.createElement("div");
    divMusicImage.setAttribute('class', 'music-image');
    let musicImg = document.createElement("img");
    musicImg.setAttribute('src', 'https://mir-s3-cdn-cf.behance.net/projects/404/81b040140655383.Y3JvcCwxMDEzLDc5Miw0NTMsMTQy.jpg');
    divMusicImage.appendChild(musicImg);

    let divMusicContent = document.createElement("div");
    divMusicContent.setAttribute('class', 'music-content');
    let pTitle = document.createElement("p");
    pTitle.setAttribute('id', 'music-title');
    pTitle.textContent = "TEST";
    let pArtirs = document.createElement("p");
    pArtirs.setAttribute('id', 'music-artist');
    pArtirs.textContent = "Test";
    let pLenguaje = document.createElement("p");
    pLenguaje.setAttribute('id', 'music-leanguaje');
    pLenguaje.textContent = "en";
    let aSeeSong = document.createElement("a");
    aSeeSong.textContent = "See song🎵";
    aSeeSong.setAttribute('href', '#');
    divMusicContent.appendChild(pTitle);
    divMusicContent.appendChild(pArtirs);
    divMusicContent.appendChild(pLenguaje);
    divMusicContent.appendChild(aSeeSong);

    divMusic.appendChild(divMusicFavourite);
    divMusic.appendChild(divMusicImage);
    divMusic.appendChild(divMusicContent);

    divResultado.appendChild(divMusic);
};

document.addEventListener("DOMContentLoaded", function () {
    addMusic();
});
