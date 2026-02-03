import multipliers from "./multipliers.json" with { type: "json" };

const tbody = document.querySelector("tbody");
const thead = document.querySelector("thead");
const types = Object.keys(multipliers);

const header = document.createElement("tr");
const th = document.createElement("th");
th.className = "corner-cell";
th.innerText = "DEFENSE →\nATTACK ↴";
header.appendChild(th);
types.forEach((type) => {
	const th = document.createElement("th");
	th.textContent = type.slice(0, 3);
	th.setAttribute("data-type", type);
	header.appendChild(th);
});
thead.appendChild(header);

types.forEach((attack) => {
	const row = document.createElement("tr");

	const th = document.createElement("th");
	th.textContent = attack;
	th.setAttribute("data-type", attack);
	row.appendChild(th);

	types.forEach((defense) => {
		const td = document.createElement("td");
		const multiplier = multipliers[attack][defense];

		if (multiplier !== 1) {
			td.textContent = multiplier;
		}

		td.setAttribute("data-value", multiplier);
		td.setAttribute("data-row", attack);
		td.setAttribute("data-col", defense);

		row.appendChild(td);
	});

	tbody.appendChild(row);
});
