const url = 'https://spotify23.p.rapidapi.com/search/';
const RAPIDAPI_KEY = '3486e94ed2msh341e1569c47f816p1e4672jsn3a98930986d6';
const delayTime = 1;
const limit = 3;
const contenedor = document.getElementById('resultados');
// La 'cookieSeparadas' está definida previamente.
const idUsuario = cookieSeparadas[1].split('=')[1];

/**
 * Obtiene una lista de canciones basada en un offset aleatorio o un nombre de artista.
 * @param {number} offset - Número aleatorio para obtener una canción aleatoria.
 * @param {string} nombreArtista - Nombre del artista para buscar canciones específicas.
 * @returns {Promise} - Promesa con los datos de las canciones.
 */
async function fetchCanciones(offset, nombreArtista = "") {
    const query = nombreArtista ? nombreArtista : 'track';//TERNARIA (COMO UN IF)
    const endpoint = nombreArtista ? `${url}?q=${nombreArtista}&type=track&limit=${limit}` : `${url}?q=${query}&type=track&offset=${offset}&limit=${limit}`;

    return fetch(endpoint, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error al obtener las canciones:', error);
            throw error;
        });
}

/**
 * Obtiene la letra y el idioma de una canción.
 * @param {string} idCancion - ID de la canción.
 * @returns {Promise} - Promesa con los datos de la letra y el idioma.
 */
