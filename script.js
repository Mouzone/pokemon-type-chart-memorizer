import multipliers from "./multipliers.json" with { type: "json" };

const cells = document.querySelectorAll("td[data-row][data-col]");
cells.forEach((cell) => {
	const multiplier = multipliers[cell.dataset.row][cell.dataset.col];
	if (multiplier !== 1) {
		cell.textContent = multiplier;
	}
});
