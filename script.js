import {
	clearTable,
	generateTable,
	generateRow,
	generateCell,
	onClick,
	validateAnswers,
	createTypeSelector,
	removeTypeSelector,
} from "./utility.js";

// Initialize Table
generateTable();

const buttonsGroup = document.querySelector("div#buttons");

// Initialize Type Selector (populated but disabled, value = Normal)
const initialSelect = createTypeSelector(() => {});
initialSelect.value = "Normal";
initialSelect.disabled = true;

const radioButtons = document.querySelectorAll("input");
radioButtons.forEach((radio) => {
	radio.addEventListener("change", (event) => {
		const mode = event.target.value;
		clearTable();
		
		// Handle Type Selector
		if (mode === "row") {
			const attackType = generateRow("random");
			const select = createTypeSelector((selectedType) => {
				clearTable();
				generateRow(selectedType);
			});
			select.value = attackType;
		} else {
			removeTypeSelector();
			if (mode === "table") {
				generateTable();
			} else if (mode === "cell") {
				generateCell();
			}
		}
	});
});

const submitButton = document.querySelector("button#Submit");
submitButton.addEventListener("click", validateAnswers);

const generateButton = document.querySelector("button#Generate");
generateButton.addEventListener("click", () => {
	const selectedValue = document.querySelector(
		'input[name="to-display"]:checked',
	)?.value;
	
	clearTable();
	
	if (selectedValue === "table") {
		generateTable();
	} else if (selectedValue === "row") {
		const attackType = generateRow("random");
		const select = buttonsGroup.querySelector("select");
		if (select) {
			select.value = attackType;
		}
	} else if (selectedValue === "cell") {
		generateCell();
	}
});
