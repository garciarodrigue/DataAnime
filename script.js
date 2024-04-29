
// Función para buscar anime
function search() {
    var query = document.getElementById('search_query').value;

    var requestUrl = `https://api.jikan.moe/v4/anime?q=${query}&sfw`;
    document.getElementById('search_query_url').innerHTML = 'fetching...';
    document.getElementById('search_query_url').href = 'javascript:void(null)';

    let startTime = new Date().getTime();

    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        let timeTaken = new Date().getTime() - startTime;

        document.getElementById('search_query_url').innerHTML = requestUrl;
        document.getElementById('search_query_url').href = requestUrl;

        var node = document.getElementById('search_results');
        while (node.firstChild) {node.removeChild(node.firstChild);}

        const maxResults = 50;
        let i = 1;

        try {
            data.data.forEach(item => {
                // Filtrar límite del lado del cliente
                if (i > maxResults) {
                    throw BreakException;
                }

                document.getElementById('search_results')
                .insertAdjacentHTML(
                    'beforeend',
                    `
                        <a href="${item.url}" class="card">
                        <div class="card__image">
                            <img loading="lazy" src="${item.images.jpg.large_image_url}" alt="${item.title}" />
                        </div>
                        <div class="card__name">
                            <span class="titulo">${item.title}</span>
                           <br>
                            <span class="puntuacion">Puntuacion: ${item.score}</span>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg><sub class="fav">${item.favorites}</sub>
                            <br>
                            <h5>Tipo: <sub>
                            <span> ${item.type}</span></h5>
                            <h5>Episodios: <sub>
                            <span> ${item.episodes}<sub> ${item.status}</span></h5>
                            <h3>Sinopsis</h3>
                            <p> ${item.synopsis}</p>
                            <h4 class="fans">Fans: ${item.members}</h4>
                            
                        </div>
                    </a>
                    `
                );

                i++;
            });
        } catch (e) {
            //
        }

        // Llamar a la función para buscar información detallada de cada anime
        buscarDetallesAnime(data.data);

    })
    .catch(error => {
        console.error('Error al buscar anime:', error);
    });
}

// Event listeners para buscar anime al hacer clic en el botón o presionar Enter
document.getElementById('search').onclick = () => search();
document.getElementById('search_query').onkeydown = (event) => {
    if (event.keyCode === 13) {
        search();
    }
};

// Cargar lista de contribuidores de Jikan desde GitHub al cargar la página
window.addEventListener('load', () => {
    fetch('https://api.github.com/repos/jikan-me/jikan/contributors')
    .then(response => response.json())
    .then(data => {
        data.forEach(node => {
            document.getElementById('contributors').insertAdjacentHTML(
                'beforeend',
                `<a target="_blank" href="https://github.com/${node.login}" title="${node.login}">
                        <img alt="${node.login}" src="${node.avatar_url}" />
                </a>`
            );
        })
    })
    .catch(error => console.error('Error al cargar la lista de contribuidores:', error));
});


