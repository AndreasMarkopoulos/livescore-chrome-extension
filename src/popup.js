const API_URL = "https://www.scorebat.com/video-api/v1/";

function fetchMatches() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const matches = data.response;
            const search = document.getElementById("search");
            const watchlist = document.getElementById("watchlist");

            search.addEventListener("keyup", () => {
                const query = search.value.toLowerCase();
                const filteredMatches = matches.filter(match => match.title.toLowerCase().includes(query));
                console.log(filteredMatches)
                renderMatches(filteredMatches);
            });

            renderMatches(matches);

            function renderMatches(matches) {
                watchlist.innerHTML = "";
                matches.forEach(match => {
                    const li = document.createElement("li");
                    li.innerText = match.title;
                    li.addEventListener("click", () => {
                        const id = match.id;
                        chrome.storage.local.get("watchlist", data => {
                            const watchlist = data.watchlist || [];
                            if (!watchlist.includes(id)) {
                                watchlist.push(id);
                                chrome.storage.local.set({watchlist}, () => {
                                    getScore(id);
                                });
                            }
                        });
                    });
                    watchlist.appendChild(li);
                });
            }
        });
}

function getScore(id) {
    const SCORE_URL = `https://www.scorebat.com/video-api/v1/${id}`;
    fetch(SCORE_URL)
        .then(response => response.json())
        .then(data => {
            const score = data.response.score;
            const watchlist = document.getElementById("watchlist");
            const match = watchlist.querySelector(`[data-id="${id}"]`);
            match.innerText = `${data.response.title} (${score})`;
            setTimeout(() => {
                getScore(id);
            }, 10000);
        });
}

fetchMatches();
