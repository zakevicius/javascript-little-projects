const searchBarConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
		return `
      <img src="${imgSrc}" alt=${movie.Title} />
      ${movie.Title} (${movie.Year})
    `;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		const response = await axios.get("http://www.omdbapi.com/", {
			params: {
				apikey: "ffc78ef0",
				s: searchTerm,
			},
		});
		return response.data.Error
			? { error: response.data.Error }
			: { items: response.data.Search };
	},
};

createSearchBar({
	...searchBarConfig,
	root: document.querySelector("#left-searchBar"),
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		fetchSingleData(movie, document.querySelector("#left-summary"), "left");
	},
});
createSearchBar({
	...searchBarConfig,
	root: document.querySelector("#right-searchBar"),
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		fetchSingleData(movie, document.querySelector("#right-summary"), "right");
	},
});
