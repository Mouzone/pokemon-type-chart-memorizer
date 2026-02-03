import multipliers from "./multipliers.json";

const cells = document.querySelectorAll("td[data-row][data-col]");
cells.forEach((cell) => {
	cell.textContent = multipliers[cell.dataset.row][cell.dataset.col];
});
