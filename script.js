import {
	clearTable,
	generateTable,
	generateRow,
	generateCell,
} from "./utility.js";

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
