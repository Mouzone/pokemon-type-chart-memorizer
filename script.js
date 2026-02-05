import multipliers from "./multipliers.json" with { type: "json" };

const tbody = document.querySelector("tbody");
const thead = document.querySelector("thead");
const radioButtons = document.querySelectorAll("input");

radioButtons.forEach((radio) => {
	radio.addEventListener("change", (event) => {
		tbody.replaceChildren();
		thead.replaceChildren();
		if (event.target.value === "table") {
			createTable();
		} else if (event.target.value === "row") {
			createRow();
		} else if (event.target.value === "cell") {
		}
	});
});

function createTable() {
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
}

function createRow() {
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

	// randomnly generate an attack type
	const randomnAttack = types[Math.floor(Math.random() * types.length)];
	const row = document.createElement("tr");

	const rowHeader = document.createElement("th");
	rowHeader.textContent = randomnAttack;
	rowHeader.setAttribute("data-type", randomnAttack);
	row.appendChild(rowHeader);

	types.forEach((defense) => {
		const td = document.createElement("td");
		const multiplier = multipliers[randomnAttack][defense];

		if (multiplier !== 1) {
			td.textContent = multiplier;
		}

		td.setAttribute("data-value", multiplier);
		td.setAttribute("data-row", randomnAttack);
		td.setAttribute("data-col", defense);

		row.appendChild(td);
	});

	tbody.appendChild(row);
}
