import {
	clearTable,
	generateTable,
	generateRow,
	generateCell,
	onClick,
} from "./utility.js";

import { multipliers } from "./data.js";

const tds = document.querySelectorAll("td");
tds.forEach((td) => {
	td.addEventListener("click", onClick);
});

const radioButtons = document.querySelectorAll("input");
radioButtons.forEach((radio) => {
	radio.addEventListener("change", (event) => {
		clearTable();
		if (event.target.value === "table") {
			generateTable();
		} else if (event.target.value === "row") {
			generateRow();
		} else if (event.target.value === "cell") {
			generateCell();
		}
	});
});

const button = document.querySelector("button");
button.addEventListener("click", () => {
	const tds = document.querySelectorAll("td");
	tds.forEach((td) => {
		const attack = td.getAttribute("data-row");
		const defense = td.getAttribute("data-col");
		if (
			`${multipliers[attack][defense]}` === td.getAttribute("data-value")
		) {
			td.textContent = "✅";
			td.removeEventListener("click", onClick);
		}
	});
});