async function fetchLetra(idCancion) {
    return fetch(`https://spotify23.p.rapidapi.com/track_lyrics/?id=${idCancion}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error al obtener la letra:', error);
            throw error;
        });
}

/**
 * Muestra la canción en el contenedor de resultados usando la función addMusic.
 * @param {Object} data - Datos de la canción.
 * @param {HTMLElement} contenedor - Contenedor donde se mostrará la canción.
 * @param {string} idiomaElegido - Idioma deseado (opcional).
 */
function mostrarCancion(data, contenedor, idiomaElegido = null) {
    const { idCancion, nombreCancion, nombreArtista, letra, lenguaje, img } = data;
    removeLoader();
    addMusic(idCancion, nombreCancion, nombreArtista, idiomaElegido || lenguaje, img);
    removeLoader();

    const aSeeSong = contenedor.querySelector('.music:last-child .music-content #seeSong');
    aSeeSong.addEventListener('click', () => {
        const parametros = {
            nombreCancion,
            nombreArtista,
            letra,
            idioma: idiomaElegido || lenguaje
        };

        contenedor.innerHTML = "";
        addLetter(parametros);
    });
}

/**
 * Busca canciones por idioma. Si no encuentra una canción en el idioma deseado, vuelve a buscar.
 * @param {string} idiomaElegido - Idioma deseado.
 * @param {number} intentos - Número de intentos realizados (opcional, para evitar bucles infinitos).
 * @param {Array} cancionesAcumuladas - Canciones encontradas hasta el momento (opcional).
 */
async function buscarPorIdioma(idiomaElegido, intentos = 0, cancionesAcumuladas = []) {
    if (!idiomaElegido || idiomaElegido == 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Introduce un lenguaje válido."
        });
        removeLoader()
        return;
    }

    const contenedor = document.getElementById('resultados');
    contenedor.innerHTML = '';

    addLoader();

    const MAX_INTENTOS = 5;
    const LIMIT = 4;

    if (intentos >= MAX_INTENTOS) {
        removeLoader();
        if (cancionesAcumuladas.length > 0) {
            cancionesAcumuladas.forEach(cancion => {
                mostrarCancion(cancion, contenedor, idiomaElegido);
            });
        } else {
            removeLoader();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `No se encontraron suficientes canciones en el idioma especificado después de ${MAX_INTENTOS} intentos.`
            });
            removeLoader();
        }
        removeLoader();
        return;
    }

    console.log(`Intento ${intentos + 1} de ${MAX_INTENTOS}. Canciones encontradas: ${cancionesAcumuladas.length} de ${LIMIT}`)

    let offset = Math.floor(Math.random() * 1000);

    try {
        const data = await fetchCanciones(offset);
        const tracks = data.tracks.items;

        if (tracks.length > 0) {
            for (const track of tracks) {
                const idCancion = track.data.id;
                const nombreCancion = track.data.name;
                const nombreArtista = track.data.artists.items[0].profile.name;
                const img = track.data.albumOfTrack.coverArt.sources[0].url;

                const letraData = await fetchLetra(idCancion);
                const lenguaje = letraData.lyrics.language;

                if (lenguaje === idiomaElegido) {
                    cancionesAcumuladas.push({
                        nombreCancion,
                        nombreArtista,
                        letra: letraData.lyrics.lines.map(line => line.words).join('<br>'),
                        lenguaje,
                        img
                    });

                    if (cancionesAcumuladas.length >= LIMIT) {
                        break;
                    }
                }
            }

            if (cancionesAcumuladas.length >= LIMIT) {
                removeLoader();
                cancionesAcumuladas.forEach(cancion => {
                    mostrarCancion(idCancion, cancion, contenedor, idiomaElegido);
                });
                return;
            }
        } else {
            removeLoader();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se encontraron canciones para la consulta."
            });
            removeLoader();
        }
    } catch (error) {
        console.error('Error en la búsqueda por idioma:', error);
        removeLoader();
    }

    buscarPorIdioma(idiomaElegido, intentos + 1, cancionesAcumuladas);
    addFav();
}

/**
 * Busca canciones por nombre.
 * @param {string} nombreCancion - Nombre de la canción o artista.
 */
async function buscarPorCancion(nombreCancion) {
    const contenedor = document.getElementById('resultados');
    contenedor.innerHTML = '';

    addLoader();

    try {
        const data = await fetchCanciones(0, nombreCancion);
        const tracks = data.tracks.items;

        if (tracks.length > 0) {
            for (const track of tracks) {
                const idCancion = track.data.id;
                const nombreCancion = track.data.name;
                const nombreArtista = track.data.artists.items[0].profile.name;
                const img = track.data.albumOfTrack.coverArt.sources[0].url;

                try {
                    const letraData = await fetchLetra(idCancion);
                    if (!letraData || !letraData.lyrics || !letraData.lyrics.lines) {
                        throw new Error("No se encontró la letra");
                    }

                    mostrarCancion({
                        idCancion,
                        nombreCancion,
                        nombreArtista,
                        letra: letraData.lyrics.lines.map(line => line.words).join('<br>'),
                        lenguaje: letraData.lyrics.language,
                        img
                    }, contenedor);

                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No se ha podido encontrar la letra de la canción."
                    });
                }

                removeLoader();
            }

            removeLoader();
        } else {
            removeLoader();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se encontraron canciones para la consulta."
            });
        }
    } catch (error) {
        console.error('Error en la búsqueda por canción:', error);
        removeLoader();
    }
    addFav();
}

/**
 * Función para agregar una canción al contenedor de resultados.
 * @param {string} nombreCancion - Nombre de la canción.
 * @param {string} nombreArtista - Nombre del artista.
 * @param {string} idioma - Idioma de la canción.
 * @param {string} img - URL de la imagen de la canción.
 */
function addMusic(idCancion, nombreCancion, nombreArtista, idioma, img) {
    let divMusic = document.createElement("div");
    divMusic.setAttribute('class', 'music');

    let divMusicFavourite = document.createElement("div");
    divMusicFavourite.setAttribute('class', 'music-favourite');
    let spanMusicFavourite = document.createElement("span");
    spanMusicFavourite.setAttribute('class', 'material-symbols-outlined');
    spanMusicFavourite.setAttribute('id', idCancion);
    spanMusicFavourite.textContent = "bookmark";
    divMusicFavourite.appendChild(spanMusicFavourite);

    let divMusicImage = document.createElement("div");
    divMusicImage.setAttribute('class', 'music-image');
    let musicImg = document.createElement("img");
    musicImg.setAttribute('src', img);
    divMusicImage.appendChild(musicImg);

    let divMusicContent = document.createElement("div");
    divMusicContent.setAttribute('class', 'music-content');

    let pTitle = document.createElement("p");
    pTitle.setAttribute('id', 'music-title');
    pTitle.textContent = nombreCancion;

    let buttonArtirs = document.createElement("button");
    buttonArtirs.setAttribute('id', 'music-artist');
    buttonArtirs.setAttribute('class', 'button');
    buttonArtirs.setAttribute('type', 'button');
    buttonArtirs.textContent = nombreArtista;//+ "🧑‍🎤"
    buttonArtirs.addEventListener("click", () => buscarArtista(buttonArtirs.textContent));

    let pLenguaje = document.createElement("p");
    pLenguaje.setAttribute('id', 'music-leanguaje');
    pLenguaje.textContent = idioma;

    let buttonSeeSong = document.createElement("button");
    buttonSeeSong.textContent = "See song🎵";
    buttonSeeSong.setAttribute('id', 'seeSong');
    buttonSeeSong.setAttribute('class', 'button');
    buttonSeeSong.setAttribute('type', 'button');

    divMusicContent.appendChild(pTitle);
    divMusicContent.appendChild(buttonArtirs);
    divMusicContent.appendChild(pLenguaje);
    divMusicContent.appendChild(buttonSeeSong);

    divMusic.appendChild(divMusicFavourite);
    divMusic.appendChild(divMusicImage);
    divMusic.appendChild(divMusicContent);

    contenedor.appendChild(divMusic);
}

/**
 * Muestra el loader en el centro de la pantalla.
 */
function addLoader() {
    const loaderContainer = document.createElement('div');
    loaderContainer.classList.add('loader-container');

    const wheelAndHamster = document.createElement('div');
    wheelAndHamster.setAttribute('aria-label', 'Orange and tan hamster running in a metal wheel');
    wheelAndHamster.setAttribute('role', 'img');
    wheelAndHamster.classList.add('wheel-and-hamster');

    const wheel = document.createElement('div');
    wheel.classList.add('wheel');

    const hamster = document.createElement('div');
    hamster.classList.add('hamster');

    const hamsterBody = document.createElement('div');
    hamsterBody.classList.add('hamster__body');

    const hamsterHead = document.createElement('div');
    hamsterHead.classList.add('hamster__head');

    const hamsterEar = document.createElement('div');
    hamsterEar.classList.add('hamster__ear');

    const hamsterEye = document.createElement('div');
    hamsterEye.classList.add('hamster__eye');

    const hamsterNose = document.createElement('div');
    hamsterNose.classList.add('hamster__nose');

    const hamsterLimbFR = document.createElement('div');
    hamsterLimbFR.classList.add('hamster__limb', 'hamster__limb--fr');

    const hamsterLimbFL = document.createElement('div');
    hamsterLimbFL.classList.add('hamster__limb', 'hamster__limb--fl');

    const hamsterLimbBR = document.createElement('div');
    hamsterLimbBR.classList.add('hamster__limb', 'hamster__limb--br');

    const hamsterLimbBL = document.createElement('div');
    hamsterLimbBL.classList.add('hamster__limb', 'hamster__limb--bl');

    const hamsterTail = document.createElement('div');
    hamsterTail.classList.add('hamster__tail');

    const spoke = document.createElement('div');
    spoke.classList.add('spoke');

    hamsterHead.appendChild(hamsterEar);
    hamsterHead.appendChild(hamsterEye);
    hamsterHead.appendChild(hamsterNose);

    hamsterBody.appendChild(hamsterHead);
    hamsterBody.appendChild(hamsterLimbFR);
    hamsterBody.appendChild(hamsterLimbFL);
    hamsterBody.appendChild(hamsterLimbBR);
    hamsterBody.appendChild(hamsterLimbBL);
    hamsterBody.appendChild(hamsterTail);

    hamster.appendChild(hamsterBody);

    wheelAndHamster.appendChild(wheel);
    wheelAndHamster.appendChild(hamster);
    wheelAndHamster.appendChild(spoke);

    loaderContainer.appendChild(wheelAndHamster);
    document.body.appendChild(loaderContainer);
}

/**
 * Genera la letra de la canción a partir del objeto con la info del track
 * @param {*} cancion - objeto con la info del track
 */
function addLetter(cancion) {
    let cards = document.createElement("div");
    cards.style.display = "flex";
    cards.style.gap = "500px";
    cards.style.width = "100%"

    let card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "600px"

    const titulo = document.createElement("h2");
    titulo.textContent = cancion.nombreCancion;
    titulo.classList.add("titulo");

    const artista = document.createElement("p");
    artista.textContent = `Artista: ${cancion.nombreArtista}`;
    artista.classList.add("artista");

    const idioma = document.createElement("p");
    idioma.textContent = `Idioma: ${cancion.idioma}`;
    idioma.classList.add("idioma");
    const idiomaLetra = cancion.idioma;
    const letra = document.createElement("div");
    letra.innerHTML = `<strong>Letra:</strong><br>${cancion.letra}`;
    letra.classList.add("letra");
    const LetraATraducir = cancion.letra;

    card.appendChild(titulo);
    card.appendChild(artista);
    card.appendChild(idioma);
    card.appendChild(letra);
    cards.appendChild(card);

    const goBack = document.createElement("a");
    goBack.textContent = "Go back";
    goBack.setAttribute("class", "button");
    goBack.addEventListener("click", function () {
        contenedor.innerHTML = "";
    });

    const label = document.createElement('label');
    label.setAttribute('for', 'lenguaje');

    const select = document.createElement('select');
    select.setAttribute("class", "smooth-select");
    select.setAttribute('id', 'lenguaje');

    const idiomas = [
        { value: '0', text: 'Select a language' },
        { value: 'es', text: 'Español' },
        { value: 'en', text: 'Inglés' },
        { value: 'fr', text: 'Francés' },
        { value: 'de', text: 'Alemán' },
        { value: 'ru', text: 'Ruso' },
        { value: 'ja', text: 'Japonés' },
        { value: 'ca', text: 'Catalán' },
    ];

    idiomas.forEach(idioma => {
        const option = document.createElement('option');
        option.setAttribute('value', idioma.value);
        option.textContent = idioma.text;
        select.appendChild(option);
    });

    document.body.appendChild(select);

    const boton = document.createElement('button');
    boton.setAttribute('id', 'mostrarTraduccion');
    boton.setAttribute("class", "filter-button");
    const i = document.createElement("i");
    i.setAttribute("class", "fa-solid fa-language");
    let letraTraducida;
    let card2 = document.createElement("div");
    card2.classList.add("card");
    boton.appendChild(i);
    boton.addEventListener('click', () => {
        card2.innerHTML = ""

        const lenguajeSeleccionado = select.value;
        if (lenguajeSeleccionado != 0) {
            const urlTraduccion = 'https://google-translator9.p.rapidapi.com/v2';

            const options = {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: LetraATraducir,
                    source: idiomaLetra,
                    target: lenguajeSeleccionado,
                    format: 'text'
                })
            };

            fetch(urlTraduccion, options)
                .then(response => {

                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API: ' + response.status);
                    }
                    return response.json();
                })
                .then(resultado => {
                    const letra = document.createElement("div");
                    letraTraducida = resultado["data"]["translations"][0]["translatedText"]
                    letra.innerHTML = `<strong>Letra traducida :<br></strong><br>${letraTraducida}`;
                    letra.classList.add("letra");
                    card2.appendChild(letra);

                    cards.appendChild(card2)

                })
                .catch(error => {
                    console.error('Error al traducir:', error);
                });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Idioma no válido"
            });
        }
    });
    contenedor.appendChild(select)
    contenedor.appendChild(boton)
    contenedor.appendChild(goBack);
    contenedor.appendChild(cards);
}

/**
 * Elimina el loader del DOM.
 */
function removeLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        loaderContainer.remove();
    }
}

/**
 * Añadir favoritos
 */
function addFav() {
    //Obtener todos los elementos con la clase "material-symbols-outlined"
    let favs = document.getElementsByClassName("material-symbols-outlined");

    //Iteramos usando un bucle for para recorrer solo los índices numéricos
    for (let i = 0; i < favs.length; i++) {
        favs[i].addEventListener("click", favourite);
    }

    function favourite() {
        const data = {
            idSong: this.id,
            idUser: idUsuario,
        };
        console.log(data);
        fetch("/users/favs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                // Si la respuesta no es exitosa, se muestra el error y se detiene la cadena
                if (!response.ok) {
                    return response.json().then(mensaje => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: mensaje['mensaje']
                        });
                        mostrarNotificacion(mensaje['mensaje']);
                        throw new Error(mensaje['mensaje']);
                    });
                }
                return response.json();
            })
            .then(mensaje => {
                Swal.fire({
                    title: mensaje['mensaje'],
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                mostrarNotificacion(mensaje['mensaje']);
                setTimeout(() => {
                    window.location.href = "/";
                }, 1700);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
}

/**
 * Medianmte fetch atacamos a nuestro endpoint, obtenemos los id de las canciones guardadas y llamamos a mostrarCancionFavorita para imprimirlas
 * @param {*} idUser - el id del usuario actual sacado mediante el split a la cookie
 */
async function getFavourites(idUser) {
    try {
        const response = await fetch("/ver/favs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idUser })
        });

        const canciones = await response.json();

        contenedor.innerHTML = '';

        for (const cancion of canciones.cancionesArray.rows) {
            const idCancion = cancion.id_song;
            await mostrarCancionFavorita(idCancion, contenedor);
        }

    } catch (error) {
        console.error("Error al obtener favoritos:", error);
    }
}

/**
 * Obtiene la información completa de una canción y la muestra en el contenedor.
 * @param {string} idCancion - ID de la canción.
 * @param {HTMLElement} contenedor - Contenedor donde se mostrará la canción.
 */
async function mostrarCancionFavorita(idCancion, contenedor) {
    try {
        const trackInfo = await fetch(`https://spotify23.p.rapidapi.com/tracks/?ids=${idCancion}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'Content-Type': 'application/json',
            },
        }).then(response => response.json());

        const track = trackInfo.tracks[0];
        const nombreCancion = track.name;
        const nombreArtista = track.artists[0].name;
        const img = track.album.images[0].url;

        const letraData = await fetchLetra(idCancion);
        const lenguaje = letraData.lyrics.language;
        const letra = letraData.lyrics.lines.map(line => line.words).join('<br>');

        mostrarCancion({ idCancion, nombreCancion, nombreArtista, letra, lenguaje, img }, contenedor);
        addFav();
    } catch (error) {
        console.error('Error al obtener la información de la canción:', error);
    }
}

