const url = 'https://spotify23.p.rapidapi.com/search/';
const query = 'track';
const limit = 1;
const delayTime = 1;
const contenedor = document.getElementById('resultados');

function addMusic(nombreCancion, nombreArtista, idioma, img) {
    let divMusic = document.createElement("div");
    divMusic.setAttribute('class', 'music');

    let divMusicFavourite = document.createElement("div");
    divMusicFavourite.setAttribute('class', 'music-favourite');
    let spanMusicFavourite = document.createElement("span"); amenud
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

    contenedor.appendChild(divMusic);
};

function addLoader() {
    // Crear el contenedor principal
    const wheelAndHamster = document.createElement('div');
    wheelAndHamster.setAttribute('aria-label', 'Orange and tan hamster running in a metal wheel');
    wheelAndHamster.setAttribute('role', 'img');
    wheelAndHamster.classList.add('wheel-and-hamster');

    // Crear la rueda
    const wheel = document.createElement('div');
    wheel.classList.add('wheel');

    // Crear el contenedor del hamster
    const hamster = document.createElement('div');
    hamster.classList.add('hamster');

    // Crear el cuerpo del hamster
    const hamsterBody = document.createElement('div');
    hamsterBody.classList.add('hamster__body');

    // Crear la cabeza del hamster
    const hamsterHead = document.createElement('div');
    hamsterHead.classList.add('hamster__head');

    // Crear la oreja del hamster
    const hamsterEar = document.createElement('div');
    hamsterEar.classList.add('hamster__ear');

    // Crear el ojo del hamster
    const hamsterEye = document.createElement('div');
    hamsterEye.classList.add('hamster__eye');

    // Crear la nariz del hamster
    const hamsterNose = document.createElement('div');
    hamsterNose.classList.add('hamster__nose');

    // Crear las extremidades del hamster
    const hamsterLimbFR = document.createElement('div');
    hamsterLimbFR.classList.add('hamster__limb', 'hamster__limb--fr');

    const hamsterLimbFL = document.createElement('div');
    hamsterLimbFL.classList.add('hamster__limb', 'hamster__limb--fl');

    const hamsterLimbBR = document.createElement('div');
    hamsterLimbBR.classList.add('hamster__limb', 'hamster__limb--br');

    const hamsterLimbBL = document.createElement('div');
    hamsterLimbBL.classList.add('hamster__limb', 'hamster__limb--bl');

    // Crear la cola del hamster
    const hamsterTail = document.createElement('div');
    hamsterTail.classList.add('hamster__tail');

    // Crear el radio de la rueda
    const spoke = document.createElement('div');
    spoke.classList.add('spoke');

    // Ensamblar la estructura
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

    contenedor.appendChild(wheelAndHamster);
}

/**
 * Se utiliza para sacar los ids de las canciones para usarlos posteriormente en otras funciones
 * @param {*} offset Esta funcion recibe 'offset', que seria un numero random generado al iniciar la funcion padre, este offset seria un numero aleatorio del 0 al 1000 para sacar una cancion aleatoria en spotify
 * @returns 
 */
