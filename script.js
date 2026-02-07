import {
	clearTable,
	generateTable,
	generateRow,
	generateCell,
	onClick,
} from "./utility.js";

import { multipliers, types } from "./data.js";

const tds = document.querySelectorAll("td");
tds.forEach((td) => {
	td.addEventListener("click", onClick);
});

const radioButtons = document.querySelectorAll("input");
radioButtons.forEach((radio) => {
	radio.addEventListener("change", (event) => {
		clearTable();
		const select = document.querySelector("select");
		if (select) {
			select.remove();
		}
		if (event.target.value === "table") {
			generateTable();
		} else if (event.target.value === "row") {
			generateRow("random");
			
			const select = document.createElement("select");
			const randomOption = document.createElement("option");
			randomOption.value = "random";
			randomOption.textContent = "Random";
			select.appendChild(randomOption);
			for (const type of types) {
				const option = document.createElement("option");
				option.value = type;
				option.textContent = type;
				select.appendChild(option);
			}
			const buttonsGroup = document.querySelector("div#buttons");
			buttonsGroup.appendChild(select)
		} else if (event.target.value === "cell") {
			generateCell();
		}
	});
});

const submitButton = document.querySelector("button#Submit");
submitButton.addEventListener("click", () => {
	const tds = document.querySelectorAll("td");
	tds.forEach((td) => {
		const attack = td.getAttribute("data-row");
		const defense = td.getAttribute("data-col");
		if (multipliers[attack][defense] === td.getAttribute("data-value")) {
			td.textContent = "✅";
			td.removeEventListener("click", onClick);
		}
	});
});

const generateButton = document.querySelector("button#Generate");
generateButton.addEventListener("click", () => {
	const selectedValue = document.querySelector(
		'input[name="to-display"]:checked',
	)?.value;
	clearTable();
	if (selectedValue === "table") {
		
		generateTable();
	} else if (selectedValue === "row") {
		const select = document.querySelector("select");
		const attack = select.value;
		generateRow(attack);
	} else if (selectedValue === "cell") {
		generateCell();
	}
});
