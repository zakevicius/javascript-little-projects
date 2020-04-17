const createSearchBar = ({
	root,
	renderOption,
	onOptionSelect,
	inputValue,
	fetchData,
}) => {
	root.innerHTML = `
    <label><b>Search...</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
    <div class="error"></div>
  `;

	const input = root.querySelector("input");
	const dropdown = root.querySelector(".dropdown");
	const resultsWrapper = root.querySelector(".results");
	const error = root.querySelector(".error");

	const onInput = async (event) => {
		resultsWrapper.innerHTML = "";
		error.innerHTML = "";

		const data = await fetchData(event.target.value);

		if (!data.items) {
			dropdown.classList.remove("is-active");
			return;
		}

		if (data.error) {
			const h2 = document.createElement("h2");

			h2.innerHTML = `${data.error}`;
			error.appendChild(h2);
		} else {
			dropdown.classList.add("is-active");
			for (let item of data.items) {
				const option = document.createElement("a");

				option.classList.add("dropdown-item");
				option.innerHTML = renderOption(item);

				option.addEventListener("click", () => {
					dropdown.classList.remove("is-active");
					input.value = inputValue(item);
					onOptionSelect(item);
				});

				resultsWrapper.appendChild(option);
			}
		}
	};

	input.addEventListener("input", debounce(onInput, 1000));
	document.addEventListener("click", (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove("is-active");
		}
	});
};
