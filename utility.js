import multipliers from "./multipliers.json" with { type: "json" };

const types = Object.keys(multipliers);
const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");

export function clearTable() {
	tbody.replaceChildren();
	thead.replaceChildren();
}
export function createHeader() {
	const header = document.createElement("tr");
	const cornerCell = document.createElement("th");
	cornerCell.className = "corner-cell";
	cornerCell.innerText = "DEFENSE →\nATTACK ↴";
	header.appendChild(cornerCell);

	return header;
}

export function createHeaderCell(header, type) {
	const th = document.createElement("th");
	th.textContent = type.slice(0, 3);
	th.setAttribute("data-type", type);
	header.appendChild(th);
}

export function createAllHeaderColumns(header) {
	types.forEach((type) => {
		createHeaderCell(header, type);
	});
	thead.appendChild(header);
}

export function createRowHeader(row, attack) {
	const th = document.createElement("th");
	th.textContent = attack;
	th.setAttribute("data-type", attack);
	row.appendChild(th);
}

export function createCell(row, attack, defense) {
	const td = document.createElement("td");
	const multiplier = multipliers[attack][defense];

	if (multiplier !== 1) {
		td.textContent = multiplier;
	}

	td.setAttribute("data-value", multiplier);
	td.setAttribute("data-row", attack);
	td.setAttribute("data-col", defense);

	row.appendChild(td);
}

export function generateTable() {
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

export function generateRow() {
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

export function generateCell() {
	const randomnDefense = types[Math.floor(Math.random() * types.length)];
	const randomnAttack = types[Math.floor(Math.random() * types.length)];

	const header = createHeader();
	createHeaderCell(header, randomnDefense);
	thead.appendChild(header);

	const row = document.createElement("tr");
	createRowHeader(row, randomnAttack);
	createCell(row, randomnAttack, randomnDefense);

	tbody.appendChild(row);
}
