const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
	'postgres://todo:todopassword@localhost:5432/todos',
	{
		logging: false,
	}
);

const TodoModel = sequelize.define(
	'Todo',
	{
		id: {
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
		},
		task: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		complete: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		tableName: 'todos',
		timestamps: false,
	}
);

module.exports = { TodoModel, sequelize };
