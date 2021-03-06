let leftMovie;
let rightMovie;

const fetchSingleData = async (movie, summaryEl, side) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "ffc78ef0",
			i: movie.imdbID,
		},
	});

	summaryEl.innerHTML = movieTemplate(response.data);

	side === "left" ? (leftMovie = response.data) : (rightMovie = response.data);

	if (leftMovie && rightMovie) {
		runComparison();
	}
};

const runComparison = () => {
	const leftStats = document.querySelectorAll("#left-summary .notification");
	const rightStats = document.querySelectorAll("#right-summary .notification");

	leftStats.forEach((leftStat, i) => {
		const rightStat = rightStats[i];

		const leftValue = leftStat.dataset.value;
		const rightValue = rightStat.dataset.value;

		if (+rightValue > +leftValue) {
			leftStat.classList.remove("is-primary");
			leftStat.classList.add("is-warning");
		} else {
			rightStat.classList.remove("is-primary");
			rightStat.classList.add("is-warning");
		}
	});
};

const movieTemplate = (movieDetail) => {
	const dollars = parseInt(
		movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
	);
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
	const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster} alt="poster" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

const debounce = (func, delay = 1000) => {
	let timeoutId;

	return (...arguments) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func.apply(null, arguments);
		}, delay);
	};
};
