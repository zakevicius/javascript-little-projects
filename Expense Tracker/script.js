const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// const dummyTransactions = [
// 	{
// 		id: 1,
// 		text: "Flower",
// 		amount: -20
// 	},
// 	{
// 		id: 2,
// 		text: "Salary",
// 		amount: 300
// 	},
// 	{
// 		id: 3,
// 		text: "Book",
// 		amount: -10
// 	},
// 	{
// 		id: 4,
// 		text: "Camera",
// 		amount: 150
// 	}
// ];

const localStorageTransactions = JSON.parse(
	localStorage.getItem("transactions")
);

let transactions =
	localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add new transaction
function addTransaction(e) {
	e.preventDefault();
	if (text.value.trim() === "" || amount.value.trim() === "") {
		alert("Please add a text and amount");
	} else {
		const transaction = {
			id: generateID(),
			text: text.value,
			amount: +amount.value
		};
		transactions.push(transaction);
		addTransactionDOM(transaction);
		updateValues();

		updateLocalStorage();

		text.value = "";
		amount.value = "";
	}
}

// Generate random ID
function generateID() {
	return Math.floor(Math.random() * 1000000000);
}

// Add trasactions to DOM list
function addTransactionDOM(transaction) {
	const { id, text, amount } = transaction;

	const sign = amount < 0 ? "-" : "+";

	const item = document.createElement("li");

	item.classList.add(`${sign === "-" ? "minus" : "plus"}`);
	item.innerHTML = `
    ${text} <span>${sign}${Math.abs(
		amount
	)}</span> <button class="delete-btn" onclick="removeTransaction(${
		transaction.id
	})">X</button>
  `;
	list.appendChild(item);
}

// Updates the balance, income, expense
function updateValues() {
	const amounts = transactions.map(transaction => transaction.amount);

	const total = amounts.reduce((acc, cur) => (acc += cur), 0).toFixed(2);

	const income = amounts
		.reduce((acc, cur) => (acc += cur > 0 ? cur : 0), 0)
		.toFixed(2);

	const expense = (
		amounts.reduce((acc, cur) => (acc += cur < 0 ? cur : 0), 0) * -1
	).toFixed(2);

	balance.innerText = `$${total}`;
	money_plus.innerText = `$${income}`;
	money_minus.innerText = `$${expense}`;
}

// Remove tansaction by ID
function removeTransaction(id) {
	transactions = transactions.filter(item => item.id !== id);

	init();

	updateLocalStorage();
}

// Update local storage transactions
function updateLocalStorage() {
	localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init app
function init() {
	list.innerHTML = "";

	transactions.forEach(addTransactionDOM);
	updateValues();
}

init();

form.addEventListener("submit", addTransaction);
