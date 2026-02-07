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

// Add click listeners to any initial table cells (though usually table is empty on load)
const tds = document.querySelectorAll("td");
tds.forEach((td) => {
	td.addEventListener("click", onClick);
});

const buttonsGroup = document.querySelector("div#buttons");

const radioButtons = document.querySelectorAll("input");
radioButtons.forEach((radio) => {
	radio.addEventListener("change", (event) => {
		const mode = event.target.value;
		clearTable();
		
		// Handle Type Selector
		if (mode === "row") {
			const attackType = generateRow("random");
			const select = createTypeSelector(buttonsGroup, (selectedType) => {
				clearTable();
				generateRow(selectedType);
			});
			select.value = attackType;
		} else {
			removeTypeSelector(buttonsGroup);
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
