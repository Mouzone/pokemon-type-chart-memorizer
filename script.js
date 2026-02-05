import {
	createHeader,
	createRowHeader,
	createCell,
	createAllHeaderColumns,
	clearTable,
	createHeaderCell,
} from "./utility";

const types = Object.keys(multipliers);
const tbody = document.querySelector("tbody");

const radioButtons = document.querySelectorAll("input");
radioButtons.forEach((radio) => {
	radio.addEventListener("change", (event) => {
		clearTable();
		if (event.target.value === "table") {
			generateTable();
		} else if (event.target.value === "row") {
			generateRow();
		} else if (event.target.value === "cell") {
			generateCell();
		}
	});
});

function generateTable() {
	const header = createHeader();
	createAllHeaderColumns(header);

	types.forEach((attack) => {
		const row = document.createElement("tr");

		createRowHeader(row, attack);

		types.forEach((defense) => {
			createCell(row, attack, defense);
		});

		tbody.appendChild(row);
	});
}

function generateRow() {
	const header = createHeader();
	createAllHeaderColumns(header);

	const randomnAttack = types[Math.floor(Math.random() * types.length)];
	const row = document.createElement("tr");

	createRowHeader(row, randomnAttack);
	types.forEach((defense) => {
		createCell(row, randomnAttack, defense);
	});

	tbody.appendChild(row);
}

function generateCell() {
	const randomnDefense = types[Math.floor(Math.random() * types.length)];
	const randomnAttack = types[Math.floor(Math.random() * types.length)];

	const header = createHeader();
	createHeaderCell(header, randomnDefense);

	const row = document.createElement("tr");
	createRowHeader(row, attack);
	createCell(row, randomnAttack, randomnDefense);

	tbody.appendChild(row);
}