/**
 * Función para mostrar la notificación
 * @param {*} mensaje - Dependiendo de la acción muestra un mensaje u otro
 */
function mostrarNotificacion(mensaje) {
    var opciones = {
        body: mensaje,
        icon: "https://via.placeholder.com/100",
        tag: "notificacion-demo",
        requireInteraction: true
    };

    var notificacion = new Notification("¡Notificación Activa!", opciones);

    notificacion.onclick = function () {
        window.open("https://www.google.com");
    };

    notificacion.onclose = function () {
        console.log("Notificación cerrada.");
    };

    notificacion.onshow = function () {
        console.log("Notificación mostrada.");
    };

    notificacion.onerror = function () {
        console.log("Error al mostrar la notificación.");
    };
}

/**
 * FUncióm para obtener información de un artista
 * @param {*} artista - Nombre del artista pasado mediante un evento click al crearse la carta con la información de la musica
 */
async function buscarArtista(artista) {
    try {
        const response = await fetch(`https://spotify23.p.rapidapi.com/search?q=${artista}&type=artist&limit=5`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
                'X-RapidAPI-Key': 'ff51a3b669msh24bec5edc06d06ap1dab0ejsnddf24f4fd9ad',
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        const artistaData = data.artists.items[0].data.profile;
        const avatarUrl = data.artists.items[0].data.visuals.avatarImage.sources[2].url;
        const canciones = data.albums.items.map(album => album.data.name);

        contenedor.innerHTML = "";

        let cards = document.createElement("div");
        cards.classList.add("cards-container");

        let card = document.createElement("div");
        card.classList.add("card");

        let titulo = document.createElement("h2");
        titulo.textContent = `Canciones recomendadas por Spotify de ${artistaData.name}`;
        titulo.classList.add("titulo");

        let listaCanciones = document.createElement("ul");
        listaCanciones.classList.add("lista-canciones");
        canciones.forEach(cancion => {
            let li = document.createElement("li");
            li.textContent = cancion;
            listaCanciones.appendChild(li);
        });

        let img = document.createElement("img");
        img.setAttribute("src", avatarUrl);
        img.classList.add("artista-img");

        let imgTitulo = document.createElement("h3");
        imgTitulo.textContent = `Foto de ${artistaData.name}`;

        const goBack = document.createElement("a");
        goBack.textContent = "Go back";
        goBack.setAttribute("class", "button");
        goBack.addEventListener("click", function () {
            contenedor.innerHTML = "";
        });

        card.appendChild(titulo);
        card.appendChild(listaCanciones);
        card.appendChild(imgTitulo);
        card.appendChild(img);
        cards.appendChild(card);

        contenedor.appendChild(cards);
        contenedor.appendChild(goBack);
    } catch (error) {
        console.error("Error al obtener datos del artista:", error);
    }
}

// Event listener para el botón de ver favoritos
document.querySelector('.user-container').addEventListener("click", () => getFavourites(idUsuario));

// Event listener para el botón de búsqueda
document.getElementById('searchButton').addEventListener('click', () => {
    const idiomaElegido = document.getElementById('lenguaje').value.trim();
    const nombreCancion = document.getElementById('nombreCancion').value.trim();
    addLoader();
    !nombreCancion ? buscarPorIdioma(idiomaElegido) : buscarPorCancion(nombreCancion);
});

//Comprobamos que tenga activado tanto las notificaciones como la geolocalización
document.addEventListener("DOMContentLoaded", function () {
    if (Notification.permission === "granted") {
        console.log("Permiso de notificación ya concedido.");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permiso) {
            if (permiso === "granted") {
                console.log("Permiso de notificación concedido.");

            } else {
                console.warn("Permiso de notificación denegado.");
            }
        });
    }

    if ("geolocation" in navigator) {
        console.log("La API de geolocalización está disponible.");
    } else {
        console.error("La API de geolocalización no es compatible con este navegador.");
    }
    Notification.requestPermission(function (permission) {
        console.log("El estado actual del permiso es", permission);
    });

    if ("geolocation" in navigator) {
        console.log("La API de geolocalización está disponible.");
    } else {
        console.error("La API de geolocalización no es compatible con este navegador.");
    }
    Notification.requestPermission(function (permission) {
        console.log("El estado actual del permiso es", permission);
    });

    // Llamada para recoger la ubicacion actual
    navigator.geolocation.getCurrentPosition(//successCallback, errorCallback, options)
        //Si es correcto
        function (position) {
            let notificacion = new Notification("Exito en conseguir tu ubicación", {
                body: "Ubicacion Obtenida",
                tag: "Ubi",
                requireInteraction: true,

            });
            console.log("Latitud:", position.coords.latitude);
            console.log("Longitud:", position.coords.longitude);
            /**
             * A partir de aqui usamos Leaflet como servicio de mapas Open Source
             */
            var map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            const marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map)
                .bindPopup('Esta es tu ubicación')
                .openPopup();
            marker.on('click', function () {
                mostrarNotificacion('TE VEO');
            });
            //GENERAMOS 7 CONCIERTOS
            const MAX_CONCERTS = 5;
            for (let i = 0; i < MAX_CONCERTS; i++) {
                //GENERAR UN CORCIERTO AL AZAR
                const numeroAleatorio = Math.floor(Math.random() * 90) + 10;
                fetch(`https://concerts-artists-events-tracker.p.rapidapi.com/festival/infos?festival_id=1573${numeroAleatorio}`, {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Host': 'concerts-artists-events-tracker.p.rapidapi.com',
                        'X-RapidAPI-Key': RAPIDAPI_KEY,
                        'Content-Type': 'application/json',
                    }
                }).then(response => response.json()).
                    then(data => {
                        console.log(data);
                        const marker = L.marker([data.data.latitude, data.data.longitude]).addTo(map).bindPopup(data.data.name).openPopup();
                        marker.on('click', function () {
                            mostrarNotificacion(`Concierto: ${data.data.name}`);
                        });
                    })
            }
            const conciertos = {
                1: {
                    latitude: 40.3517,
                    longitude: -3.6957,
                    nombre: 'RBF (La Caja Magica)'
                },
                2: {
                    latitude: 40.4238,
                    longitude: -3.6683,
                    nombre: 'Luis Fonsi (Wizink Center)'
                },
                3: {
                    latitude: 40.4531,
                    longitude: -3.6884,
                    nombre: 'Aitana (Santiago Bernabeu)'
                },
                4: {
                    latitude: 40.4362,
                    longitude: -3.5995,
                    nombre: 'Feid (Wanda Metropolitano)'
                }
            }
            console.log("conciertos Madrid")
            for (let concierto in conciertos) {
                L.marker([conciertos[concierto].latitude, conciertos[concierto].longitude]).addTo(map).bindPopup(conciertos[concierto].nombre).openPopup();
            }
        },
        // Si da error
        function (error) {
            console.error("Error al obtener la ubicación:", error.message);
            let notificacion = new Notification("Error en la ubicación", {
                body: "Permiso Denegado",
                tag: "Error",
                requireInteraction: true,
            });

            if (error.code === 1) {
                console.log("Permiso denegado.");

            } else if (error.code === 2) {
                console.log("No se pudo determinar la ubicación/ubicacion no disponible.");
            } else if (error.code === 3) {
                console.log("Tiempo de espera agotado.");
            }
        },
        // Otras opciones
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
});