function fetchCanciones(offset, nombreArtista) {
    //url es la url de la api,query lo que queremos buscar,en este caso "track" que es cancion, offset mencionado anteriormente como una cancion alazar y limit para sacar un limite de canciones

    if (offset === 0 && nombreArtista != "") {
        return fetch(`${url}?q=${nombreArtista}&type=tracks&limit=1`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
                'X-RapidAPI-Key': 'c7daf20fefmsh7c7e44dc5987bc7p1bdd58jsn40bc8bbbd0c7',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json());
    } else {
        return fetch(`${url}?q=${query}&type=track&offset=${offset}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
                'X-RapidAPI-Key': 'c7daf20fefmsh7c7e44dc5987bc7p1bdd58jsn40bc8bbbd0c7',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json());
    }

}

/**
 *  Esta funcion recibe el id de la cancion recibido de la funcion fetchCanciones, index es la posicion de la cancion, userLenguage es el idioma que el usuario escribe por teclado,contenedor es el contenido del artista,nombre de la cancion etc,nombreCancion el nombre de la cancion y nombreArtista el nombre del artista
 * @param {*} idCancion 
 * @param {*} index 
 * @param {*} idiomaElegido 
 * @param {*} contenedor 
 * @param {*} nombreCancion 
 * @param {*} nombreArtista 
 */
function fetchLetra(idCancion, index, idiomaElegido = null, contenedor, nombreCancion, nombreArtista) {
    fetch(`https://spotify23.p.rapidapi.com/track_lyrics/?id=${idCancion}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
            'X-RapidAPI-Key': 'c7daf20fefmsh7c7e44dc5987bc7p1bdd58jsn40bc8bbbd0c7',
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            let lenguaje = data["lyrics"]["language"];
            if (idiomaElegido === null) {
                let letra = "";
                for (let i = 0; i < data.lyrics.lines.length; i++) {
                    letra += data.lyrics.lines[i].words + "\n" + "<br>";
                }

                const contenedorCancion = document.createElement('div');
                contenedorCancion.innerHTML = `<p>Canción: ${nombreCancion} - Artista: ${nombreArtista}</p>`;

                const elegirBtn = document.createElement('button');
                elegirBtn.textContent = "Elegir";
                const favCancion = document.createElement('button')
                favCancion.textContent = "Agregar Favorita";

                contenedorCancion.innerHTML += "<br>";
                contenedorCancion.appendChild(elegirBtn);

                contenedor.appendChild(contenedorCancion);
                contenedor.appendChild(favCancion);

                elegirBtn.addEventListener('click', () => {
                    const parametros = new URLSearchParams({
                        nombreCancion: nombreCancion,
                        nombreArtista: nombreArtista,
                        letra: letra
                    }).toString();

                    window.location.href = `cancionElegida.html?${parametros}`;
                });
            } else if (idiomaElegido != null && lenguaje === idiomaElegido) {
                let letra = "";
                for (let i = 0; i < data.lyrics.lines.length; i++) {
                    letra += data.lyrics.lines[i].words + "\n" + "<br>";
                }
                contenedor.innerHTML = '';

                const img = data.albumOfTrack.coverArt.sources[0].url || 'default-image-url.jpg';
                console.log(img)

                // Llama a addMusic para agregar la canción al contenedor
                addMusic(nombreCancion, nombreArtista, data.lyrics.language, img);

                const elegirBtn = document.createElement('button');
                elegirBtn.textContent = "Elegir";

                contenedor.appendChild(elegirBtn);

                elegirBtn.addEventListener('click', () => {
                    const parametros = new URLSearchParams({
                        nombreCancion: nombreCancion,
                        nombreArtista: nombreArtista,
                        letra: letra,
                        idioma: idiomaElegido
                    }).toString();

                    window.location.href = `cancionElegida.html?${parametros}`;
                });
            } else {
                contenedor.innerHTML = "";
                buscarPorIdioma(idiomaElegido);
            }
        })
        .catch(error => {
            console.error('Error al obtener la letra o el idioma:', error);
            if (idiomaElegido != null || contenedor.value == "") {
                contenedor.innerHTML = '';
                buscarPorIdioma(idiomaElegido);
            }
        });
}

/**
 * Funcion padre,recibe el idioma que el usuario ha decidido ,comprueba este lenguaje,y llama a las dos funciones mencionadas anteriormente para hacer los 2 fetchs
 * @param {*} idiomaElegido 
 * @returns 
 */
function buscarPorIdioma(idiomaElegido) {
    if (!idiomaElegido) {
        alert('Introduce un lenguaje válido');
        return;
    }

    let offset = Math.floor(Math.random() * 1000);
    contenedor.innerHTML = '';
    //Hacemos el fetch de canciones para sacar aleatoriamente 1 cancion y sacar el id,nombre y artista de esta cancion
    fetchCanciones(offset)
        .then(data => {
            const tracks = data.tracks.items;
            if (tracks.length > 0) {
                tracks.forEach((track, index) => {
                    const idCancion = track.data.id;
                    const nombreCancion = track.data.name;
                    const nombreArtista = track.data.artists.items[0].profile.name;
                    console.log(track);
                    console.log(`Obteniendo idioma de la canción con ID: ${idCancion}`);
                    //Hacemos el fetch de la leltra para sacar el lenguaje de la cancion y la letra de esta
                    fetchLetra(idCancion, index, idiomaElegido, contenedor, nombreCancion, nombreArtista);
                });
            } else {
                contenedor.innerHTML = 'No se encontraron canciones para la consulta.';
            }
        })
        .catch(error => {
            console.error('Error al obtener las canciones:', error);
        });
}

function buscarPorCancion(nombreCancion) {
    var offset = 0;
    contenedor.innerHTML = '';
    //Hacemos el fetch de canciones para sacar aleatoriamente 1 cancion y sacar el id,nombre y artista de esta cancion
    fetchCanciones(offset, nombreCancion)
        .then(data => {
            const tracks = data.tracks.items;
            tracks.forEach((track, index) => {
                const idCancion = track.data.id;
                const nombreCancion = track.data.name;
                const nombreArtista = track.data.artists.items[0].profile.name;
                fetchLetra(idCancion, index, null, contenedor, nombreCancion, nombreArtista);
            });
        })
        .catch(error => {
            console.error('Error al obtener las canciones:', error);
        });
}

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