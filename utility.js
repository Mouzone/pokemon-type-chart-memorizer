// Import data
import { valueOrder, types, multipliers } from "./data.js";

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

	td.addEventListener("click", onClick);
	return td;
}

export function onClick(event) {
	const cell = event.currentTarget;
	const currentValue = cell.getAttribute("data-value");
	const nextValue = valueOrder[currentValue];

	cell.setAttribute("data-value", nextValue);

	cell.textContent = nextValue != 1 ? nextValue : "";
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

export function generateRow(attack) {
	let attackType;
	if (attack === "random") {
		attackType = types[Math.floor(Math.random() * types.length)];
	} else {
		attackType = attack;
	}
	buildHeader(); // full header
	buildRow(attackType); // single, full row
	
	return attackType;
}

export function generateCell() {
	const randomDefense = types[Math.floor(Math.random() * types.length)];
	const randomAttack = types[Math.floor(Math.random() * types.length)];

	buildHeader([randomDefense]); // header with only one defense type
	buildRow(randomAttack, [randomDefense]); // row with only one cell
}

export function validateAnswers() {
	const tds = document.querySelectorAll("td");
	tds.forEach((td) => {
		const attack = td.getAttribute("data-row");
		const defense = td.getAttribute("data-col");
		if (multipliers[attack][defense] === td.getAttribute("data-value")) {
			td.textContent = "✅";
			td.removeEventListener("click", onClick);
		}
	});
}

export function createTypeSelector(container, onSelect) {
	const select = document.getElementById("type-selector");
	if (!select) return;

	// Populate if empty
	if (select.children.length === 0) {
		types.forEach((type) => {
			const option = document.createElement("option");
			option.value = type;
			option.textContent = type;
			select.appendChild(option);
		});
	}
	
	// Ensure we handle change properly. Since we can't easily remove anonymous listeners,
	// using onchange property is cleaner for this single-purpose element.
	select.onchange = (e) => onSelect(e.target.value);

	select.style.visibility = "visible";
	return select;
}

export function removeTypeSelector(container) {
	const select = document.getElementById("type-selector");
	if (select) {
		select.style.visibility = "hidden";
	}
}
