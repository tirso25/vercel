const url = 'https://spotify23.p.rapidapi.com/search/';
const RAPIDAPI_KEY = 'f478dd7122mshbc5dc881ac54776p13fa68jsncee710ea87ff';
const delayTime = 1;
const limit = 4;
const contenedor = document.getElementById('resultados');

/**
 * Obtiene una lista de canciones basada en un offset aleatorio o un nombre de artista.
 * @param {number} offset - Número aleatorio para obtener una canción aleatoria.
 * @param {string} nombreArtista - Nombre del artista para buscar canciones específicas.
 * @returns {Promise} - Promesa con los datos de las canciones.
 */
function fetchCanciones(offset, nombreArtista = "") {
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
function fetchLetra(idCancion) {
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
    const { nombreCancion, nombreArtista, letra, lenguaje, img } = data;
    removeLoader();
    addMusic(nombreCancion, nombreArtista, idiomaElegido || lenguaje, img);
    removeLoader();

    const aSeeSong = contenedor.querySelector('.music:last-child .music-content button');
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
    if (!idiomaElegido) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Introduce un lenguaje válido."
        });
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
                    mostrarCancion(cancion, contenedor, idiomaElegido);
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

                const letraData = await fetchLetra(idCancion);
                removeLoader();
                mostrarCancion({ nombreCancion, nombreArtista, letra: letraData.lyrics.lines.map(line => line.words).join('<br>'), img }, contenedor);
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
            removeLoader();
        }
    } catch (error) {
        console.error('Error en la búsqueda por canción:', error);
        removeLoader();
    }
}

/**
 * Función para agregar una canción al contenedor de resultados.
 * @param {string} nombreCancion - Nombre de la canción.
 * @param {string} nombreArtista - Nombre del artista.
 * @param {string} idioma - Idioma de la canción.
 * @param {string} img - URL de la imagen de la canción.
 */
function addMusic(nombreCancion, nombreArtista, idioma, img) {
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
    musicImg.setAttribute('src', img);
    divMusicImage.appendChild(musicImg);

    let divMusicContent = document.createElement("div");
    divMusicContent.setAttribute('class', 'music-content');
    let pTitle = document.createElement("p");
    pTitle.setAttribute('id', 'music-title');
    pTitle.textContent = nombreCancion;
    let pArtirs = document.createElement("p");
    pArtirs.setAttribute('id', 'music-artist');
    pArtirs.textContent = nombreArtista + "🧑‍🎤";
    let pLenguaje = document.createElement("p");
    pLenguaje.setAttribute('id', 'music-leanguaje');
    pLenguaje.textContent = idioma;

    // Cambiar el elemento <a> por un <button>
    let buttonSeeSong = document.createElement("button");
    buttonSeeSong.textContent = "See song🎵";
    buttonSeeSong.setAttribute('class', 'button'); // Aplicar la clase de estilo
    buttonSeeSong.setAttribute('type', 'button'); // Especificar el tipo de botón

    divMusicContent.appendChild(pTitle);
    divMusicContent.appendChild(pArtirs);
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
    const card = document.createElement("div");
    card.classList.add("card");

    const titulo = document.createElement("h2");
    titulo.textContent = cancion.nombreCancion;
    titulo.classList.add("titulo");

    const artista = document.createElement("p");
    artista.textContent = `Artista: ${cancion.nombreArtista}`;
    artista.classList.add("artista");

    const idioma = document.createElement("p");
    idioma.textContent = `Idioma: ${cancion.idioma}`;
    idioma.classList.add("idioma");

    const letra = document.createElement("div");
    letra.innerHTML = `<strong>Letra:</strong><br>${cancion.letra}`;
    letra.classList.add("letra");

    card.appendChild(titulo);
    card.appendChild(artista);
    card.appendChild(idioma);
    card.appendChild(letra);

    const goBack = document.createElement("a");
    goBack.textContent = "Go back";
    goBack.setAttribute("class", "button");
    goBack.addEventListener("click", function () {
        contenedor.innerHTML = "";
    });

    contenedor.appendChild(card);
    contenedor.appendChild(goBack);
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

// Event listener para el botón de búsqueda
document.getElementById('searchButton').addEventListener('click', () => {
    const idiomaElegido = document.getElementById('lenguaje').value.trim();
    const nombreCancion = document.getElementById('nombreCancion').value.trim();
    addLoader();
    if (nombreCancion === "") {
        buscarPorIdioma(idiomaElegido);
    } else {
        buscarPorCancion(nombreCancion);
    }
});