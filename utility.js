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
	scored: true,
	expectedAttacks: [],
	targetMultipliers: []
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

export function generateMultiplierChallenge() {
	currentTest.mode = "multiplier";
	currentTest.scored = false;

	const isDual = Math.random() < 0.5;
	
	let def1, def2;
	if (isDual) {
		const randomPair = getWeightedRandom("columnDual", allColumnDualPairs).split("_");
		def1 = randomPair[0];
		def2 = randomPair[1];
	} else {
		def1 = getWeightedRandom("column", types);
		def2 = null;
	}

	const key = isDual ? def1 + "_" + def2 : def1;
	currentTest.key = key;

	const bands = [
		["0", "0.25", "0.5", "1"],
		["2", "4"]
	];

	const targetMultipliers = bands[Math.floor(Math.random() * bands.length)];
	currentTest.targetMultipliers = targetMultipliers;

	const expectedAttacks = [];
	types.forEach(attack => {
		let m;
		if (isDual) {
			m = (parseFloat(multipliers[attack][def1]) * parseFloat(multipliers[attack][def2])).toString();
		} else {
			m = multipliers[attack][def1];
		}
		if (targetMultipliers.includes(m)) {
			expectedAttacks.push(attack);
		}
	});
	currentTest.expectedAttacks = expectedAttacks;

	// UI Updates
	const headerContainer = document.getElementById("multiplier-defense-header");
	if (headerContainer) {
		headerContainer.replaceChildren();
		const d1 = document.createElement("div");
		d1.textContent = def1.slice(0, 3);
		d1.style.backgroundColor = `var(--type-${def1.toLowerCase()}-color)`;
		d1.style.color = "white";
		d1.style.fontWeight = "450";
		d1.style.width = "40px";
		d1.style.height = "40px";
		d1.style.display = "flex";
		d1.style.alignItems = "center";
		d1.style.justifyContent = "center";
		d1.style.boxSizing = "border-box";
		headerContainer.appendChild(d1);

		if (isDual) {
			const d2 = document.createElement("div");
			d2.textContent = def2.slice(0, 3);
			d2.style.backgroundColor = `var(--type-${def2.toLowerCase()}-color)`;
			d2.style.color = "white";
			d2.style.fontWeight = "450";
			d2.style.width = "40px";
			d2.style.height = "40px";
			d2.style.display = "flex";
			d2.style.alignItems = "center";
			d2.style.justifyContent = "center";
			d2.style.boxSizing = "border-box";
			headerContainer.appendChild(d2);
		}
	}

	const title = document.getElementById("multiplier-target-text");
	if (title) {
		title.replaceChildren();
		title.style.display = "flex";
		title.style.gap = "10px";
		title.style.justifyContent = "center";
		title.style.alignItems = "center";

		targetMultipliers.forEach(m => {
			const span = document.createElement("div");
			
			let displayStr = m;
			if (m === "0.5") displayStr = "½";
			if (m === "0.25") displayStr = "¼";
			
			span.textContent = displayStr;
			span.style.display = "flex";
			span.style.alignItems = "center";
			span.style.justifyContent = "center";
			span.style.width = "50px";
			span.style.height = "35px";
			span.style.border = "1px solid lightgray";
			span.style.fontWeight = "bold";
			span.style.fontSize = "1rem";
			
			if (m === "2") {
				span.style.backgroundColor = "var(--super-effective)";
				span.style.color = "rgb(255, 221, 87)";
			} else if (m === "4") {
				span.style.backgroundColor = "#2e7d32";
				span.style.color = "rgb(255, 221, 87)";
			} else if (m === "0.5") {
				span.style.backgroundColor = "var(--not-effective)";
				span.style.color = "rgb(255, 221, 87)";
			} else if (m === "0.25") {
				span.style.backgroundColor = "#c62828";
				span.style.color = "rgb(255, 221, 87)";
			} else if (m === "0") {
				span.style.backgroundColor = "var(--immune)";
				span.style.color = "rgb(255, 221, 87)";
			} else if (m === "1") {
				span.style.backgroundColor = "white";
				span.style.color = "#333";
			}

			title.appendChild(span);
		});
	}

	const grid = document.getElementById("multiplier-grid");
	if (grid) {
		grid.replaceChildren();
		types.forEach(attack => {
			const btn = document.createElement("div");
			btn.textContent = attack.slice(0, 3);
			btn.className = "multiplier-type-btn";
			btn.setAttribute("data-type", attack);
			btn.style.backgroundColor = `var(--type-${attack.toLowerCase()}-color)`;
			btn.onclick = () => {
				if (currentTest.scored) return;
				btn.classList.toggle("selected");
			};
			grid.appendChild(btn);
		});
	}
}

export function validateAnswers() {
	if (currentTest.mode === "multiplier") {
		const grid = document.getElementById("multiplier-grid");
		if (!grid) return;
		
		const buttons = grid.querySelectorAll(".multiplier-type-btn");
		let correctCount = 0;
		let falsePositives = 0;

		buttons.forEach(btn => {
			const type = btn.getAttribute("data-type");
			const isSelected = btn.classList.contains("selected");
			const isExpected = currentTest.expectedAttacks.includes(type);

			if (isSelected && isExpected) {
				btn.classList.add("correct");
				correctCount++;
			} else if (isSelected && !isExpected) {
				btn.classList.add("incorrect");
				falsePositives++;
			} else if (!isSelected && isExpected) {
				btn.classList.add("missed");
			}
		});

		if (!currentTest.scored) {
			currentTest.scored = true;
			const totalExpected = currentTest.expectedAttacks.length;
			let score = 1;
			if (totalExpected > 0) {
				score = Math.max(0, (correctCount - falsePositives) / totalExpected);
			} else {
				score = (falsePositives === 0) ? 1 : 0;
			}
			
			const currentWeight = weights[currentTest.mode]?.[currentTest.key] || 10;
			if (!weights[currentTest.mode]) weights[currentTest.mode] = {};
			if (score === 1) {
				weights[currentTest.mode][currentTest.key] = Math.max(1, currentWeight / 2);
			} else {
				const penalty = (1 - score) * 20; 
				weights[currentTest.mode][currentTest.key] = Math.min(100, currentWeight + penalty);
			}
		}
		return;
	}

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
	select.style.visibility = "visible";
	select.style.opacity = "1";
	return select;
}

export function removeTypeSelector(selectorId = "type-selector") {
	const select = document.getElementById(selectorId);
	if (select) {
		select.disabled = true;
		select.style.display = "";
		select.style.visibility = "visible";
		select.style.opacity = "0.5";
        select.value = "Normal";
	}
}
