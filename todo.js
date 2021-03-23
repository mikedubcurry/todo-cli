const { TodoModel: Model } = require('./model');

class Todo {
	constructor() {}

	async getTodos() {
		try {
			const todos = await Model.findAll();
			return reduceTodos(todos);
		} catch (e) {
			throw Error('failed getting todos');
		}
	}

	async newTodo(task) {
		if (!task) throw Error('`task` must be a string');
		try {
			const newTodo = await Model.create({
				task: task.toString(),
				complete: false,
			});
			await newTodo.save();
			return newTodo.dataValues;
		} catch (e) {
			throw Error('failed to save task');
		}
	}

	async deleteTodo(id) {
		if (!id) throw Error('must supply `id` to delete an object');
		try {
			const todo = await Model.findOne({ where: { id } });
			if (!todo) {
				throw Error(`object with id: ${id} does not exist`);
			}

			const deleted = await Model.destroy({ where: { id } });
			if (!deleted) {
				throw Error(`failed to delete object with id: ${id}`);
			}
			return todo.dataValues;
		} catch (e) {
			throw Error(e.message);
		}
	}

	async toggleComplete(id) {
		if (!id) throw Error('must supply `id` to update an object');
		if (!parseInt(id)) throw Error('id must be an integer');
		try {
			const todo = await Model.findOne({ where: { id } });
			if (!todo) {
				throw Error(`object with id: ${id} does not exist`);
			}
			const complete = todo.dataValues.complete;
			const updated = await Model.update(
				{ complete: !complete },
				{ where: { id } }
			);
			if (updated) {
				const newTodo = await Model.findOne({ where: { id } });
				return newTodo.dataValues;
			} else {
				throw Error(`object with id: ${id} does not exist`);
			}
		} catch (e) {
			throw Error(e.message);
		}
	}

	async editTask(id, newTask) {
		if (!id) throw Error('must supply `id` to update an object');
		if (!newTask) throw Error('must supply `newTask` to edit object');
		try {
			const [editted] = await Model.update(
				{ task: newTask },
				{ where: { id } }
			);

			if (editted) {
				const updated = await Model.findOne({ where: { id } });
				return updated.dataValues;
			} else {
				throw Error(`object with id: ${id} does not exist`);
			}
		} catch (e) {
			throw Error(e.message);
		}
	}
}

module.exports = {
	Todo,
};

function reduceTodos(todos) {
	if (!todos.length) return [];
	return todos.map(({ dataValues }) => ({
		id: dataValues.id,
		task: dataValues.task,
		complete: dataValues.complete,
	}));
}
