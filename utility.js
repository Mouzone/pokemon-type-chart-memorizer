// Import data
import { valueOrder, dualValueOrder, types, multipliers } from "./data.js";

const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");

// ===== PRE-COMPUTED CACHES =====
const allColumnDualPairs = [];
for (let i = 0; i < types.length; i++) {
	for (let j = i + 1; j < types.length; j++) {
		allColumnDualPairs.push(types[i] + "_" + types[j]);
	}
}

const allCells = [];
types.forEach(a => types.forEach(d => allCells.push(a + "_" + d)));

const allDualCells = [];
types.forEach(a => {
	for (let i = 0; i < types.length; i++) {
		for (let j = i + 1; j < types.length; j++) {
			allDualCells.push(a + "_" + types[i] + "_" + types[j]);
		}
	}
});

// ===== STATE MANAGEMENT =====
export const weights = {
	row: {},
	column: {},
	columnDual: {},
	cell: {},
	cellDual: {}
};

export const currentTest = {
	mode: null,
	key: null,
	scored: true
};

function getWeightedRandom(mode, possibleKeys) {
	const modeWeights = weights[mode];
	let totalWeight = 0;
	const keyWeights = possibleKeys.map(key => {
		const w = modeWeights[key] || 10;
		totalWeight += w;
		return { key, weight: w };
	});
	
	let random = Math.random() * totalWeight;
	for (const item of keyWeights) {
		random -= item.weight;
		if (random <= 0) return item.key;
	}
	return possibleKeys[possibleKeys.length - 1];
}

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

function createCell(attack, defense, isDual = false, defense2 = null) {
	const td = document.createElement("td");

	td.setAttribute("data-value", "blank");
	td.setAttribute("data-row", attack);
	td.setAttribute("data-col", defense);
	if (isDual) {
		td.setAttribute("data-dual", "true");
		td.setAttribute("data-col-2", defense2);
		td.setAttribute("colspan", "2");
	}

	// Removed individual click listener for event delegation
	return td;
}

// ===== EVENT DELEGATION =====
tbody.addEventListener("click", (event) => {
	const cell = event.target.closest("td");
	if (!cell) return;
	
	if (cell.getAttribute("data-locked") === "true") return;
	
	const currentValue = cell.getAttribute("data-value");
	const isDual = cell.getAttribute("data-dual") === "true";
	const order = isDual ? dualValueOrder : valueOrder;
	const nextValue = order[currentValue] || "blank";

	cell.setAttribute("data-value", nextValue);

	if (nextValue === "blank" || nextValue === "1") {
		cell.textContent = "";
	} else if (nextValue === "0.5") {
		cell.textContent = "½";
	} else if (nextValue === "0.25") {
		cell.textContent = "¼";
	} else {
		cell.textContent = nextValue;
	}
});

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
	return headerRow;
}

function buildRow(attack, defenseTypes = types, isDual = false) {
	const row = document.createElement("tr");
	row.appendChild(createRowHeader(attack));
	if (isDual) {
		row.appendChild(createCell(attack, defenseTypes[0], true, defenseTypes[1]));
	} else {
		defenseTypes.forEach((defense) => {
			row.appendChild(createCell(attack, defense));
		});
	}
	return row;
}

// ===== EXPORTED GENERATOR FUNCTIONS (main logic) =====

export function generateTable() {
	currentTest.mode = null;
	currentTest.scored = true;
	thead.appendChild(buildHeader()); // full header
	const fragment = document.createDocumentFragment();
	types.forEach((attack) => {
		fragment.appendChild(buildRow(attack)); // full row
	});
	tbody.appendChild(fragment);
}

export function generateRow(attack) {
	let attackType;
	if (attack === "random") {
		attackType = getWeightedRandom("row", types);
	} else {
		attackType = attack;
	}
	currentTest.mode = "row";
	currentTest.key = attackType;
	currentTest.scored = false;

	thead.appendChild(buildHeader()); // full header
	tbody.appendChild(buildRow(attackType)); // single, full row
	
	return attackType;
}

export function generateColumn(defense) {
	let defenseType;
	if (defense === "random") {
		defenseType = getWeightedRandom("column", types);
	} else {
		defenseType = defense;
	}
	currentTest.mode = "column";
	currentTest.key = defenseType;
	currentTest.scored = false;

	thead.appendChild(buildHeader([defenseType])); // header with only one defense type
	const fragment = document.createDocumentFragment();
	types.forEach((attack) => {
		fragment.appendChild(buildRow(attack, [defenseType])); // row with only one cell
	});
	tbody.appendChild(fragment);
	
	return defenseType;
}

