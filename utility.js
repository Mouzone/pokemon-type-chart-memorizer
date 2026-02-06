// Import data
import { valueOrder, types } from "./data.js";

// Keep DOM element references at the top
const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");

// ===== LOW-LEVEL DOM HELPERS (mostly pure) =====

function createCornerCell() {
	const cornerCell = document.createElement("th");
	cornerCell.className = "corner-cell";
	cornerCell.innerText = "DEFENSE →\nATTACK ↴";
	return cornerCell;
}

function createHeaderCell(type) {
	const th = document.createElement("th");
	th.textContent = type.slice(0, 3);
	th.setAttribute("data-type", type);
	return th;
}

function createRowHeader(attack) {
	const th = document.createElement("th");
	th.textContent = attack;
	th.setAttribute("data-type", attack);
	return th;
}

function createCell(attack, defense) {
	const td = document.createElement("td");

	td.setAttribute("data-value", "1");
	td.setAttribute("data-row", attack);
	td.setAttribute("data-col", defense);

	td.addEventListener("click", () => {
		const currentValue = td.getAttribute("data-value");

		const nextValue = valueOrder[currentValue];

		td.setAttribute("data-value", nextValue);
		td.textContent = nextValue !== "1" ? nextValue : "";
	});
	return td;
}

// ===== COMPOSITE UI BUILDERS (less pure, have side effects) =====

export function clearTable() {
	tbody.replaceChildren();
	thead.replaceChildren();
}

function buildHeader(defenseTypes = types) {
	const headerRow = document.createElement("tr");
	headerRow.appendChild(createCornerCell());
	defenseTypes.forEach((type) => {
		headerRow.appendChild(createHeaderCell(type));
	});
	thead.appendChild(headerRow);
}

function buildRow(attack, defenseTypes = types) {
	const row = document.createElement("tr");
	row.appendChild(createRowHeader(attack));
	defenseTypes.forEach((defense) => {
		row.appendChild(createCell(attack, defense));
	});
	tbody.appendChild(row);
}

// ===== EXPORTED GENERATOR FUNCTIONS (main logic) =====

export function generateTable() {
	buildHeader(); // full header
	types.forEach((attack) => {
		buildRow(attack); // full row
	});
}

export function generateRow() {
	const randomAttack = types[Math.floor(Math.random() * types.length)];
	buildHeader(); // full header
	buildRow(randomAttack); // single, full row
}

export function generateCell() {
	const randomDefense = types[Math.floor(Math.random() * types.length)];
	const randomAttack = types[Math.floor(Math.random() * types.length)];

	buildHeader([randomDefense]); // header with only one defense type
	buildRow(randomAttack, [randomDefense]); // row with only one cell
}
