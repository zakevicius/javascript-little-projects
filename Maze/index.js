const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const CELLS_HORIZONTAL = 30;
const CELLS_VERTICAL = 20;
const CELL_LENGTH_X = WIDTH / CELLS_HORIZONTAL;
const CELL_LENGTH_Y = HEIGHT / CELLS_VERTICAL;

const WALL_SIZE = Math.min(CELL_LENGTH_X, CELL_LENGTH_Y) * 0.1;
const BALL_SIZE = Math.min(CELL_LENGTH_X, CELL_LENGTH_Y) * 0.25;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		wireframes: false,
		width: WIDTH,
		height: HEIGHT,
	},
});

engine.world.gravity.y = 0;

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const boundaries = [
	Bodies.rectangle(WIDTH / 2, 0, WIDTH, 2, { isStatic: true }),
	Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 2, { isStatic: true }),
	Bodies.rectangle(0, HEIGHT / 2, 2, HEIGHT, { isStatic: true }),
	Bodies.rectangle(WIDTH, HEIGHT / 2, 2, HEIGHT, { isStatic: true }),
];

World.add(world, boundaries);

// Maze generator

const shuffle = (arr) => {
	let counter = arr.length;

	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}

	return arr;
};

const grid = Array(CELLS_VERTICAL)
	.fill(null)
	.map(() => Array(CELLS_HORIZONTAL).fill(false));

const verticals = Array(CELLS_VERTICAL)
	.fill(null)
	.map(() => Array(CELLS_HORIZONTAL - 1).fill(false));
const horizontals = Array(CELLS_VERTICAL - 1)
	.fill(null)
	.map(() => Array(CELLS_HORIZONTAL).fill(false));

const startRow = Math.floor(Math.random() * CELLS_VERTICAL);
const startColumn = Math.floor(Math.random() * CELLS_HORIZONTAL);

const stepThroughCell = (row, column) => {
	// If cell at [row, column] is visited, then return
	if (grid[row][column]) return;

	// Mark cell as visited
	grid[row][column] = true;

	// Assemble random list of neighbors
	const neighbors = shuffle([
		[row - 1, column, "up"],
		[row, column + 1, "right"],
		[row + 1, column, "down"],
		[row, column - 1, "left"],
	]);

	// For each neighbor
	for (let neighbor of neighbors) {
		const [nextRow, nextColumn, direction] = neighbor;

		// Check if neighbor is not outside bounds
		if (
			nextRow < 0 ||
			nextRow >= CELLS_VERTICAL ||
			nextColumn < 0 ||
			nextColumn >= CELLS_HORIZONTAL
		) {
			continue;
		}

		// If that neighbor is visited continue to next neighbor
		if (grid[nextRow][nextColumn]) continue;

		// Remove a wall from horizontals or verticals
		switch (direction) {
			case "up":
				horizontals[row - 1][column] = true;
				break;
			case "right":
				verticals[row][column] = true;
				break;
			case "down":
				horizontals[row][column] = true;
				break;
			case "left":
				verticals[row][column - 1] = true;
				break;
			default:
				console.log("direction unknow");
		}

		// Visit next cell

		stepThroughCell(nextRow, nextColumn);
	}
};

stepThroughCell(startRow, startColumn);

// Create walls

horizontals.forEach((row, rowIndex) => {
	row.forEach((noWall, columnIndex) => {
		if (noWall) return;

		const wall = Bodies.rectangle(
			columnIndex * CELL_LENGTH_X + CELL_LENGTH_X / 2,
			rowIndex * CELL_LENGTH_Y + CELL_LENGTH_Y,
			CELL_LENGTH_X + WALL_SIZE,
			WALL_SIZE,
			{
				isStatic: true,
				label: "wall",
				render: {
					fillStyle: "tomato",
				},
			}
		);

		World.add(world, wall);
	});
});

verticals.forEach((row, rowIndex) => {
	row.forEach((noWall, columnIndex) => {
		if (noWall) return;

		const wall = Bodies.rectangle(
			columnIndex * CELL_LENGTH_X + CELL_LENGTH_X,
			rowIndex * CELL_LENGTH_Y + CELL_LENGTH_Y / 2,
			WALL_SIZE,
			CELL_LENGTH_Y + WALL_SIZE,
			{
				isStatic: true,
				label: "wall",
				render: {
					fillStyle: "tomato",
				},
			}
		);

		World.add(world, wall);
	});
});

// Adding goal

const goal = Bodies.rectangle(
	WIDTH - CELL_LENGTH_X / 2,
	HEIGHT - CELL_LENGTH_Y / 2,
	CELL_LENGTH_X * 0.7,
	CELL_LENGTH_Y * 0.7,
	{
		isStatic: true,
		label: "goal",
		render: {
			fillStyle: "lime",
		},
	}
);

World.add(world, goal);

// Adding ball

const ball = Bodies.circle(CELL_LENGTH_X / 2, CELL_LENGTH_Y / 2, BALL_SIZE, {
	label: "ball",
	render: {
		fillStyle: "pink",
	},
});

World.add(world, ball);

// Controls

document.addEventListener("keydown", (e) => {
	const { x, y } = ball.velocity;

	switch (e.keyCode) {
		case 87:
			Body.setVelocity(ball, { x, y: y - 5 });
			break;
		case 68:
			Body.setVelocity(ball, { x: x + 5, y });
			break;
		case 83:
			Body.setVelocity(ball, { x, y: y + 5 });
			break;
		case 65:
			Body.setVelocity(ball, { x: x - 5, y });
			break;
		default:
			break;
	}
});

// Win condition

Events.on(engine, "collisionStart", (e) => {
	e.pairs.forEach((collision, i) => {
		const labels = ["ball", "goal"];

		if (
			labels.includes(collision.bodyA.label) &&
			labels.includes(collision.bodyB.label)
		) {
			document.querySelector(".winner").classList.remove("hidden");
			world.gravity.y = 1;
			world.bodies.forEach((body, i) => {
				if (body.label === "wall") {
					Body.setStatic(body, false);
				}
			});
		}
	});
});
