import {
	clearTable,
	generateTable,
	generateRow,
	generateCell,
	generateColumn,
	generateDualColumn,
	generateDualCell,
	validateAnswers,
	createTypeSelector,
	removeTypeSelector,
	generateMultiplierChallenge,
} from "./utility.js";

const buttonsGroup = document.querySelector("div#buttons");
const tableContainer = document.querySelector("div#table-container");
const dualModeContainer = document.getElementById("dual-mode-container");
const dualModeCheckbox = document.getElementById("dual-mode");

const initialSelect = createTypeSelector(() => {});
initialSelect.value = "Normal";
initialSelect.disabled = true;

const initialSelect2 = createTypeSelector(() => {}, "type-selector-2");
initialSelect2.value = "Normal";
initialSelect2.disabled = true;

function renderTable() {
	const mode = document.querySelector('input[name="to-display"]:checked')?.value;
	const isDual = dualModeCheckbox.checked;
	
	clearTable();
	
	const tableContainer = document.querySelector("div#table-container");
	const multiplierContainer = document.getElementById("multiplier-mode-container");
	
	if (mode === "column" || mode === "cell") {
		dualModeContainer.style.visibility = "visible";
		dualModeContainer.style.opacity = "1";
		dualModeCheckbox.disabled = false;
	} else {
		dualModeContainer.style.visibility = "visible";
		dualModeContainer.style.opacity = "0.5";
		dualModeCheckbox.disabled = true;
	}

	if (mode === "multiplier") {
		tableContainer.style.display = "none";
		multiplierContainer.style.display = "flex";
		removeTypeSelector("type-selector");
		removeTypeSelector("type-selector-2");
		dualModeContainer.style.opacity = "0.5";
		dualModeCheckbox.disabled = true;
		
		generateMultiplierChallenge();
		return;
	} else {
		tableContainer.style.display = "flex";
		multiplierContainer.style.display = "none";
	}
	
	
	if (mode === "row") {
		removeTypeSelector("type-selector-2");
		const attackType = generateRow("random");
		const select = createTypeSelector((selectedType) => {
			clearTable();
			generateRow(selectedType);
		}, "type-selector");
		select.value = attackType;
	} else if (mode === "column") {
		if (isDual) {
			const types = generateDualColumn("random", "random");
			const select1 = createTypeSelector((selectedType) => {
				const select2 = document.getElementById("type-selector-2");
				clearTable();
				generateDualColumn(selectedType, select2.value);
			}, "type-selector");
			const select2 = createTypeSelector((selectedType) => {
				const select1 = document.getElementById("type-selector");
				clearTable();
				generateDualColumn(select1.value, selectedType);
			}, "type-selector-2");
			select1.value = types[0];
			select2.value = types[1];
		} else {
			removeTypeSelector("type-selector-2");
			const defenseType = generateColumn("random");
			const select = createTypeSelector((selectedType) => {
				clearTable();
				generateColumn(selectedType);
			}, "type-selector");
			select.value = defenseType;
		}
	} else {
		removeTypeSelector("type-selector");
		removeTypeSelector("type-selector-2");
		if (mode === "table") {
			generateTable();
		} else if (mode === "cell") {
			if (isDual) {
				generateDualCell();
			} else {
				generateCell();
			}
		}
	}

	const table = document.querySelector("table");
	if (table) {
		if (mode === "column" || mode === "cell") {
			table.className = isDual ? "mode-dual-small" : "mode-single-small";
		} else {
			table.className = "";
		}
	}
}

const radioButtons = document.querySelectorAll('input[name="to-display"]');
radioButtons.forEach((radio) => {
	radio.addEventListener("change", renderTable);
});

dualModeCheckbox.addEventListener("change", renderTable);

const generateButton = document.querySelector("button#Generate");
generateButton.addEventListener("click", renderTable);

const submitButton = document.querySelector("button#Submit");
submitButton.addEventListener("click", validateAnswers);

// Initialize
renderTable();
