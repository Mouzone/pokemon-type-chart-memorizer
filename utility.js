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
