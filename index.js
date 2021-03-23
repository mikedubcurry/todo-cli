const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

const { Todo } = require('./todo');
const { sequelize } = require('./model');
function run() {
	const td = new Todo();

	readline.question('Enter a command:', async (answer) => {
		if (!answer) {
			console.clear();
			printOptions();
			run();
			return;
		}
		let [option, ...input] = answer.trim();
		input = input.join('');

		if (!option) {
			printOptions();
			run();
			return;
		}

		switch (option.toLowerCase()) {
			case 'n':
				if (!input) {
					printOptions();
					break;
				}
				try {
					const newTodo = await td.newTodo(input);
					console.table([newTodo]);
				} catch (e) {
					console.log(e.message);
				}
				break;
			case 'e':
				const [id, text] = input.split(',');
				const updated = await td.editTask(id, text.trim());
				console.table([updated]);
				break;
			case 'c':
				try {
					const toggled = await td.toggleComplete(input);
					console.table([toggled]);
				} catch (e) {
					console.log(e.message);
				}
				break;
			case 'd':
				try {
					const todo = await td.deleteTodo(input);
					console.table([todo]);
				} catch (e) {
					console.log(e.message);
				}
				break;
			case 'a':
				try {
					const todos = await td.getTodos();
					console.table(todos);
				} catch (e) {
					console.log(e.message);
				}
				break;
			case 'h':
				printOptions();
				break;
			case 'q':
				console.clear();
				console.log('Bye Bye!');
				sequelize.close();
				process.exit(0);
			default:
				printOptions();
				break;
		}
		run();
	});
}

function printTitleMessage() {
	console.clear();
	console.log('~~~~~~~~~~~~~~		To-Do-Two: The SQL		~~~~~~~~~~~~~~');
}

function printOptions() {
	console.log(
		"\nenter an option (n, e, d, ...) followed by option parameters separated\nby a comma denoted by '<args>' separated by space and press ENTER"
	);
	console.log('\nOptions:');
	console.log('\ta - view all tasks');
	console.log('\tn <taskText> - create a new task');
	console.log('\te <taskID, taskText> - edit a task');
	console.log("\tc <taskID> - toggle task's complete status");
	console.log('\td <taskID> - delete a task');
	console.log('\th - view Options');
	console.log('\tq - quit program');
}

sequelize
	.authenticate()
	.then(async () => {
		console.log('connected to db');
		// const td = new Todo();
		printTitleMessage();
		printOptions();
		run();
	})
	.catch((e) => {
		console.error(e);
	});