export function generateDualColumn(defense1, defense2) {
	let def1 = defense1;
	let def2 = defense2;
	
	if (defense1 === "random" || defense2 === "random") {
		const randomPair = getWeightedRandom("columnDual", allColumnDualPairs).split("_");
		def1 = randomPair[0];
		def2 = randomPair[1];
	} else {
		const sorted = [defense1, defense2].sort();
		def1 = sorted[0];
		def2 = sorted[1];
	}

	currentTest.mode = "columnDual";
	currentTest.key = def1 + "_" + def2;
	currentTest.scored = false;

	thead.appendChild(buildHeader([def1, def2])); 
	const fragment = document.createDocumentFragment();
	types.forEach((attack) => {
		fragment.appendChild(buildRow(attack, [def1, def2], true));
	});
	tbody.appendChild(fragment);
	
	return [def1, def2];
}

export function generateCell() {
	const randomCell = getWeightedRandom("cell", allCells).split("_");
	const randomAttack = randomCell[0];
	const randomDefense = randomCell[1];

	currentTest.mode = "cell";
	currentTest.key = randomAttack + "_" + randomDefense;
	currentTest.scored = false;

	thead.appendChild(buildHeader([randomDefense])); 
	tbody.appendChild(buildRow(randomAttack, [randomDefense])); 
}

export function generateDualCell() {
	const randomDualCell = getWeightedRandom("cellDual", allDualCells).split("_");
	const randomAttack = randomDualCell[0];
	const randomDefense1 = randomDualCell[1];
	const randomDefense2 = randomDualCell[2];

	currentTest.mode = "cellDual";
	currentTest.key = randomAttack + "_" + randomDefense1 + "_" + randomDefense2;
	currentTest.scored = false;

	thead.appendChild(buildHeader([randomDefense1, randomDefense2])); 
	tbody.appendChild(buildRow(randomAttack, [randomDefense1, randomDefense2], true));
}

export function validateAnswers() {
	const tds = document.querySelectorAll("td");
	let correctCount = 0;
	tds.forEach((td) => {
		const attack = td.getAttribute("data-row");
		const defense = td.getAttribute("data-col");
		const isDual = td.getAttribute("data-dual") === "true";
		
		let expectedMultiplier;
		if (isDual) {
			const defense2 = td.getAttribute("data-col-2");
			const m1 = parseFloat(multipliers[attack][defense]);
			const m2 = parseFloat(multipliers[attack][defense2]);
			expectedMultiplier = (m1 * m2).toString();
		} else {
			expectedMultiplier = multipliers[attack][defense];
		}

		const userValue = td.getAttribute("data-value");
		const valToCompare = userValue === "blank" ? "1" : userValue;

		if (expectedMultiplier === valToCompare) {
			td.textContent = "✅";
			td.setAttribute("data-locked", "true");
			correctCount++;
		} else {
			td.textContent = "❌";
		}
	});

	if (currentTest.mode && !currentTest.scored && tds.length > 0) {
		currentTest.scored = true;
		const score = correctCount / tds.length;
		const currentWeight = weights[currentTest.mode][currentTest.key] || 10;
		
		if (score === 1) {
			weights[currentTest.mode][currentTest.key] = Math.max(1, currentWeight / 2);
		} else {
			const penalty = (1 - score) * 20; 
			weights[currentTest.mode][currentTest.key] = Math.min(100, currentWeight + penalty);
		}
		console.log(`Updated weight for ${currentTest.key} (${currentTest.mode}): ${weights[currentTest.mode][currentTest.key]}`);
	}
}

export function createTypeSelector(onSelect, selectorId = "type-selector") {
	const select = document.getElementById(selectorId);
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
	
	select.onchange = (e) => onSelect(e.target.value);

	select.disabled = false;
	select.style.display = ""; 
	return select;
}

export function removeTypeSelector(selectorId = "type-selector") {
	const select = document.getElementById(selectorId);
	if (select) {
		select.disabled = true;
        if (selectorId === "type-selector-2") {
			select.style.display = "none";
		}
        select.value = "Normal";
	}
}
